import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MODE_DRAWS, resolvePreset, type OrbSize, type OrbState } from 'thinking-orbs/engine';

const LABELS: Record<OrbState, string> = {
  working: 'Working…',
  searching: 'Searching…',
  solving: 'Solving…',
  listening: 'Listening…',
  connecting: 'Connecting…',
  weaving: 'Weaving…',
  composing: 'Composing…',
  breathing: 'Thinking…',
  shaping: 'Shaping…',
};

@Component({
  selector: 'fl-thinking-orb',
  template: `<canvas #canvas role="img" [attr.aria-label]="label()"></canvas>`,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
      flex-shrink: 0;
    }
    canvas {
      display: block;
    }
  `,
})
export class FlThinkingOrb {
  readonly state = input<OrbState>('solving');
  readonly size = input<OrbSize>(64);
  readonly theme = input<'dark' | 'light' | 'auto'>('auto');
  readonly speed = input(1);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.start());
  }

  label() {
    return LABELS[this.state()];
  }

  private start() {
    const canvas = this.canvas().nativeElement;
    const size = this.size();
    const dpr = Math.min(2, typeof devicePixelRatio === 'undefined' ? 1 : devicePixelRatio);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { mode, speed, opts } = resolvePreset(this.state(), size);
    const draw = MODE_DRAWS[mode];
    const clock = speed * this.speed();
    const dark = this.isDark();
    const reduced =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    const frame = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      draw(ctx, size, t, dark, opts);
    };

    if (reduced) {
      frame(0.6);
      return;
    }

    let raf = 0;
    let running = false;
    const tick = () => {
      frame((performance.now() / 1000) * clock);
      if (running) raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    frame((performance.now() / 1000) * clock);
    let visible = true;
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && document.visibilityState !== 'hidden') play();
            else stop();
          });
    io?.observe(canvas);
    const onVis = () => {
      if (document.visibilityState === 'hidden') stop();
      else if (visible) play();
    };
    document.addEventListener('visibilitychange', onVis);
    if (!io) play();

    this.destroyRef.onDestroy(() => {
      stop();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    });
  }

  private isDark() {
    const theme = this.theme();
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return typeof matchMedia === 'undefined' || matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
