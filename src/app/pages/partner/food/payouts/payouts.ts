import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../core/api.service';

@Component({
  selector: 'app-food-payouts',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './payouts.html',
  styleUrl: '../portal-pages.scss',
})
export class FoodPayouts implements OnInit {
  private readonly api = inject(ApiService);
  readonly data = signal<any | null>(null);
  readonly error = signal('');

  ngOnInit() {
    this.api.getFoodPayouts().subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }

  statusClass(status: string) {
    return status === 'paid' ? 'ok' : 'warn';
  }
}
