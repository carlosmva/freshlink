import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import Lenis from 'lenis';
import { playLandingEnter, playPrincipleSlide, showPrincipleSlide } from '../../core/motion';
import { FlIcon } from '../../shared/icon/icon';
import { FlSiteNav } from '../../shared/site-nav/site-nav';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, FlIcon, FlSiteNav],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  host: { id: 'landing-root' },
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
  const stopBrand = bindBrandMorph(root, lenis, reducedMotion);
  const stopScrollbar = bindBrandScrollbar(root, lenis);

  return () => {
    stopScrollbar();
    stopBrand();
    stopHorizontal();
    lenis.destroy();
  };
}

const DESKTOP_SCROLLBAR = '(min-width: 801px)';

function bindBrandScrollbar(root: HTMLElement, lenis: Lenis) {
  const html = document.documentElement;
  const bar = root.querySelector<HTMLElement>('.brand-scrollbar');
  const thumb = root.querySelector<HTMLElement>('.brand-scrollbar-thumb');
  if (!bar || !thumb) {
    return () => undefined;
  }

  const desktop = matchMedia(DESKTOP_SCROLLBAR);
  const thumbSize = () => thumb.offsetHeight || 24;
  let lastThumbY = Number.NaN;

  const setNativeHidden = () => {
    html.classList.toggle('has-brand-scrollbar', desktop.matches);
  };

  const positionThumb = () => {
    const max = Math.max(0, bar.clientHeight - thumbSize());
    const progress = Number.isFinite(lenis.progress) ? lenis.progress : 0;
    const y = progress * max;
    if (y === lastThumbY) return;
    lastThumbY = y;
    thumb.style.transform = `translate3d(0, ${y}px, 0)`;
    bar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
  };

  let dragging = false;
  let grab = 0;

  const progressFromClientY = (clientY: number, offset: number) => {
    const rect = bar.getBoundingClientRect();
    const max = Math.max(1, rect.height - thumbSize());
    return clamp01((clientY - rect.top - offset) / max);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!desktop.matches) return;
    event.preventDefault();
    const onThumb = thumb === event.target || thumb.contains(event.target as Node);
    grab = onThumb ? event.clientY - thumb.getBoundingClientRect().top : thumbSize() / 2;
    dragging = true;
    thumb.classList.add('is-dragging');
    try {
      bar.setPointerCapture(event.pointerId);
    } catch {
      /* synthetic events have no active pointer */
    }
    lenis.scrollTo(progressFromClientY(event.clientY, grab) * lenis.limit, { immediate: true });
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    lenis.scrollTo(progressFromClientY(event.clientY, grab) * lenis.limit, { immediate: true });
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    thumb.classList.remove('is-dragging');
    if (bar.hasPointerCapture(event.pointerId)) {
      bar.releasePointerCapture(event.pointerId);
    }
  };

  setNativeHidden();
  positionThumb();

  const stopScroll = lenis.on('scroll', positionThumb);
  const resize = new ResizeObserver(positionThumb);
  resize.observe(bar);
  desktop.addEventListener('change', setNativeHidden);
  bar.addEventListener('pointerdown', onPointerDown);
  bar.addEventListener('pointermove', onPointerMove);
  bar.addEventListener('pointerup', onPointerUp);
  bar.addEventListener('pointercancel', onPointerUp);

  return () => {
    stopScroll();
    resize.disconnect();
    desktop.removeEventListener('change', setNativeHidden);
    bar.removeEventListener('pointerdown', onPointerDown);
    bar.removeEventListener('pointermove', onPointerMove);
    bar.removeEventListener('pointerup', onPointerUp);
    bar.removeEventListener('pointercancel', onPointerUp);
    html.classList.remove('has-brand-scrollbar');
  };
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function bindBrandMorph(root: HTMLElement, lenis: Lenis, reducedMotion: boolean) {
  const stage = root.querySelector<HTMLElement>('[data-brand-stage]');
  const welcome = root.querySelector<HTMLElement>('.welcome');
  const start = root.querySelector<HTMLElement>('.get-started');
  const compact = root.querySelector<HTMLElement>('.nav-compact');
  if (!stage || !welcome) {
    return () => undefined;
  }

  const apply = () => {
    const range = Math.max(1, welcome.offsetHeight);
    const raw = reducedMotion
      ? welcome.getBoundingClientRect().top <= 8
        ? 1
        : 0
      : clamp01(-welcome.getBoundingClientRect().top / range);
    root.style.setProperty('--morph', raw.toFixed(4));
    const compactNow = raw > 0.82;
    stage.classList.toggle('is-compact', compactNow);
    compact?.setAttribute('aria-hidden', compactNow ? 'false' : 'true');
    compact?.setAttribute('tabindex', compactNow ? '0' : '-1');
    start?.setAttribute('aria-hidden', raw > 0.55 ? 'true' : 'false');
  };

  const goIntro = (event: Event) => {
    event.preventDefault();
    lenis.scrollTo(lenis.scroll + welcome.getBoundingClientRect().bottom, {
      duration: reducedMotion ? 0.4 : 1.15,
    });
  };

  apply();
  const stopScroll = lenis.on('scroll', apply);
  start?.addEventListener('click', goIntro);
  compact?.addEventListener('click', goIntro);
  window.addEventListener('resize', apply);

  return () => {
    stopScroll();
    start?.removeEventListener('click', goIntro);
    compact?.removeEventListener('click', goIntro);
    window.removeEventListener('resize', apply);
  };
}

function bindPrinciplesHorizontal(root: HTMLElement, lenis: Lenis, reducedMotion: boolean) {
  const section = root.querySelector<HTMLElement>('.principles');
  const pin = root.querySelector<HTMLElement>('.principles-pin');
  const track = root.querySelector<HTMLElement>('.principles-track');
  const bar = root.querySelector<HTMLElement>('.principles-progress-fill');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('.principle'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-principle-index]'));
  const scrollbar = root.querySelector('.brand-scrollbar');
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
  let hideBar = false;

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

    const pinned = top <= 2 && top >= -range + 2;
    section.classList.toggle('is-pinned', pinned);
    const nextHide = pinned && matchMedia(DESKTOP_SCROLLBAR).matches;
    if (nextHide !== hideBar) {
      hideBar = nextHide;
      scrollbar?.classList.toggle('is-hidden', hideBar);
      scrollbar?.toggleAttribute('inert', hideBar);
      scrollbar?.setAttribute('aria-hidden', hideBar ? 'true' : 'false');
    }

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
