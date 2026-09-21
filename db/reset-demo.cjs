const fs = require('fs');
const path = require('path');

const TABLES = [
  'route_stops',
  'routes',
  'substitutions',
  'order_items',
  'orders',
  'inventory',
  'impact_metrics',
  'vehicles',
  'drivers',
  'demand_forecasts',
  'partner_payouts',
  'partner_earnings',
  'users',
  'products',
  'partners',
  'facilities',
];

function readSeedSql() {
  const tries = [
    path.join(__dirname, 'seed.sql'),
    path.join(process.cwd(), 'db', 'seed.sql'),
    path.join(__dirname, '..', 'db', 'seed.sql'),
  ];
  for (const file of tries) {
    if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8');
  }
  throw new Error('db/seed.sql was not found');
}

async function ensureAdminRole(runner) {
  await runner.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check`);
  await runner.query(
    `ALTER TABLE users ADD CONSTRAINT users_role_check
       CHECK (role IN ('facility', 'food', 'transport', 'admin'))`,
  );
  await runner.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_tenant_chk`);
  await runner.query(
    `ALTER TABLE users ADD CONSTRAINT users_tenant_chk CHECK (
       (role = 'admin' AND facility_id IS NULL AND partner_id IS NULL)
       OR (role = 'facility' AND facility_id IS NOT NULL AND partner_id IS NULL)
       OR (role IN ('food', 'transport') AND partner_id IS NOT NULL AND facility_id IS NULL)
     )`,
  );
}

async function resetDemo(runner) {
  await ensureAdminRole(runner);
  await runner.query(`TRUNCATE ${TABLES.join(', ')} RESTART IDENTITY CASCADE`);
  await runner.query(readSeedSql());
  const summary = await runner.query(`
    SELECT
      (SELECT count(*)::int FROM facilities) AS facilities,
      (SELECT count(*)::int FROM partners) AS partners,
      (SELECT count(*)::int FROM products) AS products,
      (SELECT count(*)::int FROM inventory) AS inventory,
      (SELECT count(*)::int FROM orders) AS orders,
      (SELECT count(*)::int FROM order_items) AS order_items,
      (SELECT count(*)::int FROM substitutions) AS substitutions,
      (SELECT count(*)::int FROM routes) AS routes,
      (SELECT count(*)::int FROM route_stops) AS route_stops,
      (SELECT count(*)::int FROM vehicles) AS vehicles,
      (SELECT count(*)::int FROM drivers) AS drivers,
      (SELECT count(*)::int FROM users) AS users
  `);
  return summary.rows[0];
}

module.exports = { resetDemo, ensureAdminRole, readSeedSql };
