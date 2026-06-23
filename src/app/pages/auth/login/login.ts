import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Auth } from '../../../core/services/auth';
import { Password } from 'primeng/password';
import { finalize } from 'rxjs';
import { Toaster } from '../../../core/services/toast';
import { AuthBranding } from '../../../shared/auth-branding/auth-branding';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputText, Password, AuthBranding],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly loading = signal(false);
  private readonly toast = inject(Toaster);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          // Si es dueño sin empresa, forzar redirección a setup
          if (res.user.role === 1 && !res.activeCompany) {
            this.router.navigate(['/company-setup']);
          } else {
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/sales';
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: (err) => this.toast.error('Error al iniciar sesión', err.error?.message),
      });
  }
}
