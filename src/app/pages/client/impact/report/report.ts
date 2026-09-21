import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/api.service';
import { FlIcon } from '../../../../shared/icon/icon';
import { FlThinkingOrb } from '../../../../shared/thinking-orb/thinking-orb';

@Component({
  selector: 'app-client-impact-report',
  imports: [CurrencyPipe, DecimalPipe, FlIcon, FlThinkingOrb, RouterLink],
  templateUrl: './report.html',
  styleUrls: ['../../facility-chrome.scss', './report.scss'],
})
export class ClientImpactReport implements OnInit {
  private readonly api = inject(ApiService);
  readonly report = signal<any | null>(null);
  readonly thinking = signal(true);
  readonly error = signal('');

  ngOnInit() {
    this.api.compileImpactReport().subscribe({
      next: (d) => {
        this.report.set(d);
        this.thinking.set(false);
      },
      error: (e) => {
        this.error.set(e.message || 'Could not compile the Q3 report.');
        this.thinking.set(false);
      },
    });
  }

  print() {
    window.print();
  }
}
