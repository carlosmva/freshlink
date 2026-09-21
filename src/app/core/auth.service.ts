import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map } from 'rxjs';

export type Persona = 'facility' | 'food' | 'transport' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Persona;
  facilityId: string | null;
  partnerId: string | null;
  orgName: string | null;
  orgSlug: string | null;
  initials: string;
}

const TOKEN_KEY = 'freshlink.token';
const USER_KEY = 'freshlink.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly user = signal<AuthUser | null>(readStoredUser());

  get token(): string | null {
    try {
      if (typeof sessionStorage === 'undefined') return null;
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return Boolean(this.token && this.user());
  }

  config(): Observable<{ turnstileSiteKey: string; turnstileMode: 'dev' | 'production' }> {
    return this.http.get<{ turnstileSiteKey?: string; turnstileMode?: string }>('/api/config').pipe(
      map((res): { turnstileSiteKey: string; turnstileMode: 'dev' | 'production' } => ({
        turnstileSiteKey: res.turnstileSiteKey || '',
        turnstileMode: res.turnstileMode === 'production' ? 'production' : 'dev',
      })),
      catchError(() => of({ turnstileSiteKey: '', turnstileMode: 'dev' as const })),
    );
  }

  login(
    email: string,
    password: string,
    persona: Persona,
    turnstileToken: string | null,
  ): Observable<{ user: AuthUser; redirect: string }> {
    return this.http
      .post<{ token: string; user: AuthUser; redirect: string }>('/api/auth/login', {
        email,
        password,
        persona,
        turnstileToken,
      })
      .pipe(
        tap((res) => this.persist(res.token, res.user)),
        map((res) => ({ user: res.user, redirect: res.redirect })),
      );
  }

  restoreSession(): Observable<AuthUser | null> {
    if (!this.token) {
      this.clear();
      return of(null);
    }
    return this.http.get<{ user: AuthUser }>('/api/auth/me').pipe(
      tap((res) => {
        this.user.set(res.user);
        sessionStorage.setItem(USER_KEY, JSON.stringify(res.user));
      }),
      map((res) => res.user),
      catchError(() => {
        this.clear();
        return of(null);
      }),
    );
  }

  logout(loginPath = '/'): void {
    const token = this.token;
    this.clear();
    if (token) {
      this.http.post('/api/auth/logout', {}).subscribe({ error: () => undefined });
    }
    void this.router.navigateByUrl(loginPath);
  }

  loginPath(persona: Persona): string {
    if (persona === 'facility') return '/client/login';
    if (persona === 'food') return '/partner/food/login';
    if (persona === 'admin') return '/admin/login';
    return '/partner/transport/login';
  }

  private persist(token: string, user: AuthUser) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.user.set(user);
  }

  private clear() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    this.user.set(null);
  }
}

function readStoredUser(): AuthUser | null {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
