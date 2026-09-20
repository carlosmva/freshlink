import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../core/api.service';

@Component({
  selector: 'app-client-deliveries',
  imports: [DatePipe],
  templateUrl: './deliveries.html',
  styleUrls: ['../facility-chrome.scss', './deliveries.scss'],
})
export class ClientDeliveries implements OnInit {
  private readonly api = inject(ApiService);
  readonly routes = signal<any[]>([]);
  readonly week = signal<any | null>(null);
  readonly error = signal('');

  ngOnInit() {
    this.api.getFacilityWeek().subscribe({
      next: (d) => this.week.set(d),
      error: (e) => this.error.set(e.message || 'Failed'),
    });
    this.api.getTransportRoutes().subscribe({
      next: (d) => this.routes.set(d.filter((r) => r.code === 'D-12' || r.status === 'accepted')),
      error: () => {},
    });
  }
}
