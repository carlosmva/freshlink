import { Routes } from '@angular/router';
import { ClientShell } from './layouts/client-shell';
import { PortalShell } from './layouts/portal-shell';
import { LandingPage } from './pages/landing/landing';
import { LoginPage } from './pages/login/login';
import { ClientHome } from './pages/client/home/home';
import { ClientBasket } from './pages/client/basket/basket';
import { ClientImpact } from './pages/client/impact/impact';
import { ClientDeliveries } from './pages/client/deliveries/deliveries';
import { FoodInventory } from './pages/partner/food/inventory/inventory';
import { FoodOrders } from './pages/partner/food/orders/orders';
import { FoodForecast } from './pages/partner/food/forecast/forecast';
import { FoodDashboard } from './pages/partner/food/dashboard/dashboard';
import { FoodPayouts } from './pages/partner/food/payouts/payouts';
import { TransportRoutes } from './pages/partner/transport/routes/routes';
import { RouteDetail } from './pages/partner/transport/route-detail/route-detail';
import { TransportFleet } from './pages/partner/transport/fleet/fleet';
import { TransportDrivers } from './pages/partner/transport/drivers/drivers';
import { TransportEarnings } from './pages/partner/transport/earnings/earnings';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'client/login', component: LoginPage, data: { persona: 'facility' } },
  { path: 'partner/food/login', component: LoginPage, data: { persona: 'food' } },
  { path: 'partner/transport/login', component: LoginPage, data: { persona: 'transport' } },
  {
    path: 'client',
    component: ClientShell,
    canActivate: [authGuard],
    data: { role: 'facility' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: ClientHome },
      { path: 'basket', component: ClientBasket },
      { path: 'impact', component: ClientImpact },
      { path: 'deliveries', component: ClientDeliveries },
    ],
  },
  {
    path: 'partner/food',
    component: PortalShell,
    canActivate: [authGuard],
    data: { persona: 'food', role: 'food' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: FoodDashboard },
      { path: 'inventory', component: FoodInventory },
      { path: 'orders', component: FoodOrders },
      { path: 'forecast', component: FoodForecast },
      { path: 'payouts', component: FoodPayouts },
    ],
  },
  {
    path: 'partner/transport',
    component: PortalShell,
    canActivate: [authGuard],
    data: { persona: 'transport', role: 'transport' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'routes' },
      { path: 'routes', component: TransportRoutes },
      { path: 'routes/:id', component: RouteDetail },
      { path: 'fleet', component: TransportFleet },
      { path: 'drivers', component: TransportDrivers },
      { path: 'earnings', component: TransportEarnings },
    ],
  },
  { path: '**', redirectTo: '' },
];
