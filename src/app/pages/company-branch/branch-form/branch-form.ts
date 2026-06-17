import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Empresa, Sucursal } from '../company-branch.models';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button, InputText, InputNumber, Select, AppModal],
})
export class BranchForm {
  private readonly fb = inject(FormBuilder);

  editing   = input<Sucursal | 'new' | null>(null);
  empresas  = input<Empresa[]>([]);
  closed    = output<void>();
  saved     = output<Sucursal>();

  readonly visible = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    return e === 'new' ? 'Nueva sucursal' : `Editar · ${(e as Sucursal).descripcion}`;
  });

  readonly empresaOptions = computed(() =>
    this.empresas().map(e => ({ label: e.razon_social, value: e.id }))
  );

  readonly form = this.fb.nonNullable.group({
    empresa_id:   [''],
    descripcion:  [''],
    direccion:    [''],
    telefono:     [''],
    email:        [''],
    meta:         [0],
    departamento: [''],
    provincia:    [''],
    distrito:     [''],
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.form.reset({
          empresa_id: this.empresas()[0]?.id ?? '',
          descripcion: '', direccion: '', telefono: '', email: '',
          meta: 0, departamento: '', provincia: '', distrito: '',
        });
      } else {
        const suc = e as Sucursal;
        this.form.patchValue({
          empresa_id: suc.empresa_id,
          descripcion: suc.descripcion,
          direccion: suc.direccion,
          telefono: suc.telefono,
          email: suc.email,
          meta: suc.meta,
          departamento: suc.departamento,
          provincia: suc.provincia,
          distrito: suc.distrito,
        });
      }
    });
  }

  save() {
    const v = this.form.getRawValue();
    const existing = this.editing();
    const empresa = this.empresas().find(e => e.id === v.empresa_id);
    const sucursal: Sucursal = {
      id: existing && existing !== 'new' ? (existing as Sucursal).id : crypto.randomUUID(),
      empresa_id: v.empresa_id,
      empresa_nombre: empresa?.razon_social ?? '',
      descripcion: v.descripcion,
      direccion: v.direccion,
      telefono: v.telefono,
      email: v.email,
      meta: v.meta,
      departamento: v.departamento,
      provincia: v.provincia,
      distrito: v.distrito,
      estado: existing && existing !== 'new' ? (existing as Sucursal).estado : 'ACTIVO',
    };
    this.saved.emit(sucursal);
    this.closed.emit();
  }

  close() { this.closed.emit(); }
}
