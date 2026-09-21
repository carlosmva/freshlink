const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { ensureAdminRole } = require('../db/reset-demo.cjs');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

(async () => {
  const url = (process.env.DATABASE_URL || '').replace(/^['"]|['"]$/g, '');
  const client = new Client({
    connectionString: url,
    ssl: url.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();
  await ensureAdminRole(client);
  await client.query(
    `INSERT INTO users (id, email, password_hash, name, role, facility_id, partner_id, status)
     VALUES (
       '77777777-7777-7777-7777-777777777704',
       'carlos@northeasternsoftware.com',
       '$2b$10$KU8K71Atf.UjMSmJuFkm6OYsjEmCPFs0yKGxtNANqw1fh5RIG5noa',
       'Carlos Martinez',
       'admin',
       NULL,
       NULL,
       'active'
     )
     ON CONFLICT (email) DO UPDATE SET
       role = 'admin',
       facility_id = NULL,
       partner_id = NULL,
       status = 'active',
       password_hash = EXCLUDED.password_hash,
       name = EXCLUDED.name`,
  );
  const rows = await client.query(`SELECT email, role FROM users WHERE role = 'admin'`);
  console.log('Admin ready:', rows.rows);
  await client.end();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
