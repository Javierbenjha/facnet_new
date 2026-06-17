import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Persona, TipoDocumento, TipoPersona } from '../customers-suppliers.models';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button, InputText, Select, InputGroup, InputGroupAddon, AppModal],
})
export class CustomerForm {
  private readonly fb = inject(FormBuilder);

  editing     = input<Persona | 'new' | null>(null);
  tipoPersona = input<TipoPersona>('CLIENTE');
  closed      = output<void>();
  saved       = output<Persona>();

  readonly visible = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    const tipo = this.tipoPersona() === 'CLIENTE' ? 'cliente' : 'proveedor';
    return e === 'new' ? `Nuevo ${tipo}` : `Editar ${tipo}`;
  });

  readonly tipoDocOptions = [
    { label: 'DNI',          value: 'DNI' },
    { label: 'RUC',          value: 'RUC' },
    { label: 'Carnet Ext.',  value: 'CE'  },
  ];

  readonly form = this.fb.nonNullable.group({
    tipo_documento:   ['DNI' as TipoDocumento],
    numero_documento: [''],
    nombre:           [''],
    apellido_paterno: [''],
    apellido_materno: [''],
    telefono:         [''],
    email:            [''],
    direccion:        [''],
    departamento:     [''],
    provincia:        [''],
    distrito:         [''],
  });

  readonly tipoDoc = toSignal(this.form.controls.tipo_documento.valueChanges, {
    initialValue: 'DNI' as TipoDocumento,
  });

  readonly isDni = computed(() => this.tipoDoc() === 'DNI' || this.tipoDoc() === 'CE');
  readonly isRuc = computed(() => this.tipoDoc() === 'RUC');

  readonly docPlaceholder = computed(() => {
    const t = this.tipoDoc();
    if (t === 'DNI') return '76329484';
    if (t === 'RUC') return '20123456789';
    return 'CE-000000000';
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.form.reset({
          tipo_documento: 'DNI', numero_documento: '',
          nombre: '', apellido_paterno: '', apellido_materno: '',
          telefono: '', email: '', direccion: '',
          departamento: '', provincia: '', distrito: '',
        });
      } else {
        const p = e as Persona;
        this.form.patchValue({
          tipo_documento:   p.tipo_documento,
          numero_documento: p.numero_documento,
          nombre:           p.nombre,
          apellido_paterno: p.apellido_paterno ?? '',
          apellido_materno: p.apellido_materno ?? '',
          telefono:         p.telefono,
          email:            p.email,
          direccion:        p.direccion,
          departamento:     p.departamento,
          provincia:        p.provincia,
          distrito:         p.distrito,
        });
      }
    });
  }

  buscarDocumento() {
    const doc  = this.form.controls.numero_documento.value.trim();
    const tipo = this.form.controls.tipo_documento.value;
    if (!doc) return;

    if (tipo === 'DNI' && doc.length === 8) {
      this.form.patchValue({
        nombre: 'Juan Carlos', apellido_paterno: 'García', apellido_materno: 'López',
      });
    } else if (tipo === 'RUC' && doc.length === 11) {
      this.form.patchValue({
        nombre: 'EMPRESA DEMO S.A.C.', apellido_paterno: '', apellido_materno: '',
        direccion: 'Av. Ejemplo 123, Lima',
        departamento: 'Lima', provincia: 'Lima', distrito: 'Miraflores',
      });
    }
  }

  save() {
    const v       = this.form.getRawValue();
    const existing = this.editing();
    const persona: Persona = {
      id:               existing && existing !== 'new' ? (existing as Persona).id : crypto.randomUUID(),
      tipo:             this.tipoPersona(),
      tipo_documento:   v.tipo_documento,
      numero_documento: v.numero_documento,
      nombre:           v.nombre,
      apellido_paterno: this.isDni() ? (v.apellido_paterno || undefined) : undefined,
      apellido_materno: this.isDni() ? (v.apellido_materno || undefined) : undefined,
      telefono:         v.telefono,
      email:            v.email,
      direccion:        v.direccion,
      departamento:     v.departamento,
      provincia:        v.provincia,
      distrito:         v.distrito,
      estado:           existing && existing !== 'new' ? (existing as Persona).estado : 'ACTIVO',
    };
    this.saved.emit(persona);
    this.closed.emit();
  }

  close() { this.closed.emit(); }
}
