import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../core/api.service';

@Component({
  selector: 'app-transport-fleet',
  imports: [DecimalPipe],
  templateUrl: './fleet.html',
  styleUrl: '../../food/portal-pages.scss',
})
export class TransportFleet implements OnInit {
  private readonly api = inject(ApiService);
  readonly data = signal<any | null>(null);
  readonly error = signal('');

  ngOnInit() {
    this.api.getTransportFleet().subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }

  statusClass(status: string) {
    if (status === 'on_route' || status === 'available') return 'ok';
    if (status === 'charging') return 'warn';
    return 'low';
  }

  label(status: string) {
    return status.replace(/_/g, ' ');
  }
}
