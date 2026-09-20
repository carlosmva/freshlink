import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { ICONS } from '../../../../shared/icon/icons';
import {
  drivingPath,
  paletteFor,
  PICKUP,
  routePoints,
  straightPath,
  uniqueStops,
} from './map-data';

@Component({
  selector: 'app-dispatch-map',
  templateUrl: './dispatch-map.html',
  styleUrl: './dispatch-map.scss',
})
export class DispatchMap {
  readonly routes = input<any[]>([]);
  readonly selectedId = input<string | null>(null);
  readonly routeSelect = output<string>();

  private readonly mapEl = viewChild.required<ElementRef<HTMLDivElement>>('mapEl');
  private map: L.Map | null = null;
  private lines = new Map<string, L.Polyline>();
  private markers = new L.LayerGroup();
  private drawGen = 0;
  private fitted = false;
  private lastFlown: string | null = null;
  private resizeObs?: ResizeObserver;

  readonly layers = computed(() =>
    this.routes().map((r, i) => ({
      id: r.id as string,
      code: r.code as string,
      ...paletteFor(i),
    })),
  );

  readonly ariaLabel = computed(() => {
    const codes = this.layers()
      .map((l) => l.code)
      .join(', ');
    return codes
      ? `OpenStreetMap of Detroit with pickup at Core Supply and routes ${codes}`
      : 'OpenStreetMap of Detroit dispatch area';
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => this.setupMap());
    effect(() => {
      const data = this.routes();
      const selected = this.selectedId();
      untracked(() => void this.syncLayers(data, selected));
    });
    destroyRef.onDestroy(() => {
      this.resizeObs?.disconnect();
      this.map?.remove();
      this.map = null;
    });
  }

  select(id: string) {
    this.routeSelect.emit(id);
  }

  reframe() {
    const map = this.map;
    const bounds = this.fullBounds();
    if (!map || !bounds) return;
    map.flyToBounds(bounds, { padding: [28, 28], maxZoom: 13, duration: 0.55 });
  }

  private fullBounds(): L.LatLngBounds | null {
    const bounds = L.latLngBounds([]);
    bounds.extend([PICKUP.lat, PICKUP.lng]);
    for (const line of this.lines.values()) {
      if (line.getLatLngs().length) bounds.extend(line.getBounds());
    }
    this.markers.eachLayer((layer) => {
      if (layer instanceof L.Marker) bounds.extend(layer.getLatLng());
    });
    return bounds.isValid() ? bounds : null;
  }

  private addReframeControl(map: L.Map) {
    const bar = map.zoomControl.getContainer();
    if (!bar) return;
    const btn = L.DomUtil.create('a', 'leaflet-control-zoom-reframe', bar);
    btn.href = '#';
    btn.title = 'Reframe map';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'Reframe map');
    btn.innerHTML = ICONS.scan;
    L.DomEvent.disableClickPropagation(btn);
    L.DomEvent.on(btn, 'click', (event) => {
      L.DomEvent.preventDefault(event);
      this.reframe();
    });
  }

  private setupMap() {
    const el = this.mapEl().nativeElement;
    this.map = L.map(el, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    }).setView([42.35, -83.045], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.markers.addTo(this.map);
    this.addReframeControl(this.map);
    this.resizeObs = new ResizeObserver(() => this.map?.invalidateSize());
    this.resizeObs.observe(el);
    queueMicrotask(() => this.map?.invalidateSize());
    void this.syncLayers(this.routes(), this.selectedId());
  }

  private async syncLayers(routes: any[], selected: string | null) {
    const map = this.map;
    if (!map) return;
    const gen = ++this.drawGen;

    this.markers.clearLayers();
    for (const [id, line] of this.lines) {
      if (!routes.some((r) => r.id === id)) {
        line.remove();
        this.lines.delete(id);
      }
    }

    L.marker([PICKUP.lat, PICKUP.lng], {
      icon: L.divIcon({
        className: 'map-pin-wrap',
        html: '<div class="map-pin pickup">P</div>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
      zIndexOffset: 40,
      title: 'Pickup · Core Supply',
    })
      .bindPopup('<b>Pickup</b><br>Core Supply · Eastern Market')
      .addTo(this.markers);

    for (const stop of uniqueStops(routes)) {
      L.marker([stop.lat, stop.lng], {
        icon: L.divIcon({
          className: 'map-pin-wrap',
          html: `<div class="map-pin stop"></div><span class="map-pin-label">${escapeHtml(stop.short)}</span>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
        title: stop.short,
      })
        .bindPopup(escapeHtml(stop.short))
        .addTo(this.markers);
    }

    const bounds = L.latLngBounds([]);
    bounds.extend([PICKUP.lat, PICKUP.lng]);

    for (const [i, route] of routes.entries()) {
      const points = routePoints(route);
      const style = paletteFor(i);
      const live = selected === route.id;
      const dim = selected !== null && !live;
      let line = this.lines.get(route.id);
      if (!line) {
        line = L.polyline(straightPath(points), {
          color: style.stroke,
          weight: live ? 5 : 4,
          opacity: dim ? 0.28 : 0.95,
          dashArray: style.dash,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
        line.on('click', () => this.select(route.id));
        this.lines.set(route.id, line);
      } else {
        line.setStyle({
          color: style.stroke,
          weight: live ? 5 : 4,
          opacity: dim ? 0.28 : 0.95,
          dashArray: style.dash,
        });
      }
      bounds.extend(line.getBounds());
    }

    if (bounds.isValid() && !this.fitted) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 13 });
      this.fitted = true;
      this.lastFlown = selected;
    } else if (selected && selected !== this.lastFlown) {
      const liveLine = this.lines.get(selected);
      this.lastFlown = selected;
      if (liveLine && liveLine.getLatLngs().length) {
        map.flyToBounds(liveLine.getBounds(), { padding: [32, 32], maxZoom: 14, duration: 0.55 });
      }
    }

    for (const route of routes) {
      const path = await drivingPath(routePoints(route));
      if (gen !== this.drawGen || !this.map) return;
      this.lines.get(route.id)?.setLatLngs(path);
    }
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}
