import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Auth } from '../../core/services/auth';
import { Toaster } from '../../core/services/toast';
import { finalize } from 'rxjs';

interface AccountOption {
  id: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule],
})
export class UserProfile {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly toast = inject(Toaster);

  readonly loading = signal(false);

  // Validations mirror PATCH /auth/profile (auth.md):
  // nombre máx 100, apellidos máx 150, email válido, teléfono exactamente 9 dígitos.
  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido_paterno: ['', [Validators.maxLength(150)]],
    apellido_materno: ['', [Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^\d{9}$/)]],
  });

  private prefilled = false;

  constructor() {
    // Prefill once, when the session user becomes available (login or rehydration
    // via GET /auth/me). Guarded so a later signal update never clobbers edits.
    effect(() => {
      const user = this.auth.currentUser();
      if (user && !this.prefilled) {
        this.prefilled = true;
        this.form.patchValue({
          nombre: user.nombre ?? '',
          apellido_paterno: user.apellido_paterno ?? '',
          apellido_materno: user.apellido_materno ?? '',
          email: user.email ?? '',
          telefono: user.telefono ?? '',
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.auth
      .updateProfile(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () =>
          this.toast.success('Perfil actualizado', 'Tus datos se guardaron correctamente.'),
        error: (err) =>
          this.toast.error('No se pudo actualizar el perfil', this.errorMessage(err)),
      });
  }

  // PATCH /auth/profile returns 400 with message[] and 409 with a single string.
  private errorMessage(err: unknown): string {
    const message = (err as { error?: { message?: string | string[] } })?.error?.message;
    if (Array.isArray(message)) return message.join(' ');
    return message ?? 'Intenta nuevamente.';
  }

  // Static options for now — functionality is wired in later tasks.
  readonly accountOptions: AccountOption[] = [
    {
      id: 'change-password',
      icon: 'pi pi-key',
      title: 'Cambiar Contraseña',
      description: 'Actualiza tu contraseña',
    },
    {
      id: 'sales-confirmation',
      icon: 'pi pi-shield',
      title: 'Contraseña de confirmación de Ventas',
      description: 'Configuración de seguridad para tus ventas',
    },
    {
      id: 'notification-history',
      icon: 'pi pi-bell',
      title: 'Historial de Notificaciones',
      description: 'Revisa tus notificaciones',
    },
  ];
}
