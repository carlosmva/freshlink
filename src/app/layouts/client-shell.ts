import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { FlIcon } from '../shared/icon/icon';
import type { IconName } from '../shared/icon/icons';

@Component({
  selector: 'app-client-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FlIcon],
  templateUrl: './client-shell.html',
  styleUrl: './client-shell.scss',
})
export class ClientShell {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  private readonly scroll = viewChild<ElementRef<HTMLElement>>('scroll');

  readonly nav: { path: string; label: string; short: string; icon: IconName }[] = [
    { path: '/client/home', label: 'Home', short: 'Home', icon: 'house' },
    { path: '/client/basket', label: 'Basket', short: 'Basket', icon: 'shopping-basket' },
    { path: '/client/deliveries', label: 'Deliveries', short: 'Deliveries', icon: 'package-check' },
    { path: '/client/impact', label: 'Impact', short: 'Impact', icon: 'chart-column' },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.scroll()?.nativeElement.scrollTo(0, 0);
        window.scrollTo(0, 0);
      });
  }

  logout() {
    this.auth.logout('/client/login');
  }
}
