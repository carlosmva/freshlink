import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../core/api.service';
import { FlIcon } from '../../../../shared/icon/icon';

@Component({
  selector: 'app-transport-earnings',
  imports: [CurrencyPipe, DecimalPipe, FlIcon],
  templateUrl: './earnings.html',
  styleUrl: '../../food/portal-pages.scss',
})
export class TransportEarnings implements OnInit {
  private readonly api = inject(ApiService);
  readonly data = signal<any | null>(null);
  readonly error = signal('');

  ngOnInit() {
    this.api.getTransportEarnings().subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }
}
