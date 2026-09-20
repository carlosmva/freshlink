/** Cloudflare dummy keys for local / Netlify Dev. Not used on the live site. */
const DEV_SITE_KEY = '1x00000000000000000000AA';
const DEV_SECRET_KEY = '1x0000000000000000000000000000000AA';

function envVal(name) {
  return String(process.env[name] || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

/** Dummy keys only for `netlify dev`. CONTEXT/NETLIFY are build-time and often missing in Functions. */
function isLocalDev() {
  return envVal('NETLIFY_DEV') === 'true';
}

function siteKey() {
  return isLocalDev() ? DEV_SITE_KEY : envVal('TURNSTILE_SITE_KEY');
}

function secretKey() {
  return isLocalDev() ? DEV_SECRET_KEY : envVal('TURNSTILE_SECRET_KEY');
}

function isConfigured() {
  return Boolean(siteKey() && secretKey());
}

function publicConfig() {
  return {
    turnstileSiteKey: isConfigured() ? siteKey() : '',
    turnstileMode: isLocalDev() ? 'dev' : 'production',
  };
}

function clientIp(event) {
  const headers = event?.headers || {};
  const forwarded = headers['x-forwarded-for'] || headers['X-Forwarded-For'] || '';
  return (
    headers['x-nf-client-connection-ip'] ||
    headers['X-Nf-Client-Connection-Ip'] ||
    String(forwarded).split(',')[0].trim() ||
    event?.headers?.['client-ip'] ||
    ''
  );
}

async function verifyTurnstile(token, ip) {
  if (!isConfigured()) {
    if (isLocalDev()) return { ok: true };
    return { ok: false, error: 'Login verification is not configured.' };
  }
  const response = String(token || '').trim();
  if (!response) {
    return { ok: false, error: 'Please complete the verification check.' };
  }

  const body = new URLSearchParams({
    secret: secretKey(),
    response,
  });
  if (ip) body.set('remoteip', ip);

  let data;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(8000),
    });
    data = await res.json();
  } catch {
    return { ok: false, error: 'Verification is unavailable. Try again.' };
  }

  if (!data?.success) {
    return { ok: false, error: 'Verification failed. Try again.' };
  }
  return { ok: true };
}

module.exports = {
  publicConfig,
  verifyTurnstile,
  clientIp,
  isConfigured,
  isLocalDev,
};
