import { afterNextRender, Component, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { playLandingEnter } from '../../core/motion';
import { FlIcon } from '../../shared/icon/icon';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, FlIcon],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingPage {
  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => playLandingEnter(this.host.nativeElement));
  }
}
