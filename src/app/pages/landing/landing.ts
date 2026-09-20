import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import Lenis from 'lenis';
import { playLandingEnter, playPrincipleSlide, showPrincipleSlide } from '../../core/motion';
import { FlIcon } from '../../shared/icon/icon';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, FlIcon],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingPage {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const root = this.host.nativeElement;
      playLandingEnter(root);
      const stopLenis = startLandingLenis(root);
      this.destroyRef.onDestroy(stopLenis);
    });
  }
}

function startLandingLenis(root: HTMLElement) {
  const reducedMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.075,
    anchors: true,
    stopInertiaOnNavigate: true,
    respectReducedMotion: true,
  });

  const stopHorizontal = bindPrinciplesHorizontal(root, lenis, reducedMotion);

  return () => {
    stopHorizontal();
    lenis.destroy();
  };
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function bindPrinciplesHorizontal(root: HTMLElement, lenis: Lenis, reducedMotion: boolean) {
  const section = root.querySelector<HTMLElement>('.principles');
  const pin = root.querySelector<HTMLElement>('.principles-pin');
  const track = root.querySelector<HTMLElement>('.principles-track');
  const bar = root.querySelector<HTMLElement>('.principles-progress-fill');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('.principle'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-principle-index]'));
  if (!section || !pin || !track || slides.length < 2) {
    return () => undefined;
  }

  const count = slides.length;
  section.style.setProperty('--slides', String(count));

  if (reducedMotion) {
    section.classList.add('is-static');
    for (const slide of slides) showPrincipleSlide(slide);
    return () => undefined;
  }

  let active = -1;

  const slideRange = () => Math.max(1, section.offsetHeight - window.innerHeight);

  const sectionStart = () => lenis.scroll + section.getBoundingClientRect().top;

  const apply = () => {
    const range = slideRange();
    const top = section.getBoundingClientRect().top;
    const progress = clamp01(-top / range);
    const width = pin.clientWidth;
    track.style.transform = `translate3d(${-progress * (count - 1) * width}px, 0, 0)`;
    if (bar) bar.style.transform = `scaleX(${Math.max(progress, 0.04)})`;

    const visible = top < window.innerHeight * 0.62 && top > -range;
    if (visible) section.classList.add('is-engaged');

    const index = Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))));
    if (visible && index !== active) {
      active = index;
      playPrincipleSlide(slides[index]);
      for (const [i, dot] of dots.entries()) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      }
    }
  };

  const onDot = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement;
    const index = Number(button.dataset['principleIndex']);
    if (Number.isNaN(index)) return;
    lenis.scrollTo(sectionStart() + (index / (count - 1)) * slideRange(), {
      duration: 1.15,
    });
  };

  const stopScroll = lenis.on('scroll', apply);
  apply();
  for (const dot of dots) dot.addEventListener('click', onDot);

  const resize = new ResizeObserver(apply);
  resize.observe(pin);

  return () => {
    stopScroll();
    resize.disconnect();
    for (const dot of dots) dot.removeEventListener('click', onDot);
  };
}
