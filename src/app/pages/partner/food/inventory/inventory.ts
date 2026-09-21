import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../core/api.service';
import { FlIcon } from '../../../../shared/icon/icon';

const EMPTY_DRAFT = {
  name: '',
  unit: 'case',
  emoji: '📦',
  quantity: 20,
  unit_price: 12,
};

@Component({
  selector: 'app-food-inventory',
  imports: [CurrencyPipe, FlIcon],
  templateUrl: './inventory.html',
  styleUrl: './../portal-pages.scss',
})
export class FoodInventory implements OnInit {
  private readonly api = inject(ApiService);
  readonly rows = signal<any[]>([]);
  readonly query = signal('');
  readonly error = signal('');
  readonly listing = signal(false);
  readonly saving = signal(false);
  readonly publishing = signal(false);
  readonly notice = signal('');
  readonly draft = signal({ ...EMPTY_DRAFT });
  readonly emojis = ['📦', '🍚', '🍗', '🥬', '🍎', '🥛', '🥚', '🍞', '🫘', '🫙'];

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.rows();
    if (!q) return all;
    return all.filter((r) => {
      const hay = [r.product?.name, r.product?.unit, r.partner?.name, this.statusLabel(r.status)]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  });

  ngOnInit() {
    this.api.getFoodInventory().subscribe({
      next: (d) => this.rows.set(d),
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }

  bump(row: any, delta: number) {
    const quantity = Math.max(0, Number(row.quantity) + delta);
    let status = quantity === 0 ? 'low' : quantity < 40 ? 'warn' : 'ok';
    if (row.status === 'surplus' && quantity > 0) status = 'surplus';
    this.api.patchInventory({ id: row.id, quantity, status }).subscribe({
      next: (d) => this.rows.set(d),
    });
  }

  surplusCount() {
    return this.rows().filter((r) => r.status === 'warn' || r.status === 'low').length;
  }

  statusLabel(status: string) {
    if (status === 'surplus') return 'On surplus lane';
    if (status === 'warn') return 'Surplus watch';
    if (status === 'low') return 'Low stock';
    return 'In stock';
  }

  publishSurplus() {
    const n = this.surplusCount();
    if (!n || this.publishing()) return;
    this.publishing.set(true);
    this.error.set('');
    this.notice.set('');
    this.api.publishSurplus().subscribe({
      next: (d) => {
        this.rows.set(d);
        this.publishing.set(false);
        this.notice.set(
          `${n} listing${n === 1 ? '' : 's'} published to the Surplus Marketplace. Facilities in your zone can pull them into next week’s basket.`,
        );
      },
      error: (e) => {
        this.publishing.set(false);
        this.error.set(e.error?.error || e.message || 'Could not publish surplus');
      },
    });
  }

  openList() {
    this.draft.set({ ...EMPTY_DRAFT });
    this.listing.set(true);
  }

  closeList() {
    if (this.saving()) return;
    this.listing.set(false);
  }

  setDraft<K extends keyof typeof EMPTY_DRAFT>(key: K, value: (typeof EMPTY_DRAFT)[K]) {
    this.draft.update((d) => ({ ...d, [key]: value }));
  }

  submitList() {
    const d = this.draft();
    if (!d.name.trim()) {
      this.error.set('Give the listing a product name.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.api
      .postInventory({
        name: d.name.trim(),
        unit: d.unit,
        emoji: d.emoji,
        quantity: Number(d.quantity),
        unit_price: Number(d.unit_price),
      })
      .subscribe({
        next: (rows) => {
          this.rows.set(rows);
          this.saving.set(false);
          this.listing.set(false);
          this.query.set(d.name.trim());
        },
        error: (e) => {
          this.saving.set(false);
          this.error.set(e.error?.error || e.message || 'Could not list item');
        },
      });
  }
}
