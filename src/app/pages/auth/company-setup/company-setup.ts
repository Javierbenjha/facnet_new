import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { finalize, switchMap } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { Company } from '../../../core/services/company';
import { Toaster } from '../../../core/services/toast';
import { CompanyRequest } from '../../../core/models/company.model';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-company-setup',
  templateUrl: './company-setup.html',
  styleUrl: './company-setup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonModule, InputText, Password],
})
export class CompanySetup {
  private readonly fb = inject(FormBuilder);
  private readonly company = inject(Company);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toast = inject(Toaster);

  readonly loading = signal(false);

  // Files are not plain text, so they live outside the FormGroup.
  readonly logoVertical = signal<File | null>(null);
  readonly logoHorizontal = signal<File | null>(null);

  readonly hasBothLogos = computed(
    () => this.logoHorizontal() !== null && this.logoVertical() !== null,
  );

  readonly previewVertical = computed(
    () => this.logoVertical()  URL.createObjectURL(file)
  )

    readonly previewHorizontal = computed(
    () => this.logoHorizontal()   URL.createObjectURL(file)
  )

  readonly form = this.fb.nonNullable.group({
    descripcion: ['', [Validators.required]],
    ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    direccion: ['', [Validators.required]],
    ubigeo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    usuario_sol: ['', [Validators.required]],
    clave_sol: ['', [Validators.required]],
    monto700: [700, [Validators.required]],
    monto_mensual: [0, [Validators.required]],
    monto_anual: [0, [Validators.required]],
    stdetraccion: [false, [Validators.required]],
    stretencion: [false, [Validators.required]],
    limit_ret: [700, [Validators.required]],
    ctedetra: ['', [Validators.required]],
  });

  onFileSelect(event: Event, slot: 'vertical' | 'horizontal') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (slot === 'vertical') this.logoVertical.set(file);
    else this.logoHorizontal.set(file);
  }

  onSubmit() {
    if (this.form.invalid) return;
    if (!this.logoHorizontal()) return this.toast.warning('Imagen obligatoria', 'Sube una imagen');
    if (!this.logoVertical()) return this.toast.warning('Imagen obligatoria', 'Sube una imagen');

    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      this.toast.error('Sesión inválida', 'Vuelve a iniciar sesión.');
      return;
    }

    const v = this.form.getRawValue();
    const payload: CompanyRequest = {
      descripcion: v.descripcion,
      ruc: v.ruc,
      direccion: v.direccion,
      ubigeo: v.ubigeo,
      usuario_sol: v.usuario_sol,
      clave_sol: v.clave_sol,
      usuario_id: userId,
      monto700: v.monto700,
      monto_mensual: v.monto_mensual,
      monto_anual: v.monto_anual,
      stdetraccion: v.stdetraccion === true ? 1 : 0,
      stretencion: v.stretencion === true ? 1 : 0,
      limit_ret: v.limit_ret,
      ctedetra: v.ctedetra,
      logo_horizontal: this.logoHorizontal()!,
      logo_vertical: this.logoVertical()!,
    };

    this.loading.set(true);
    this.company
      .create(payload)
      .pipe(
        switchMap(() => this.auth.me()),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => this.toast.error('No se pudo crear la empresa', err.error?.message),
      });
  }
}
