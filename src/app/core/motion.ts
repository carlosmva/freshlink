import { animate, stagger, type AnimationOptions } from 'motion';
import { afterNextRender, Injector } from '@angular/core';

const softSpring: AnimationOptions = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
  mass: 0.8,
};

function reducedMotion() {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function show(els: Element | NodeListOf<Element> | null) {
  if (!els) return;
  const list = els instanceof Element ? [els] : Array.from(els);
  for (const el of list) {
    (el as HTMLElement).style.opacity = '1';
    (el as HTMLElement).style.transform = 'none';
    (el as HTMLElement).style.filter = 'none';
  }
}

/** Landing: brand/hero settle, then CTAs, then story and principles. */
export function playLandingEnter(root: HTMLElement) {
  const hero = root.querySelector('.hero');
  const story = root.querySelector('.story');
  const principles = root.querySelector('.principles');
  const explore = root.querySelector('.explore-label');
  const cards = root.querySelectorAll('.persona-card');
  const topbar = root.querySelector('.topbar');
  if (reducedMotion()) {
    show(topbar);
    show(hero);
    show(explore);
    show(cards);
    show(story);
    show(principles);
    return;
  }

  if (topbar) {
    animate(topbar, { opacity: [0, 1], y: [-8, 0] }, { ...softSpring, duration: 0.45 });
  }
  if (hero) {
    animate(
      hero,
      { opacity: [0, 1], y: [18, 0], filter: ['blur(6px)', 'blur(0px)'] },
      { ...softSpring, delay: 0.08 },
    );
  }
  if (explore) {
    animate(explore, { opacity: [0, 1] }, { duration: 0.3, delay: 0.16 });
  }
  if (cards.length) {
    animate(
      cards,
      { opacity: [0, 1], y: [28, 0], scale: [0.96, 1] },
      { ...softSpring, delay: stagger(0.09, { startDelay: 0.18 }) },
    );
  }
  if (story) {
    animate(story, { opacity: [0, 1], y: [16, 0] }, { ...softSpring, delay: 0.42 });
  }
  if (principles) {
    animate(principles, { opacity: [0, 1], y: [14, 0] }, { ...softSpring, delay: 0.5 });
  }
}

function compactShell() {
  return typeof matchMedia !== 'undefined' && matchMedia('(max-width: 800px)').matches;
}

function finishShell(el: HTMLElement) {
  el.style.opacity = '1';
  el.style.transform = 'none';
  el.style.filter = 'none';
}

/** Client phone frame: scale/opacity presence on enter. */
export function playPhoneEnter(phone: HTMLElement) {
  if (reducedMotion() || compactShell()) {
    finishShell(phone);
    return;
  }
  animate(
    phone,
    { opacity: [0, 1], y: [36, 0], scale: [0.94, 1] },
    { type: 'spring', stiffness: 220, damping: 24, onComplete: () => finishShell(phone) },
  );
}

/** Dashboard: AI panel then KPI tiles. */
export function playDashboardReveal(root: HTMLElement) {
  const ai = root.querySelector('.ai-hero');
  const kpis = root.querySelectorAll('.kpi');
  const cards = root.querySelectorAll('.content > .card, .screen-body > .card');
  if (reducedMotion()) {
    show(ai);
    show(kpis);
    show(cards);
    return;
  }

  if (ai) {
    animate(
      ai,
      { opacity: [0, 1], y: [16, 0], scale: [0.98, 1] },
      { type: 'spring', stiffness: 260, damping: 26 },
    );
  }
  if (kpis.length) {
    animate(
      kpis,
      { opacity: [0, 1], y: [14, 0] },
      { ...softSpring, delay: stagger(0.06, { startDelay: 0.12 }) },
    );
  }
  if (cards.length) {
    animate(
      cards,
      { opacity: [0, 1], y: [12, 0] },
      { ...softSpring, delay: stagger(0.07, { startDelay: 0.28 }) },
    );
  }
}

/** Bar, spark, and KPI charts after data paints. */
export function playChartReveal(root: HTMLElement) {
  const kpis = root.querySelectorAll('.portal-kpi, .impact-kpi');
  const cards = root.querySelectorAll('.chart-card');
  const columns = root.querySelectorAll('.bars .b, .spark i');
  const fills = root.querySelectorAll('.hbar .fill');

  if (reducedMotion()) {
    show(kpis);
    show(cards);
    for (const el of [...columns, ...fills]) {
      (el as HTMLElement).style.transform = 'none';
    }
    return;
  }

  if (kpis.length) {
    animate(kpis, { opacity: [0, 1], y: [14, 0] }, { ...softSpring, delay: stagger(0.05) });
  }
  if (cards.length) {
    animate(
      cards,
      { opacity: [0, 1], y: [12, 0] },
      { ...softSpring, delay: stagger(0.08, { startDelay: 0.06 }) },
    );
  }
  if (columns.length) {
    animate(
      columns,
      { scaleY: [0.04, 1] },
      {
        type: 'spring',
        stiffness: 340,
        damping: 22,
        delay: stagger(0.045, { startDelay: 0.12 }),
      },
    );
  }
  if (fills.length) {
    animate(
      fills,
      { scaleX: [0, 1] },
      {
        type: 'spring',
        stiffness: 260,
        damping: 24,
        delay: stagger(0.07, { startDelay: 0.18 }),
      },
    );
  }
}

/** Partner portal chrome enter. */
export function playPortalEnter(browser: HTMLElement) {
  if (reducedMotion() || compactShell()) {
    finishShell(browser);
    return;
  }
  animate(
    browser,
    { opacity: [0, 1], y: [20, 0], scale: [0.985, 1] },
    { type: 'spring', stiffness: 240, damping: 28, onComplete: () => finishShell(browser) },
  );
}

export function scheduleChartReveal(host: HTMLElement, injector: Injector) {
  afterNextRender(() => playChartReveal(host), { injector });
}
