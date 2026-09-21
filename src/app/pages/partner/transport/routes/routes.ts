import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/api.service';
import { FlIcon } from '../../../../shared/icon/icon';
import { FlThinkingOrb } from '../../../../shared/thinking-orb/thinking-orb';
import { DispatchMap } from './dispatch-map';

@Component({
  selector: 'app-transport-routes',
  imports: [RouterLink, DatePipe, DispatchMap, FlIcon, FlThinkingOrb],
  templateUrl: './routes.html',
  styleUrl: '../../food/portal-pages.scss',
})
export class TransportRoutes implements OnInit {
  private readonly api = inject(ApiService);
  readonly routes = signal<any[]>([]);
  readonly error = signal('');
  readonly selectedId = signal<string | null>(null);
  readonly thinking = signal(false);
  readonly applying = signal(false);
  readonly plan = signal<any | null>(null);
  readonly applied = signal(false);

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.api.getTransportRoutes().subscribe({
      next: (d) => {
        this.routes.set(d);
        if (!this.selectedId() && d.length) {
          const accepted = d.find((r) => r.status === 'accepted') || d[0];
          this.selectedId.set(accepted.id);
        }
      },
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }

  accept(id: string) {
    this.api.postRoute(id, { action: 'accept' }).subscribe({
      next: () => this.reload(),
    });
  }

  optimize() {
    this.thinking.set(true);
    this.applied.set(false);
    this.error.set('');
    this.api.optimizeRoutes().subscribe({
      next: (plan) => {
        this.plan.set(plan);
        this.thinking.set(false);
      },
      error: (e) => {
        this.error.set(e.error?.error || e.message || 'Optimize failed');
        this.thinking.set(false);
      },
    });
  }

  applyPlan() {
    const plan = this.plan();
    if (!plan?.routes?.length) return;
    this.applying.set(true);
    this.error.set('');
    this.api.applyOptimize(plan).subscribe({
      next: (res) => {
        if (res?.routes) this.routes.set(res.routes);
        else this.reload();
        this.applying.set(false);
        this.applied.set(true);
      },
      error: (e) => {
        this.error.set(e.error?.error || e.message || 'Apply failed');
        this.applying.set(false);
      },
    });
  }

  selectRoute(id: string) {
    this.selectedId.set(id);
  }

  totalStops() {
    return this.routes().reduce((n, r) => n + (r.stops?.length || 0), 0);
  }

  avgCapacity() {
    const rs = this.routes();
    if (!rs.length) return 0;
    return Math.round(rs.reduce((n, r) => n + Number(r.capacity_pct), 0) / rs.length);
  }

  milesSaved() {
    return Math.round(this.routes().reduce((n, r) => n + Number(r.miles_saved || 0), 0));
  }

  joinStops(labels: string[] | undefined) {
    return (labels || []).join(' → ');
  }
}
