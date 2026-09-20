import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../core/api.service';
import { FlIcon } from '../../../../shared/icon/icon';

const EMPTY_DRAFT = {
  reason: 'Short on quantity this week',
  note: '',
};

@Component({
  selector: 'app-food-orders',
  imports: [CurrencyPipe, FlIcon],
  templateUrl: './orders.html',
  styleUrl: '../portal-pages.scss',
})
export class FoodOrders implements OnInit {
  private readonly api = inject(ApiService);
  readonly orders = signal<any[]>([]);
  readonly selected = signal<any | null>(null);
  readonly error = signal('');
  readonly changing = signal(false);
  readonly draft = signal({ ...EMPTY_DRAFT });
  readonly reasons = [
    'Short on quantity this week',
    'Need a substitution',
    'Cannot make this delivery window',
    'Minimum / price does not work',
  ];

  ngOnInit() {
    this.api.getFoodOrders().subscribe({
      next: (d) => {
        this.orders.set(d);
        this.selected.set(d[0] || null);
      },
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }

  pendingCount() {
    return this.orders().filter((o) => !this.isClosed(o)).length;
  }

  openCount() {
    return this.orders().length;
  }

  isClosed(order: any) {
    return order?.status === 'approved' || order?.status === 'changes_requested';
  }

  statusLabel(status: string) {
    if (status === 'approved') return 'Accepted';
    if (status === 'changes_requested') return 'Change requested';
    return 'Within cutoff';
  }

  statusChip(status: string) {
    if (status === 'approved') return 'ok';
    if (status === 'changes_requested') return 'warn';
    return 'ok';
  }

  select(order: any) {
    this.selected.set(order);
  }

  accept(order: any) {
    this.patchOrder(order.id, { status: 'approved', changeRequest: null });
  }

  openChange(order: any) {
    this.selected.set(order);
    this.draft.set({ ...EMPTY_DRAFT });
    this.changing.set(true);
  }

  closeChange() {
    this.changing.set(false);
  }

  setDraft<K extends keyof typeof EMPTY_DRAFT>(key: K, value: (typeof EMPTY_DRAFT)[K]) {
    this.draft.update((d) => ({ ...d, [key]: value }));
  }

  submitChange() {
    const order = this.selected();
    const draft = this.draft();
    if (!order) return;
    this.patchOrder(order.id, {
      status: 'changes_requested',
      changeRequest: {
        reason: draft.reason,
        note: draft.note.trim(),
      },
    });
    this.changing.set(false);
  }

  private patchOrder(id: string, patch: Record<string, unknown>) {
    const next = this.orders().map((o) => (o.id === id ? { ...o, ...patch } : o));
    this.orders.set(next);
    const current = next.find((o) => o.id === id) || null;
    this.selected.set(current);
  }
}
