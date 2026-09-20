import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input } from '@angular/core';
import { ICONS, type IconName } from './icons';

@Component({
  selector: 'fl-icon',
  standalone: true,
  host: { 'aria-hidden': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styles: `
    :host {
      display: inline-flex;
      width: 1em;
      height: 1em;
      flex-shrink: 0;
      line-height: 0;
      color: inherit;
    }
    :host svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  `,
})
export class FlIcon {
  readonly name = input.required<IconName>();
  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      const svg = ICONS[this.name()];
      this.host.nativeElement.innerHTML = svg || '';
    });
  }
}
