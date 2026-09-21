import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { armAiReady } from '../../../../core/ai-wait';
import { ApiService } from '../../../../core/api.service';
import { FlIcon } from '../../../../shared/icon/icon';
import { FlThinkingOrb } from '../../../../shared/thinking-orb/thinking-orb';

@Component({
  selector: 'app-transport-earnings',
  imports: [CurrencyPipe, DecimalPipe, FlIcon, FlThinkingOrb],
  templateUrl: './earnings.html',
  styleUrl: '../../food/portal-pages.scss',
})
export class TransportEarnings implements OnInit {
  private readonly api = inject(ApiService);
  readonly data = signal<any | null>(null);
  readonly aiReady = signal(false);
  readonly error = signal('');

  ngOnInit() {
    this.api.getTransportEarnings().subscribe({
      next: (d) => {
        this.data.set(d);
        armAiReady(this.aiReady);
      },
      error: (e) => this.error.set(e.message || 'Failed'),
    });
  }
}
