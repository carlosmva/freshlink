import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { FlIcon } from '../shared/icon/icon';
import type { IconName } from '../shared/icon/icons';

@Component({
  selector: 'app-portal-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FlIcon],
  templateUrl: './portal-shell.html',
  styleUrl: './portal-shell.scss',
})
export class PortalShell {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  private readonly main = viewChild<ElementRef<HTMLElement>>('main');
  readonly persona = toSignal(
    this.route.data.pipe(map((d) => (d['persona'] as 'food' | 'transport') || 'food')),
    { initialValue: 'food' as const },
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.main()?.nativeElement.scrollTo(0, 0);
        window.scrollTo(0, 0);
      });
  }

  get title() {
    return this.auth.user()?.orgName || (this.persona() === 'food' ? 'Food partner' : 'Transport partner');
  }

  logout() {
    this.auth.logout(this.auth.loginPath(this.persona()));
  }

  get nav(): { path: string; label: string; short: string; icon: IconName }[] {
    return this.persona() === 'food'
      ? [
          { path: '/partner/food/dashboard', label: 'Dashboard', short: 'Home', icon: 'layout-dashboard' },
          { path: '/partner/food/inventory', label: 'Inventory', short: 'Stock', icon: 'warehouse' },
          { path: '/partner/food/orders', label: 'Orders', short: 'Orders', icon: 'clipboard-list' },
          { path: '/partner/food/forecast', label: 'Demand forecast', short: 'Forecast', icon: 'chart-line' },
          { path: '/partner/food/payouts', label: 'Payouts', short: 'Pay', icon: 'wallet' },
        ]
      : [
          { path: '/partner/transport/routes', label: 'Routes', short: 'Routes', icon: 'route' },
          { path: '/partner/transport/fleet', label: 'Fleet', short: 'Fleet', icon: 'truck' },
          { path: '/partner/transport/drivers', label: 'Drivers', short: 'Drivers', icon: 'users' },
          { path: '/partner/transport/earnings', label: 'Earnings', short: 'Pay', icon: 'wallet' },
        ];
  }
}
