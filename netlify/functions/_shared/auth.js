const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('./db');

const TOKEN_TTL = process.env.JWT_TTL || '7d';

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return secret;
}

function bearerToken(event) {
  const header = event.headers?.authorization || event.headers?.Authorization || '';
  const match = String(header).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function publicUser(row) {
  if (!row) return null;
  const initials =
    row.name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'FL';
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    facilityId: row.facility_id || null,
    partnerId: row.partner_id || null,
    orgName: row.org_name || null,
    orgSlug: row.org_slug || null,
    initials,
    status: row.status,
  };
}

async function findUserByEmail(email) {
  const res = await query(
    `SELECT u.*,
       CASE
         WHEN u.role = 'facility' THEN f.name
         ELSE p.name
       END AS org_name,
       CASE
         WHEN u.role = 'facility' THEN f.slug
         ELSE p.slug
       END AS org_slug
     FROM users u
     LEFT JOIN facilities f ON f.id = u.facility_id
     LEFT JOIN partners p ON p.id = u.partner_id
     WHERE lower(u.email) = lower($1)
     LIMIT 1`,
    [email],
  );
  return res.rows[0] || null;
}

async function findUserById(id) {
  const res = await query(
    `SELECT u.*,
       CASE
         WHEN u.role = 'facility' THEN f.name
         ELSE p.name
       END AS org_name,
       CASE
         WHEN u.role = 'facility' THEN f.slug
         ELSE p.slug
       END AS org_slug
     FROM users u
     LEFT JOIN facilities f ON f.id = u.facility_id
     LEFT JOIN partners p ON p.id = u.partner_id
     WHERE u.id = $1
     LIMIT 1`,
    [id],
  );
  return res.rows[0] || null;
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      facilityId: user.facility_id || null,
      partnerId: user.partner_id || null,
    },
    jwtSecret(),
    { expiresIn: TOKEN_TTL },
  );
}

async function login({ email, password, persona }) {
  // turnstileToken is accepted and ignored until Cloudflare Turnstile is wired.
  const user = await findUserByEmail(String(email || '').trim());
  const dummy = '$2b$10$ew8EOBhWJAtaeWforjtOc.jLCTuWhFcsG95OLj3anhequjbwoFXuS';
  const hash = user?.password_hash || dummy;
  const ok = await bcrypt.compare(String(password || ''), hash);
  if (!user || !ok || user.status !== 'active') {
    return { error: 'Invalid email or password', status: 401 };
  }
  if (persona && persona !== user.role) {
    return { error: 'This account does not match this portal', status: 403 };
  }
  await query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [user.id]);
  return { token: signToken(user), user: publicUser(user) };
}

function requireAuth(event) {
  const token = bearerToken(event);
  if (!token) {
    const err = new Error('Authentication required');
    err.statusCode = 401;
    throw err;
  }
  try {
    const payload = jwt.verify(token, jwtSecret());
    return {
      id: payload.sub,
      role: payload.role,
      facilityId: payload.facilityId || null,
      partnerId: payload.partnerId || null,
    };
  } catch {
    const err = new Error('Invalid or expired session');
    err.statusCode = 401;
    throw err;
  }
}

function requireRole(auth, roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(auth.role)) {
    const err = new Error('Not allowed for this portal');
    err.statusCode = 403;
    throw err;
  }
  return auth;
}

module.exports = {
  login,
  findUserById,
  publicUser,
  requireAuth,
  requireRole,
  signToken,
};
