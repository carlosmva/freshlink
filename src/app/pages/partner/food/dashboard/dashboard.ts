import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/api.service';
import { FlIcon } from '../../../../shared/icon/icon';

@Component({
  selector: 'app-food-dashboard',
  imports: [CurrencyPipe, RouterLink, FlIcon],
  templateUrl: './dashboard.html',
  styleUrl: '../portal-pages.scss',
})
export class FoodDashboard implements OnInit {
  private readonly api = inject(ApiService);
  readonly data = signal<any | null>(null);
  readonly error = signal('');

  ngOnInit() {
    this.api.getFoodDashboard().subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }
}
