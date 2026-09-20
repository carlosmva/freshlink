import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Persona } from './auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = (route.data['role'] || '') as Persona;
  const login = auth.loginPath(role || 'facility');

  const allow = () => {
    const user = auth.user();
    if (!user) return router.createUrlTree([login]);
    if (role && user.role !== role) return router.createUrlTree(['/']);
    return true;
  };

  if (auth.isLoggedIn()) return allow();

  return auth.restoreSession().pipe(
    map((user) => {
      if (!user) return router.createUrlTree([login]);
      return allow();
    }),
    catchError(() => of(router.createUrlTree([login]))),
  );
};
