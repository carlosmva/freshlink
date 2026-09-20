import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, Persona } from '../../core/auth.service';
import { FlIcon } from '../../shared/icon/icon';

const COPY: Record<
  Persona,
  { eyebrow: string; title: string; body: string; email: string }
> = {
  facility: {
    eyebrow: 'Facility staff',
    title: 'Sign in to plan this week’s meals',
    body: 'Review the AI basket, approve substitutions, and track deliveries for your site.',
    email: 'dana@hopeharbor.org',
  },
  food: {
    eyebrow: 'Food source',
    title: 'Sign in to your supplier portal',
    body: 'Publish inventory, receive institutional orders, and follow payouts.',
    email: 'aisha@coresupply.org',
  },
  transport: {
    eyebrow: 'Transportation',
    title: 'Sign in to dispatch',
    body: 'Accept consolidated routes, confirm proof of delivery, and track fleet earnings.',
    email: 'marcus@greenroute.org',
  },
};

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FlIcon],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly persona = (this.route.snapshot.data['persona'] || 'facility') as Persona;
  readonly copy = COPY[this.persona];
  readonly error = signal('');
  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor() {
    if (this.auth.isLoggedIn() && this.auth.user()?.role === this.persona) {
      const dest =
        this.persona === 'facility'
          ? '/client/home'
          : this.persona === 'food'
            ? '/partner/food/dashboard'
            : '/partner/transport/routes';
      void this.router.navigateByUrl(dest);
    }
  }

  submit() {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password, this.persona).subscribe({
      next: (res) => {
        void this.router.navigateByUrl(res.redirect);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err?.error?.error || 'Could not sign in. Try again.');
      },
    });
  }
}
