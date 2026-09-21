const PICKUP = { lat: 42.3464, lng: -83.0406, short: 'Core Supply' };

const FACILITY_COORDS = {
  '11111111-1111-1111-1111-111111111111': { lat: 42.3519, lng: -83.0628, short: 'Hope Harbor' },
  '11111111-1111-1111-1111-111111111112': { lat: 42.3372, lng: -83.0194, short: 'Riverfront' },
  '11111111-1111-1111-1111-111111111113': { lat: 42.3778, lng: -82.9465, short: 'Eastside Group' },
  '11111111-1111-1111-1111-111111111114': { lat: 42.3304, lng: -83.0668, short: 'Corktown' },
  '11111111-1111-1111-1111-111111111115': { lat: 42.3482, lng: -83.0576, short: 'Midtown Recovery' },
  '11111111-1111-1111-1111-111111111116': { lat: 42.3251, lng: -83.0918, short: 'Southwest Senior' },
};

function pointFor(stop) {
  return FACILITY_COORDS[stop?.facility_id] || null;
}

function haversineMiles(a, b) {
  if (!a || !b) return 0;
  const toRad = (d) => (d * Math.PI) / 180;
  const r = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(s)));
}

function tourMiles(start, stops) {
  let miles = 0;
  let prev = start;
  for (const stop of stops) {
    const next = pointFor(stop) || prev;
    miles += haversineMiles(prev, next);
    prev = next;
  }
  return miles;
}

function nearestNeighbor(start, stops) {
  const remaining = [...stops];
  const order = [];
  let cur = start;
  while (remaining.length) {
    let best = 0;
    let bestD = Infinity;
    remaining.forEach((stop, i) => {
      const d = haversineMiles(cur, pointFor(stop) || cur);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    const next = remaining.splice(best, 1)[0];
    order.push(next);
    cur = pointFor(next) || cur;
  }
  return order;
}

function twoOpt(start, stops) {
  let best = [...stops];
  let bestCost = tourMiles(start, best);
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < best.length - 1; i += 1) {
      for (let j = i + 1; j < best.length; j += 1) {
        const next = best.slice(0, i).concat(best.slice(i, j + 1).reverse(), best.slice(j + 1));
        const cost = tourMiles(start, next);
        if (cost + 1e-6 < bestCost) {
          best = next;
          bestCost = cost;
          improved = true;
        }
      }
    }
  }
  return best;
}

function round1(n) {
  return Math.round(Number(n) * 10) / 10;
}

function sameIds(a, b) {
  return a.length === b.length && a.every((stop, i) => stop.id === b[i].id);
}

function optimizeOfferedRoute(route) {
  if (route.status !== 'offered') return null;
  const stops = [...(route.stops || [])].sort((a, b) => a.stop_order - b.stop_order);
  const locked = stops.filter((s) => s.status === 'delivered' || s.status === 'en_route');
  const pending = stops.filter((s) => s.status === 'pending' || s.status === 'skipped');
  if (pending.length < 2) return null;

  const start = locked.length ? pointFor(locked[locked.length - 1]) || PICKUP : PICKUP;
  const optimizedPending = twoOpt(start, nearestNeighbor(start, pending));
  if (sameIds(pending, optimizedPending)) return null;

  const before = [...locked, ...pending];
  const after = [...locked, ...optimizedPending];
  const milesBefore = tourMiles(PICKUP, before);
  const milesAfter = tourMiles(PICKUP, after);
  return {
    id: route.id,
    code: route.code,
    window: route.window_label,
    before: pending.map((s) => s.label),
    after: optimizedPending.map((s) => s.label),
    orderedStopIds: after.map((s) => s.id),
    milesBefore: round1(milesBefore),
    milesAfter: round1(milesAfter),
    milesSaved: round1(Math.max(0, milesBefore - milesAfter)),
  };
}

function fallbackCopy(changes) {
  const saved = round1(changes.reduce((n, r) => n + Number(r.milesSaved || 0), 0));
  const codes = changes.map((r) => r.code).join(', ');
  return {
    headline: changes.length
      ? `Tighter stop order on ${codes}`
      : 'Offered routes are already in a tight order',
    summary: changes.length
      ? `Reordered pending stops on ${changes.length} offered route${changes.length === 1 ? '' : 's'} from the Core Supply pickup. About ${saved} fewer miles versus the current plan. Accepted and in-progress routes were left alone.`
      : 'No offered route had two or more pending stops that a nearer-first pass could improve.',
    highlights: changes.slice(0, 3).map(
      (r) =>
        `${r.code}: ${r.before.join(' → ')} becomes ${r.after.join(' → ')} (−${r.milesSaved} mi).`,
    ),
  };
}

module.exports = {
  PICKUP,
  FACILITY_COORDS,
  optimizeOfferedRoute,
  fallbackCopy,
};
