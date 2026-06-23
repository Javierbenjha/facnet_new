import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CompanyRequest } from '../../../../core/models/company.model';

// What the form hands up to its container: everything except usuario_id,
// which comes from the session (Auth), not from the UI.
export type CompanyFormData = Omit<CompanyRequest, 'usuario_id'>;

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonModule, InputText, Password, ToggleSwitch],
})
export class CompanyForm {
  private readonly fb = inject(FormBuilder);

  // The container owns the HTTP call, so it tells the form when to show the spinner.
  readonly loading = input(false);
  // This form is "dumb": it only validates and hands the data up.
  readonly submitted = output<CompanyFormData>();

  // Files are not plain text, so they live outside the FormGroup.
  readonly logoVertical = signal<File | null>(null);
  readonly logoHorizontal = signal<File | null>(null);

  readonly hasBothLogos = computed(
    () => this.logoVertical() !== null && this.logoHorizontal() !== null,
  );

  // A File lives in memory; <img src> needs a URL. createObjectURL builds a
  // temporary blob URL pointing at that file, with no upload involved.
  readonly previewVertical = computed(() => {
    const file = this.logoVertical();
    return file ? URL.createObjectURL(file) : null;
  });
  readonly previewHorizontal = computed(() => {
    const file = this.logoHorizontal();
    return file ? URL.createObjectURL(file) : null;
  });

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
    const vertical = this.logoVertical();
    const horizontal = this.logoHorizontal();
    if (this.form.invalid || !vertical || !horizontal) return;

    const v = this.form.getRawValue();
    this.submitted.emit({
      descripcion: v.descripcion,
      ruc: v.ruc,
      direccion: v.direccion,
      ubigeo: v.ubigeo,
      usuario_sol: v.usuario_sol,
      clave_sol: v.clave_sol,
      monto700: v.monto700,
      monto_mensual: v.monto_mensual,
      monto_anual: v.monto_anual,
      stdetraccion: v.stdetraccion ? 1 : 0,
      stretencion: v.stretencion ? 1 : 0,
      limit_ret: v.limit_ret,
      ctedetra: v.ctedetra,
      logo_vertical: vertical,
      logo_horizontal: horizontal,
    });
  }
}
