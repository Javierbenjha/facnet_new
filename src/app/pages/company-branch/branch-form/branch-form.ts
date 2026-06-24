import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { SucursalListItem, SucursalRequest } from '../../../core/models/branch.model';
import { Cia } from '../../../core/models/company.model';
import { UbigeoSelect, UbigeoSelection } from '../../../shared/ubigeo-select/ubigeo-select';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button, InputText, Select, AppModal, UbigeoSelect],
})
export class BranchForm {
  private readonly fb = inject(FormBuilder);

  readonly editing  = input<SucursalListItem | 'new' | null>(null);
  readonly empresas = input<Cia[]>([]);
  readonly closed   = output<void>();
  // El ciaId va en la URL (no en el body), por eso se emite aparte del payload.
  readonly saved    = output<{ ciaId: string; payload: SucursalRequest }>();

  readonly visible = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    return e === 'new' ? 'Nueva sucursal' : `Editar · ${(e as SucursalListItem).descripcion}`;
  });

  readonly empresaOptions = computed(() =>
    this.empresas().map((e) => ({ label: e.descripcion, value: e.id })),
  );

  // Códigos para precargar la cascada de ubigeo al editar; null al crear.
  readonly ubigeoInitial = computed(() => {
    const e = this.editing();
    if (!e || e === 'new') return null;
    return { departamento: e.codigoDepartamento, provincia: e.codigoProvincia, distrito: e.codigoDistrito };
  });

  readonly form = this.fb.nonNullable.group({
    empresa_id:   [''],
    descripcion:  [''],
    direccion:    [''],
    telefono:     [''],
    email:        [''],
    departamento: [''],
    provincia:    [''],
    distrito:     [''],
    ubigeo:       [''],
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.form.reset({
          empresa_id: this.empresas()[0]?.id ?? '',
          descripcion: '', direccion: '', telefono: '', email: '',
          departamento: '', provincia: '', distrito: '', ubigeo: '',
        });
        this.form.controls.empresa_id.enable();
      } else {
        const suc = e as SucursalListItem;
        this.form.patchValue({
          empresa_id: suc.ciaId,
          descripcion: suc.descripcion,
          direccion: suc.direccion,
          // telefono/email pueden venir null; el form es nonNullable, así que coercemos a ''.
          telefono: suc.telefono ?? '',
          email: suc.email ?? '',
        });
        // La empresa no se reasigna en update; la ubicación la precarga el widget vía [initial].
        this.form.controls.empresa_id.disable();
      }
    });
  }

  // El widget de ubigeo arma dep/prov/dist y el ubigeo (concatenado); volcamos todo al form.
  onUbigeoChange(sel: UbigeoSelection | null) {
    this.form.patchValue({
      departamento: sel?.departamento ?? '',
      provincia: sel?.provincia ?? '',
      distrito: sel?.distrito ?? '',
      ubigeo: sel?.ubigeo ?? '',
    });
  }

  save() {
    const v = this.form.getRawValue();
    const payload: SucursalRequest = {
      descripcion: v.descripcion,
      direccion: v.direccion,
      departamento: v.departamento,
      provincia: v.provincia,
      distrito: v.distrito,
      ubigeo: v.ubigeo,
      telefono: v.telefono,
      email: v.email,
    };
    this.saved.emit({ ciaId: v.empresa_id, payload });
    this.closed.emit();
  }

  close() { this.closed.emit(); }
}
