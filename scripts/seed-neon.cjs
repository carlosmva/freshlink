const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

(async () => {
  const url = (process.env.DATABASE_URL || '').replace(/^['"]|['"]$/g, '');
  const client = new Client({
    connectionString: url,
    ssl: url.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
  });
  const { resetDemo } = require('../db/reset-demo.cjs');
  await client.connect();
  const summary = await resetDemo(client);
  const users = await client.query('SELECT email, role FROM users ORDER BY role');
  console.log('Reset demo:', summary);
  console.log('Seeded users:', users.rows.map((r) => `${r.role}:${r.email}`).join(', '));
  await client.end();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
