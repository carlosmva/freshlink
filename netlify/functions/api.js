const { json, parseBody, query } = require('./_shared/db');
const { login, findUserById, publicUser, requireAuth, requireRole } = require('./_shared/auth');
const { completePrompt, extractJsonObject } = require('./_shared/ai');

function pathParts(event) {
  const raw =
    event.path ||
    event.rawUrl ||
    (event.headers && event.headers['x-netlify-original-pathname']) ||
    '';
  let p = String(raw);
  p = p.replace(/^\/\.netlify\/functions\/api/, '');
  p = p.replace(/^\/api/, '');
  if (!p.startsWith('/')) p = `/${p}`;
  return p.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

function homePath(role) {
  if (role === 'facility') return '/client/home';
  if (role === 'food') return '/partner/food/dashboard';
  if (role === 'transport') return '/partner/transport/routes';
  return '/';
}

async function getFacilityWeek(facilityId) {
  const fac = await query('SELECT * FROM facilities WHERE id = $1', [facilityId]);
  const facility = fac.rows[0];
  if (!facility) return null;
  const ord = await query(
    `SELECT * FROM orders WHERE facility_id = $1 ORDER BY week_of DESC LIMIT 1`,
    [facilityId],
  );
  const order = ord.rows[0];
  if (!order) {
    return {
      facility,
      weekOf: null,
      order: null,
      budgetLeft: Number(facility.weekly_budget),
      mealsPlanned: facility.resident_count * 7,
      nextDelivery: null,
    };
  }
  const counts = await query(
    `SELECT COUNT(*)::int AS items, COUNT(DISTINCT partner_id)::int AS suppliers
     FROM order_items WHERE order_id = $1`,
    [order.id],
  );
  const route = await query(
    `SELECT r.* FROM routes r
     JOIN route_stops s ON s.route_id = r.id
     WHERE s.facility_id = $1
     ORDER BY r.delivery_date, r.code
     LIMIT 1`,
    [facilityId],
  );
  const total = Number(order.food_total) + Number(order.delivery_fee);
  const savings = Number(order.baseline_total) - total;
  return {
    facility,
    weekOf: order.week_of,
    order: {
      id: order.id,
      status: order.status,
      itemCount: counts.rows[0].items,
      supplierCount: counts.rows[0].suppliers,
      estTotal: total,
      belowBaseline: savings,
      savingsPct: order.baseline_total ? Math.round((savings / order.baseline_total) * 100) : 0,
      foodTotal: Number(order.food_total),
      deliveryFee: Number(order.delivery_fee),
      deliverySavings: Number(order.delivery_savings),
    },
    budgetLeft: Number(facility.weekly_budget) - total,
    mealsPlanned: facility.resident_count * 7,
    nextDelivery: route.rows[0]
      ? {
          code: route.rows[0].code,
          date: route.rows[0].delivery_date,
          window: route.rows[0].window_label,
          fee: Number(order.delivery_fee),
          savings: Number(order.delivery_savings),
          sharedStops: 2,
        }
      : null,
  };
}

async function getBasket(facilityId) {
  const ord = await query(
    `SELECT * FROM orders WHERE facility_id = $1 ORDER BY week_of DESC LIMIT 1`,
    [facilityId],
  );
  const order = ord.rows[0];
  if (!order) return { order: null, items: [], substitutions: [] };
  const items = await query(
    `SELECT oi.*, row_to_json(p.*) AS product
     FROM order_items oi JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [order.id],
  );
  const subs = await query(
    `SELECT s.*,
       row_to_json(op.*) AS original,
       row_to_json(sp.*) AS suggested
     FROM substitutions s
     LEFT JOIN products op ON op.id = s.original_product_id
     LEFT JOIN products sp ON sp.id = s.suggested_product_id
     WHERE s.order_id = $1`,
    [order.id],
  );
  return { order, items: items.rows, substitutions: subs.rows };
}

async function patchBasket(facilityId, body) {
  const { action, substitutionId } = body;
  const ord = await query(
    `SELECT * FROM orders WHERE facility_id = $1 ORDER BY week_of DESC LIMIT 1`,
    [facilityId],
  );
  const order = ord.rows[0];
  if (!order) return getBasket(facilityId);
  if (action === 'approve_substitution') {
    await query(`UPDATE substitutions SET status = 'approved' WHERE id = $1 AND order_id = $2`, [
      substitutionId,
      order.id,
    ]);
  } else if (action === 'reject_substitution') {
    await query(`UPDATE substitutions SET status = 'rejected' WHERE id = $1 AND order_id = $2`, [
      substitutionId,
      order.id,
    ]);
  } else if (action === 'approve_order') {
    await query(`UPDATE orders SET status = 'approved', updated_at = now() WHERE id = $1`, [
      order.id,
    ]);
  }
  return getBasket(facilityId);
}

async function getImpact(facilityId) {
  const res = await query(
    `SELECT * FROM impact_metrics WHERE facility_id = $1 ORDER BY month_label DESC LIMIT 1`,
    [facilityId],
  );
  return res.rows[0] || null;
}

async function getFoodInventory(partnerId) {
  const res = await query(
    `SELECT i.*, row_to_json(p.*) AS product, row_to_json(pt.*) AS partner
     FROM inventory i
     JOIN products p ON p.id = i.product_id
     JOIN partners pt ON pt.id = i.partner_id
     WHERE i.partner_id = $1
     ORDER BY p.name`,
    [partnerId],
  );
  return res.rows;
}

async function patchInventory(partnerId, body) {
  const { id, quantity, unit_price, status } = body;
  await query(
    `UPDATE inventory SET
       quantity = COALESCE($2, quantity),
       unit_price = COALESCE($3, unit_price),
       status = COALESCE($4, status)
     WHERE id = $1 AND partner_id = $5`,
    [id, quantity ?? null, unit_price ?? null, status ?? null, partnerId],
  );
  return getFoodInventory(partnerId);
}

async function createInventory(partnerId, body) {
  const name = String(body.name || '').trim();
  if (!name) return { error: 'Name is required' };
  const unit = String(body.unit || 'case').trim() || 'case';
  const emoji = String(body.emoji || '📦').trim() || '📦';
  const quantity = Math.max(0, Number(body.quantity) || 0);
  const unit_price = Math.max(0, Number(body.unit_price) || 0);
  const status = quantity === 0 ? 'low' : quantity < 40 ? 'warn' : 'ok';
  const product = await query(
    `INSERT INTO products (name, unit, emoji, tags)
     VALUES ($1, $2, $3, ARRAY['hub'])
     RETURNING id`,
    [name, unit, emoji],
  );
  await query(
    `INSERT INTO inventory (partner_id, product_id, quantity, unit_price, status)
     VALUES ($1, $2, $3, $4, $5)`,
    [partnerId, product.rows[0].id, quantity, unit_price, status],
  );
  return getFoodInventory(partnerId);
}

async function getFoodOrders(partnerId) {
  const res = await query(
    `SELECT o.*, row_to_json(f.*) AS facility,
       (SELECT COUNT(*)::int FROM order_items oi WHERE oi.order_id = o.id AND oi.partner_id = $1) AS item_count
     FROM orders o
     JOIN facilities f ON f.id = o.facility_id
     WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.partner_id = $1)
     ORDER BY o.week_of DESC`,
    [partnerId],
  );
  return res.rows.map((r) => ({
    ...r,
    itemCount: r.item_count,
    total: Number(r.food_total),
  }));
}

async function getFoodOrdersDetailed(partnerId) {
  const base = await getFoodOrders(partnerId);
  return base.map((o) => {
    const meta = o.meta || {};
    return {
      ...o,
      orderRef: meta.orderRef || `FL-${String(o.id).slice(0, 4)}`,
      cadence: meta.cadence || 'Recurring weekly',
      route: meta.route || null,
      window: meta.window || null,
      temperature: meta.temperature || 'Ambient',
      payment: meta.payment || 'Net-7 via FreshLink',
      icon: meta.icon || '🏠',
      itemPreview: meta.itemPreview || 'See full pick list',
      listingCount: o.itemCount || 0,
    };
  });
}

async function getPartnerPayload(table, partnerId) {
  const allowed = {
    demand_forecasts: true,
    partner_payouts: true,
    partner_earnings: true,
  };
  if (!allowed[table]) throw new Error('Unknown payload table');
  const res = await query(`SELECT payload FROM ${table} WHERE partner_id = $1`, [partnerId]);
  return res.rows[0]?.payload || null;
}

async function getFoodForecast(partnerId) {
  return (
    (await getPartnerPayload('demand_forecasts', partnerId)) || {
      recurringRevenue: 0,
      repeatFacilities: 0,
      avgOrderValue: 0,
      surplusRecoveredTons: 0,
      demandByCategory: [],
      weeklyTrend: [],
      aiInsight: 'No forecast yet.',
      surplusMedianHours: 0,
    }
  );
}

async function getFoodDashboard(partnerId) {
  const partner = await query(`SELECT * FROM partners WHERE id = $1`, [partnerId]);
  const orders = await getFoodOrders(partnerId);
  const inventory = await getFoodInventory(partnerId);
  const forecast = await getFoodForecast(partnerId);
  const pending = orders.filter((o) => o.status === 'pending_review' || o.status === 'draft');
  const surplus = inventory.filter((i) => i.status === 'warn' || i.status === 'low');
  return {
    partnerName: partner.rows[0]?.name || 'Food partner',
    kpis: {
      openOrders: pending.length || orders.length,
      listings: inventory.length,
      recurringRevenue: forecast.recurringRevenue,
      surplusItems: surplus.length,
    },
    pendingOrders: orders.slice(0, 3),
    surplusAlerts: surplus.slice(0, 3).map((row) => ({
      id: row.id,
      name: row.product?.name,
      emoji: row.product?.emoji,
      status: row.status,
      quantity: row.quantity,
    })),
    aiInsight:
      forecast.aiInsight ||
      'Offer a volume price on high-demand SKUs to nearby facilities this week.',
  };
}

async function getFoodPayouts(partnerId) {
  return (
    (await getPartnerPayload('partner_payouts', partnerId)) || {
      weekLabel: 'No payouts yet',
      availableBalance: 0,
      pendingBalance: 0,
      paidThisMonth: 0,
      nextPayoutDate: null,
      netTerms: 'Net-7 via FreshLink',
      lines: [],
    }
  );
}

async function getTransportRoutes(partnerId) {
  const routes = await query(
    `SELECT * FROM routes WHERE partner_id = $1 ORDER BY delivery_date, code`,
    [partnerId],
  );
  const result = [];
  for (const r of routes.rows) {
    const stops = await query(
      `SELECT * FROM route_stops WHERE route_id = $1 ORDER BY stop_order`,
      [r.id],
    );
    result.push({ ...r, stops: stops.rows });
  }
  return result;
}

async function getRouteDetail(partnerId, routeId) {
  const routes = await getTransportRoutes(partnerId);
  return routes.find((r) => r.id === routeId) || null;
}

async function patchRoute(partnerId, routeId, body) {
  const { action, stopId } = body;
  const owned = await query(`SELECT id FROM routes WHERE id = $1 AND partner_id = $2`, [
    routeId,
    partnerId,
  ]);
  if (!owned.rows[0]) return null;
  if (action === 'accept') {
    await query(`UPDATE routes SET status = 'accepted' WHERE id = $1`, [routeId]);
  }
  if (action === 'pod' && stopId) {
    await query(
      `UPDATE route_stops SET status = 'delivered', pod_at = now()
       WHERE id = $1 AND route_id = $2`,
      [stopId, routeId],
    );
  }
  return getRouteDetail(partnerId, routeId);
}

async function getTransportEarnings(partnerId) {
  return (
    (await getPartnerPayload('partner_earnings', partnerId)) || {
      weekLabel: 'No earnings yet',
      weeklyRevenue: 0,
      revenuePerStop: 0,
      onTimeRate: 0,
      co2AvoidedLb: 0,
      foodDeliveredLb: 0,
      utilizationSweetSpot: '75–90%',
      byRoute: [],
      consolidation: {},
    }
  );
}

async function getTransportFleet(partnerId) {
  const res = await query(
    `SELECT * FROM vehicles WHERE partner_id = $1 ORDER BY code`,
    [partnerId],
  );
  const vehicles = res.rows.map((v) => ({
    id: v.id,
    code: v.code,
    type: v.type,
    status: v.status,
    tempZones: v.temp_zones,
    capacityPct: Number(v.capacity_pct),
    batteryPct: Number(v.battery_pct),
    assignedRoute: v.assigned_route,
    mileage: v.mileage,
  }));
  return {
    vehicles,
    summary: {
      total: vehicles.length,
      onRoute: vehicles.filter((v) => v.status === 'on_route').length,
      available: vehicles.filter((v) => v.status === 'available').length,
      charging: vehicles.filter((v) => v.status === 'charging').length,
      maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
      evSharePct: 100,
    },
  };
}

async function getTransportDrivers(partnerId) {
  const res = await query(
    `SELECT * FROM drivers WHERE partner_id = $1 ORDER BY name`,
    [partnerId],
  );
  const drivers = res.rows.map((d) => ({
    id: d.id,
    name: d.name,
    initials: d.initials,
    status: d.status,
    vehicle: d.vehicle,
    route: d.route,
    stopsDone: d.stops_done,
    stopsTotal: d.stops_total,
    onTimePct: Number(d.on_time_pct),
    phone: d.phone,
  }));
  return {
    drivers,
    summary: {
      onShift: drivers.filter((d) => d.status === 'on_route').length,
      available: drivers.filter((d) => d.status === 'available').length,
      offShift: drivers.filter((d) => d.status === 'off_shift').length,
      leave: drivers.filter((d) => d.status === 'break').length,
    },
  };
}

async function recommendBasket(facilityId) {
  const week = await getFacilityWeek(facilityId);
  const basket = await getBasket(facilityId);
  const inventory = await query(
    `SELECT i.status, p.name FROM inventory i JOIN products p ON p.id = i.product_id
     WHERE i.status <> 'ok' ORDER BY i.status LIMIT 5`,
  );
  const fallback = {
    source: 'heuristic',
    summary: week?.order
      ? `Weekly order ready — ${week.order.itemCount} items from ${week.order.supplierCount} suppliers`
      : 'No weekly order yet',
    estTotal: week?.order?.estTotal || 0,
    belowBaseline: week?.order?.belowBaseline || 0,
    savingsPct: week?.order?.savingsPct || 0,
    pendingSubstitutions: (basket.substitutions || []).filter((s) => s.status === 'pending')
      .length,
    notes: [
      'Matched resident count, meal plan, and dietitian templates.',
      'Prioritized local and surplus lanes where nutrition profiles align.',
    ],
  };
  const prompt = `You are FreshLink Detroit's ordering assistant. Given this facility and inventory context, return a short JSON object with keys summary (string), notes (string array, max 3), and substitutionHint (string). Keep numbers consistent with the data. Context: ${JSON.stringify(
    {
      facility: week?.facility,
      order: week?.order,
      lowStock: inventory.rows,
      pendingSubs: fallback.pendingSubstitutions,
    },
  )}`;

  try {
    const result = await completePrompt(prompt);
    if (!result) return fallback;
    const parsed = extractJsonObject(result.text);
    return {
      ...fallback,
      source: result.source,
      summary: parsed?.summary || fallback.summary,
      notes: parsed?.notes || fallback.notes,
      substitutionHint: parsed?.substitutionHint,
      rawPreview: String(result.text).slice(0, 400),
    };
  } catch (err) {
    console.warn('[ai] recommend failed', err.message);
    return fallback;
  }
}

function deny(err) {
  return json(err.statusCode || 500, { error: err.message || 'Server error' });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {});
  }

  try {
    const path = pathParts(event);
    const method = event.httpMethod;
    const body = parseBody(event);

    if (path === '/health' && method === 'GET') {
      await query('SELECT 1');
      return json(200, { ok: true, store: 'postgres' });
    }

    if (path === '/auth/login' && method === 'POST') {
      const result = await login(body);
      if (result.error) return json(result.status, { error: result.error });
      return json(200, {
        ...result,
        redirect: homePath(result.user.role),
      });
    }

    if (path === '/auth/logout' && method === 'POST') {
      return json(204, {});
    }

    const auth = requireAuth(event);

    if (path === '/auth/me' && method === 'GET') {
      const row = await findUserById(auth.id);
      if (!row || row.status !== 'active') return json(401, { error: 'Authentication required' });
      return json(200, { user: publicUser(row), redirect: homePath(row.role) });
    }

    if (path === '/facility/me/week' && method === 'GET') {
      requireRole(auth, 'facility');
      return json(200, await getFacilityWeek(auth.facilityId));
    }

    if (path === '/facility/me/basket' && method === 'GET') {
      requireRole(auth, 'facility');
      return json(200, await getBasket(auth.facilityId));
    }
    if (path === '/facility/me/basket' && method === 'POST') {
      requireRole(auth, 'facility');
      return json(200, await patchBasket(auth.facilityId, body));
    }

    if (path === '/impact/me' && method === 'GET') {
      requireRole(auth, 'facility');
      return json(200, await getImpact(auth.facilityId));
    }

    if (path === '/partner/food/inventory' && method === 'GET') {
      requireRole(auth, 'food');
      return json(200, await getFoodInventory(auth.partnerId));
    }
    if (path === '/partner/food/inventory' && method === 'PATCH') {
      requireRole(auth, 'food');
      return json(200, await patchInventory(auth.partnerId, body));
    }
    if (path === '/partner/food/inventory' && method === 'POST') {
      requireRole(auth, 'food');
      const created = await createInventory(auth.partnerId, body);
      if (created?.error) return json(400, created);
      return json(201, created);
    }

    if (path === '/partner/food/orders' && method === 'GET') {
      requireRole(auth, 'food');
      return json(200, await getFoodOrdersDetailed(auth.partnerId));
    }

    if (path === '/partner/food/forecast' && method === 'GET') {
      requireRole(auth, 'food');
      return json(200, await getFoodForecast(auth.partnerId));
    }

    if (path === '/partner/food/dashboard' && method === 'GET') {
      requireRole(auth, 'food');
      return json(200, await getFoodDashboard(auth.partnerId));
    }

    if (path === '/partner/food/payouts' && method === 'GET') {
      requireRole(auth, 'food');
      return json(200, await getFoodPayouts(auth.partnerId));
    }

    if (path === '/partner/transport/routes' && method === 'GET') {
      requireRole(auth, 'transport');
      return json(200, await getTransportRoutes(auth.partnerId));
    }

    let m = path.match(/^\/partner\/transport\/routes\/([^/]+)$/);
    if (m && method === 'GET') {
      requireRole(auth, 'transport');
      const detail = await getRouteDetail(auth.partnerId, m[1]);
      return detail ? json(200, detail) : json(404, { error: 'Not found' });
    }
    if (m && method === 'POST') {
      requireRole(auth, 'transport');
      const updated = await patchRoute(auth.partnerId, m[1], body);
      return updated ? json(200, updated) : json(404, { error: 'Not found' });
    }

    if (path === '/partner/transport/earnings' && method === 'GET') {
      requireRole(auth, 'transport');
      return json(200, await getTransportEarnings(auth.partnerId));
    }

    if (path === '/partner/transport/fleet' && method === 'GET') {
      requireRole(auth, 'transport');
      return json(200, await getTransportFleet(auth.partnerId));
    }

    if (path === '/partner/transport/drivers' && method === 'GET') {
      requireRole(auth, 'transport');
      return json(200, await getTransportDrivers(auth.partnerId));
    }

    if (path === '/ai/recommend-basket' && method === 'POST') {
      requireRole(auth, 'facility');
      return json(200, await recommendBasket(auth.facilityId));
    }

    return json(404, { error: 'Not found', path });
  } catch (err) {
    if (err.statusCode) return deny(err);
    console.error(err);
    return json(500, { error: err.message || 'Server error' });
  }
};
