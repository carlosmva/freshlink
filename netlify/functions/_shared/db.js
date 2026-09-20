const { Pool } = require('pg');

let pool;

function connectionString() {
  const raw = (process.env.DATABASE_URL || '').trim().replace(/^['"]|['"]$/g, '');
  if (!raw || raw === 'memory' || raw.startsWith('memory:')) {
    throw new Error('DATABASE_URL must be a Postgres connection string');
  }
  return raw;
}

function getPool() {
  const url = connectionString();
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      ssl: url.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 8000,
    });
  }
  return pool;
}

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(body),
  };
}

function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

async function query(text, params) {
  return getPool().query(text, params);
}

module.exports = {
  getPool,
  query,
  json,
  parseBody,
  corsHeaders,
  connectionString,
};
