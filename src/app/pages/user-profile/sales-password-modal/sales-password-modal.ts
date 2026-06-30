import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  ValidationErrors,
} from '@angular/forms';
import { filter } from 'rxjs';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { Users } from '../../../core/services/users';

// Cross-field validator: confirmation must match the new item password.
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password_item')?.value;
  const confirm = group.get('confirm')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-sales-password-modal',
  templateUrl: './sales-password-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AppModal, Password, Button],
})
export class SalesPasswordModal {
  visible = model(false);

  private readonly fb = inject(FormBuilder);
  private readonly users = inject(Users);
  private readonly toast = inject(Toaster);

  readonly saving = signal(false);

  // Validation mirrors PATCH /user/password-item (users.md §12): 6–60 chars.
  readonly form = this.fb.nonNullable.group(
    {
      password_item: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(60)],
      ],
      confirm: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  constructor() {
    // Reset the form every time the modal opens so stale input never lingers.
    toObservable(this.visible)
      .pipe(takeUntilDestroyed(), filter(Boolean))
      .subscribe(() => {
        this.form.reset();
        this.saving.set(false);
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.users.updatePasswordItem(this.form.getRawValue().password_item).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.toast.success('Contraseña de ventas actualizada', res.message);
        this.visible.set(false);
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error(
          'No se pudo actualizar',
          this.errorMessage(err),
        );
      },
    });
  }

  // Backend returns 400 with message[] or a single string.
  private errorMessage(err: unknown): string {
    const message = (err as { error?: { message?: string | string[] } })?.error?.message;
    if (Array.isArray(message)) return message.join(' ');
    return message ?? 'Intenta nuevamente.';
  }
}
