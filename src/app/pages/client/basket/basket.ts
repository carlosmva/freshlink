import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../core/api.service';
import { FlIcon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-client-basket',
  imports: [CurrencyPipe, FlIcon],
  templateUrl: './basket.html',
  styleUrls: ['../facility-chrome.scss', './basket.scss'],
})
export class ClientBasket implements OnInit {
  private readonly api = inject(ApiService);
  readonly data = signal<any | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.api.getBasket().subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(e.message || 'Failed to load'),
    });
  }

  pendingCount() {
    return (this.data()?.substitutions || []).filter((s: any) => s.status === 'pending').length;
  }

  act(action: string, substitutionId?: string) {
    this.busy.set(true);
    this.api.postBasket({ action, substitutionId }).subscribe({
      next: (d) => {
        this.data.set(d);
        this.busy.set(false);
      },
      error: (e) => {
        this.error.set(e.message || 'Action failed');
        this.busy.set(false);
      },
    });
  }

  total() {
    const o = this.data()?.order;
    if (!o) return 0;
    return Number(o.food_total) + Number(o.delivery_fee);
  }

  savings() {
    const o = this.data()?.order;
    if (!o) return 0;
    return Number(o.baseline_total) - this.total();
  }
}
