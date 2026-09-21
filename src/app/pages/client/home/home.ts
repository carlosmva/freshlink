import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/api.service';
import { playDashboardReveal } from '../../../core/motion';
import { FlIcon } from '../../../shared/icon/icon';
import { FlThinkingOrb } from '../../../shared/thinking-orb/thinking-orb';

@Component({
  selector: 'app-client-home',
  imports: [RouterLink, CurrencyPipe, DatePipe, FlIcon, FlThinkingOrb],
  templateUrl: './home.html',
  styleUrls: ['../facility-chrome.scss', './home.scss'],
})
export class ClientHome implements OnInit {
  private readonly api = inject(ApiService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  readonly data = signal<any | null>(null);
  readonly ai = signal<any | null>(null);
  readonly aiThinking = signal(true);
  readonly error = signal('');
  private revealed = false;

  ngOnInit() {
    this.api.getFacilityWeek().subscribe({
      next: (d) => {
        this.data.set(d);
        this.revealOnce();
      },
      error: (e) => this.error.set(e.message || 'Failed to load'),
    });
    this.api.recommendBasket().subscribe({
      next: (d) => {
        this.ai.set(d);
        this.aiThinking.set(false);
      },
      error: () => {
        this.ai.set(null);
        this.aiThinking.set(false);
      },
    });
  }

  private revealOnce() {
    if (this.revealed) return;
    this.revealed = true;
    afterNextRender(() => playDashboardReveal(this.host.nativeElement), {
      injector: this.injector,
    });
  }
}
