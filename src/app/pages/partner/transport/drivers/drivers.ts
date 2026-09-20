import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/api.service';

@Component({
  selector: 'app-transport-drivers',
  imports: [RouterLink],
  templateUrl: './drivers.html',
  styleUrl: '../../food/portal-pages.scss',
})
export class TransportDrivers implements OnInit {
  private readonly api = inject(ApiService);
  readonly data = signal<any | null>(null);
  readonly error = signal('');

  ngOnInit() {
    this.api.getTransportDrivers().subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }

  statusClass(status: string) {
    if (status === 'on_route' || status === 'available') return 'ok';
    if (status === 'off_shift') return 'warn';
    return 'info';
  }

  label(status: string) {
    return status.replace(/_/g, ' ');
  }
}
