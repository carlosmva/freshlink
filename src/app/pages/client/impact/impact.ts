import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { FlIcon } from '../../../shared/icon/icon';

@Component({
  selector: 'app-client-impact',
  imports: [CurrencyPipe, DecimalPipe, FlIcon, RouterLink],
  templateUrl: './impact.html',
  styleUrls: ['../facility-chrome.scss', './impact.scss'],
})
export class ClientImpact implements OnInit {
  private readonly api = inject(ApiService);
  readonly data = signal<any | null>(null);
  readonly error = signal('');
  readonly savingsBars = computed(() => {
    const rows: { m: string; v: number }[] = this.data()?.monthly_savings || [];
    const saved = Number(this.data()?.dollars_saved || 0);
    const max = Math.max(1, ...rows.map((row) => Number(row.v) || 0));
    return rows.map((row, index) => ({
      m: row.m,
      amount: Math.round((Number(row.v) / max) * (saved || max)),
      height: Math.max(10, Math.round((Number(row.v) / max) * 88)),
      current: index === rows.length - 1,
    }));
  });

  ngOnInit() {
    this.api.getImpact().subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(e.message || 'Failed to load'),
    });
  }
}
