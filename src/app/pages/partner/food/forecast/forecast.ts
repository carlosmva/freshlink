import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { armAiReady } from '../../../../core/ai-wait';
import { ApiService } from '../../../../core/api.service';
import { FlIcon } from '../../../../shared/icon/icon';
import { FlThinkingOrb } from '../../../../shared/thinking-orb/thinking-orb';

const WEEK_LABELS = ['Aug 3', 'Aug 10', 'Aug 17', 'Aug 24', 'Aug 31', 'Sep 7', 'Sep 14', 'Sep 21'];

@Component({
  selector: 'app-food-forecast',
  imports: [CurrencyPipe, DecimalPipe, FlIcon, FlThinkingOrb],
  templateUrl: './forecast.html',
  styleUrl: './../portal-pages.scss',
})
export class FoodForecast implements OnInit {
  private readonly api = inject(ApiService);
  readonly data = signal<any | null>(null);
  readonly aiReady = signal(false);
  readonly error = signal('');
  readonly weeks = computed(() => {
    const trend: number[] = this.data()?.weeklyTrend || [];
    return trend.map((v, i) => ({ v, label: WEEK_LABELS[i] || `W${i + 1}` }));
  });

  ngOnInit() {
    this.api.getFoodForecast().subscribe({
      next: (d) => {
        this.data.set(d);
        armAiReady(this.aiReady);
      },
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }

  barHeight(v: number) {
    const max = Math.max(...(this.data()?.weeklyTrend || [1]));
    return `${Math.max(8, Math.round((v / max) * 110))}px`;
  }
}
