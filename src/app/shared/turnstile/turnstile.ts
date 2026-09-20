import {
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  afterNextRender,
  input,
  output,
  viewChild,
} from '@angular/core';

interface TurnstileApi {
  render: (
    container: HTMLElement | string,
    params: {
      sitekey: string;
      callback?: (token: string) => void;
      'error-callback'?: () => void;
      'expired-callback'?: () => void;
      theme?: 'light' | 'dark' | 'auto';
      size?: 'normal' | 'compact' | 'flexible';
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  const w = window as unknown as { turnstile?: TurnstileApi };
  if (w.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile-api]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Turnstile script error')));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset['turnstileApi'] = '1';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Turnstile script failed to load'));
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

@Component({
  selector: 'fl-turnstile',
  encapsulation: ViewEncapsulation.None,
  template: `<div #host class="host"></div>`,
  styles: `
    fl-turnstile {
      display: block;
      width: 300px;
      max-width: 100%;
      margin-inline: auto;
    }
    fl-turnstile .host {
      width: 300px;
      max-width: 100%;
      margin-inline: auto;
      min-height: 65px;
    }
    fl-turnstile .host > div,
    fl-turnstile .host > div > div {
      width: 300px !important;
      max-width: 100%;
      margin-inline: auto !important;
    }
  `,
})
export class FlTurnstile implements OnDestroy {
  readonly siteKey = input.required<string>();
  readonly token = output<string | null>();
  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  private widgetId: string | null = null;

  constructor() {
    afterNextRender(() => {
      void this.renderWidget();
    });
  }

  ngOnDestroy() {
    const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
    if (this.widgetId && api) {
      try {
        api.remove(this.widgetId);
      } catch {
        /* ignore */
      }
    }
  }

  reset() {
    const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
    if (this.widgetId && api) {
      try {
        api.reset(this.widgetId);
      } catch {
        /* ignore */
      }
    }
    this.token.emit(null);
  }

  private async renderWidget() {
    try {
      await loadScript();
    } catch {
      this.token.emit(null);
      return;
    }
    const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
    const el = this.host().nativeElement;
    const key = this.siteKey();
    if (!api || !el || !key) {
      this.token.emit(null);
      return;
    }
    this.widgetId = api.render(el, {
      sitekey: key,
      theme: 'light',
      size: 'normal',
      callback: (value) => this.token.emit(value),
      'error-callback': () => this.token.emit(null),
      'expired-callback': () => this.token.emit(null),
    });
  }
}
