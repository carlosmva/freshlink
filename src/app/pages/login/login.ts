import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, Persona } from '../../core/auth.service';
import { FlIcon } from '../../shared/icon/icon';
import { FlSiteNav } from '../../shared/site-nav/site-nav';
import { FlTurnstile } from '../../shared/turnstile/turnstile';

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
  admin: {
    eyebrow: 'Admin',
    title: 'Sign in to reset the demo',
    body: 'Showcase control for FreshLink. Restores the three stakeholder portals to the demo dataset.',
    email: 'carlos@northeasternsoftware.com',
  },
};

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FlIcon, FlSiteNav, FlTurnstile],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly widget = viewChild(FlTurnstile);

  readonly persona = (this.route.snapshot.data['persona'] || 'facility') as Persona;
  readonly copy = COPY[this.persona];
  readonly error = signal('');
  readonly submitting = signal(false);
  readonly siteKey = signal('');
  readonly turnstileMode = signal<'dev' | 'production'>('dev');
  readonly turnstileToken = signal<string | null>(null);
  readonly showPassword = signal(false);

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
            : this.persona === 'admin'
              ? '/admin'
              : '/partner/transport/routes';
      void this.router.navigateByUrl(dest);
    }
  }

  ngOnInit() {
    this.auth.config().subscribe((cfg) => {
      this.siteKey.set(cfg.turnstileSiteKey);
      this.turnstileMode.set(cfg.turnstileMode);
    });
  }

  onTurnstile(token: string | null) {
    this.turnstileToken.set(token);
  }

  togglePassword() {
    this.showPassword.update((open) => !open);
  }

  blocked() {
    return this.submitting() || Boolean(this.siteKey() && !this.turnstileToken());
  }

  submit() {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.siteKey() && !this.turnstileToken()) {
      this.error.set('Please complete the verification check.');
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password, this.persona, this.turnstileToken()).subscribe({
      next: (res) => {
        void this.router.navigateByUrl(res.redirect);
      },
      error: (err) => {
        this.submitting.set(false);
        this.turnstileToken.set(null);
        this.widget()?.reset();
        this.error.set(err?.error?.error || 'Could not sign in. Try again.');
      },
    });
  }
}
