import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Auth } from '../../core/services/auth';
import { Toaster } from '../../core/services/toast';
import { SalesPasswordModal } from './sales-password-modal/sales-password-modal';
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
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, SalesPasswordModal],
})
export class UserProfile {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly toast = inject(Toaster);

  readonly loading = signal(false);
  readonly salesPasswordOpen = signal(false);

  // Dispatches the account option buttons by id. Sales-confirmation is wired;
  // change-password and notification-history are handled in later tasks.
  onAccountOption(id: string) {
    if (id === 'sales-confirmation') {
      this.salesPasswordOpen.set(true);
    }
  }

  // Photo upload state. Allowed types + size mirror PATCH /auth/profile (auth.md).
  private readonly allowedPhotoTypes = [
    'image/jpeg',
    'image/png',
    'image/avif',
    'image/webp',
    'image/gif',
  ];
  private readonly maxPhotoBytes = 6 * 1024 * 1024;
  readonly uploadingPhoto = signal(false);
  private readonly previewUrl = signal<string | null>(null);

  // Preview wins while a local file is chosen, otherwise the saved photo.
  readonly avatarUrl = computed(() => this.previewUrl() ?? this.auth.currentUser()?.imagen_url ?? null);

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

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!this.allowedPhotoTypes.includes(file.type)) {
      this.toast.warning('Imagen no válida', 'Formatos permitidos: JPG, PNG, AVIF, WEBP o GIF.');
      input.value = '';
      return;
    }
    if (file.size > this.maxPhotoBytes) {
      this.toast.warning('Imagen muy pesada', 'El tamaño máximo permitido es 6 MB.');
      input.value = '';
      return;
    }

    this.setPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append('imagen', file);
    this.uploadingPhoto.set(true);
    this.auth
      .updateProfileWithPhoto(fd)
      .pipe(
        finalize(() => {
          this.uploadingPhoto.set(false);
          input.value = '';
        }),
      )
      .subscribe({
        next: () =>
          this.toast.success('Foto actualizada', 'Tu foto de perfil se actualizó correctamente.'),
        error: (err) => {
          this.setPreview(null); // revert to the saved photo on failure
          this.toast.error('No se pudo subir la foto', this.errorMessage(err));
        },
      });
  }

  // Swap the local preview, revoking the previous blob URL to avoid leaks.
  private setPreview(url: string | null) {
    const previous = this.previewUrl();
    if (previous) URL.revokeObjectURL(previous);
    this.previewUrl.set(url);
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
