export type MapPoint = { id: string; lat: number; lng: number; short: string };

export const PICKUP: MapPoint = {
  id: 'pickup',
  short: 'Core Supply',
  lat: 42.3464,
  lng: -83.0406,
};

export const FACILITY_COORDS: Record<string, Omit<MapPoint, 'id'>> = {
  '11111111-1111-1111-1111-111111111111': { lat: 42.3519, lng: -83.0628, short: 'Hope Harbor' },
  '11111111-1111-1111-1111-111111111112': { lat: 42.3372, lng: -83.0194, short: 'Riverfront' },
  '11111111-1111-1111-1111-111111111113': { lat: 42.3778, lng: -82.9465, short: 'Eastside Group' },
};

export const ROUTE_PALETTE = [
  { stroke: '#4f9e23', dash: '1 9' },
  { stroke: '#16324f', dash: '6 8' },
  { stroke: '#c4a035', dash: '2 8' },
];

const ZONE_FALLBACK: Record<string, MapPoint[]> = {
  'D-18': [{ id: 'zone-D-18', lat: 42.3278, lng: -83.0854, short: 'Southwest' }],
};

const pathCache = new Map<string, [number, number][]>();

export function paletteFor(index: number) {
  return ROUTE_PALETTE[index % ROUTE_PALETTE.length];
}

export function stopPoint(stop: any, index: number): MapPoint {
  const known = FACILITY_COORDS[stop.facility_id];
  if (known) return { id: stop.facility_id, ...known };
  return {
    id: String(stop.facility_id || stop.id || index),
    short: String(stop.label || 'Stop').replace(/\s+(Shelter|Home|House)$/i, ''),
    lat: 42.34 + (index % 5) * 0.012,
    lng: -83.05 - (index % 4) * 0.018,
  };
}

export function routePoints(route: any): MapPoint[] {
  const stops = Array.isArray(route.stops) ? route.stops : [];
  if (stops.length) return [PICKUP, ...stops.map((st: any, j: number) => stopPoint(st, j))];
  return [PICKUP, ...(ZONE_FALLBACK[route.code] || [])];
}

export function uniqueStops(routes: any[]): MapPoint[] {
  const seen = new Set<string>();
  const pins: MapPoint[] = [];
  for (const r of routes) {
    for (const point of routePoints(r).slice(1)) {
      if (seen.has(point.id)) continue;
      seen.add(point.id);
      pins.push(point);
    }
  }
  return pins;
}

export function straightPath(points: MapPoint[]): [number, number][] {
  return points.map((p) => [p.lat, p.lng]);
}

export async function drivingPath(points: MapPoint[]): Promise<[number, number][]> {
  const fallback = straightPath(points);
  if (points.length < 2) return fallback;
  const key = points.map((p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`).join('|');
  const cached = pathCache.get(key);
  if (cached) return cached;
  try {
    const coords = points.map((p) => `${p.lng},${p.lat}`).join(';');
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
    );
    if (!res.ok) return fallback;
    const json = await res.json();
    const geom = json?.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(geom)) return fallback;
    const path = geom.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
    pathCache.set(key, path);
    return path;
  } catch {
    return fallback;
  }
}
