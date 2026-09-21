import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { FlSiteNav } from '../../shared/site-nav/site-nav';

@Component({
  selector: 'app-admin',
  imports: [FlSiteNav],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly summary = signal<Record<string, number> | null>(null);

  reset() {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.api.resetDemo().subscribe({
      next: (res) => {
        this.summary.set(res.summary || {});
        this.busy.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.error || 'Could not reset the demo database.');
        this.busy.set(false);
      },
    });
  }

  logout() {
    this.auth.logout('/admin/login');
  }
}
