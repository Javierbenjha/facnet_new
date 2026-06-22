import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Auth } from '../../../core/services/auth';
import { Toaster } from '../../../core/services/toast';
import { AuthBranding } from '../../../shared/auth-branding/auth-branding';
import { finalize } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';

const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
};

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputText, Password, AuthBranding],
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  readonly loading = signal(false);
  private readonly toast = inject(Toaster);



  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellido_paterno: ['', [Validators.required]],
    apellido_materno: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
  },
  {
    validators: passwordsMatch,
  });

  onSubmit() {
    if (this.form.invalid) return;
    const { confirmPassword, ...payload } = this.form.getRawValue();
    this.loading.set(true);
    this.auth
      .register(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/company-setup']),
        error: (err) => this.toast.error('Error al registrarse', err.error?.message),
      });
  }
}
