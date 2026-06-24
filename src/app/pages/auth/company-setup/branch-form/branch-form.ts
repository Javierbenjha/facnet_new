import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { SucursalRequest } from '../../../../core/models/branch.model';
import { UbigeoSelect, UbigeoSelection } from '../../../../shared/ubigeo-select/ubigeo-select';

// The form hands up everything except ubigeo: the container builds the 6-digit
// ubigeo from departamento + provincia + distrito (same idea as usuario_id in company).
export type BranchFormData = Omit<SucursalRequest, 'ubigeo'>;

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonModule, InputText, InputNumber, UbigeoSelect],
})
export class BranchForm {
  private readonly fb = inject(FormBuilder);

  // The container owns the HTTP call; it tells the form when to show the spinner.
  readonly loading = input(false);
  // Dumb form: only validates and hands the data up.
  readonly submitted = output<BranchFormData>();

  readonly form = this.fb.nonNullable.group({
    descripcion: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    meta: [0, [Validators.required, Validators.min(0)]],
    telefono: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    // These three are patched by <app-ubigeo-select>, never typed by hand.
    departamento: ['', [Validators.required]],
    provincia: ['', [Validators.required]],
    distrito: ['', [Validators.required]],
  });

  onUbigeoChange(sel: UbigeoSelection | null) {
    this.form.patchValue({
      departamento: sel?.departamento ?? '',
      provincia: sel?.provincia ?? '',
      distrito: sel?.distrito ?? '',
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.submitted.emit({
      descripcion: v.descripcion,
      direccion: v.direccion,
      departamento: v.departamento,
      provincia: v.provincia,
      distrito: v.distrito,
      meta: v.meta,
      telefono: v.telefono,
      email: v.email,
    });
  }
}
