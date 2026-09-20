import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/api.service';

@Component({
  selector: 'app-route-detail',
  imports: [RouterLink],
  templateUrl: './route-detail.html',
  styleUrl: '../../food/portal-pages.scss',
})
export class RouteDetail implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  readonly data = signal<any | null>(null);
  readonly error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);
  }

  load(id: string) {
    this.api.getRoute(id).subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }

  pod(stopId: string) {
    const id = this.data()?.id;
    this.api.postRoute(id, { action: 'pod', stopId }).subscribe({
      next: (d) => this.data.set(d),
    });
  }

  stopClass(status: string) {
    if (status === 'delivered') return 'done';
    if (status === 'en_route') return 'now';
    return '';
  }
}
