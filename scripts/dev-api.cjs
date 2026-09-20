const http = require('http');
const fs = require('fs');
const path = require('path');

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

const { handler } = require('../netlify/functions/api');
const port = Number(process.env.API_PORT || 8787);

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    });
    res.end();
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString('utf8');
  const url = new URL(req.url, `http://127.0.0.1:${port}`);

  try {
    const out = await handler({
      httpMethod: req.method,
      path: url.pathname,
      rawUrl: url.toString(),
      headers: req.headers,
      body,
      isBase64Encoded: false,
    });
    res.writeHead(out.statusCode || 200, out.headers || {});
    res.end(out.body || '');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Server error' }));
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Local API ready at http://localhost:${port}`);
});
