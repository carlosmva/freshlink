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

function releaseMotionStyles(el: Element | null) {
  if (!el) return;
  const node = el as HTMLElement;
  node.getAnimations?.().forEach((animation) => animation.cancel());
  node.style.removeProperty('opacity');
  node.style.removeProperty('transform');
  node.style.removeProperty('translate');
  node.style.removeProperty('scale');
  node.style.removeProperty('filter');
}

/** Landing: logo welcomes, then hero, CTAs, and story. Principle sections reveal on scroll. */
export function playLandingEnter(root: HTMLElement) {
  const stage = root.querySelector('.brand-stage');
  const logo = root.querySelector('.logo-full');
  const start = root.querySelector('.get-started');
  const hero = root.querySelector('.hero');
  const story = root.querySelector('.story');
  const explore = root.querySelector('.explore-label');
  const cards = root.querySelectorAll('.persona-card');
  const finishEnter = () => {
    requestAnimationFrame(() => {
      releaseMotionStyles(logo);
      stage?.classList.add('is-entered');
    });
  };

  if (reducedMotion()) {
    show(hero);
    show(explore);
    show(cards);
    show(story);
    stage?.classList.add('is-entered');
    return;
  }

  if (logo) {
    animate(
      logo,
      { opacity: [0, 1], y: [36, 0], scale: [0.86, 1] },
      { type: 'spring', stiffness: 200, damping: 18, mass: 0.9, onComplete: finishEnter },
    );
  } else {
    finishEnter();
  }
  if (start) {
    animate(start, { opacity: [0, 1], y: [16, 0] }, {
      duration: 0.45,
      delay: 0.28,
      onComplete: () => {
        requestAnimationFrame(() => releaseMotionStyles(start));
      },
    });
  }
  if (hero) {
    animate(
      hero,
      { opacity: [0, 1], y: [18, 0], filter: ['blur(6px)', 'blur(0px)'] },
      { ...softSpring, delay: 0.36 },
    );
  }
  if (explore) {
    animate(explore, { opacity: [0, 1] }, { duration: 0.3, delay: 0.44 });
  }
  if (cards.length) {
    animate(
      cards,
      { opacity: [0, 1], y: [28, 0], scale: [0.96, 1] },
      { ...softSpring, delay: stagger(0.09, { startDelay: 0.48 }) },
    );
  }
  if (story) {
    animate(story, { opacity: [0, 1], y: [16, 0] }, { ...softSpring, delay: 0.7 });
  }
}

const principleCopy = '.principle-copy .eyebrow, .principle-copy h2, .principle-copy .lede';

/** Timed enter for one horizontal feature panel. Plays once per slide. */
export function playPrincipleSlide(slide: HTMLElement) {
  if (slide.dataset['played'] === '1') return;
  slide.dataset['played'] = '1';

  const media = slide.querySelector('.principle-media img');
  const eyebrow = slide.querySelector('.principle-copy .eyebrow');
  const title = slide.querySelector('.principle-copy h2');
  const body = slide.querySelector('.principle-copy .lede');

  if (reducedMotion()) {
    show(slide.querySelectorAll(principleCopy));
    show(media);
    return;
  }

  if (media) {
    animate(
      media,
      { scale: [1.12, 1], opacity: [0.45, 1] },
      { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    );
  }
  if (eyebrow) {
    animate(eyebrow, { opacity: [0, 1], y: [16, 0] }, { duration: 0.42, delay: 0.14 });
  }
  if (title) {
    animate(title, { opacity: [0, 1], y: [36, 0] }, { ...softSpring, delay: 0.28 });
  }
  if (body) {
    animate(body, { opacity: [0, 1], y: [22, 0] }, { duration: 0.55, delay: 0.46 });
  }
}

export function showPrincipleSlide(slide: HTMLElement) {
  show(slide.querySelectorAll(principleCopy));
  show(slide.querySelector('.principle-media img'));
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
