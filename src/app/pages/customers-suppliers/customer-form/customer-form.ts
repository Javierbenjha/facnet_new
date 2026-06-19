import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormRoot, FormField, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
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
  imports: [FormRoot, FormField, FormsModule, Button, InputText, Select, InputGroup, InputGroupAddon, AppModal],
})
export class CustomerForm {
  readonly editing     = input<Persona | 'new' | null>(null);
  readonly tipoPersona = input<TipoPersona>('CLIENTE');
  readonly closed      = output<void>();
  readonly saved       = output<Persona>();

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

  readonly model = signal({
    tipo_documento:   'DNI' as TipoDocumento,
    numero_documento: '',
    nombre:           '',
    apellido_paterno: '',
    apellido_materno: '',
    telefono:         '',
    email:            '',
    direccion:        '',
    departamento:     '',
    provincia:        '',
    distrito:         '',
  });

  readonly form = form(this.model);

  readonly isDni = computed(() => this.model().tipo_documento === 'DNI' || this.model().tipo_documento === 'CE');
  readonly isRuc = computed(() => this.model().tipo_documento === 'RUC');

  readonly docPlaceholder = computed(() => {
    const t = this.model().tipo_documento;
    if (t === 'DNI') return '76329484';
    if (t === 'RUC') return '20123456789';
    return 'CE-000000000';
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.model.set({
          tipo_documento: 'DNI', numero_documento: '',
          nombre: '', apellido_paterno: '', apellido_materno: '',
          telefono: '', email: '', direccion: '',
          departamento: '', provincia: '', distrito: '',
        });
      } else {
        const p = e as Persona;
        this.model.set({
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
    const { numero_documento, tipo_documento } = this.model();
    const doc = numero_documento.trim();
    if (!doc) return;

    if (tipo_documento === 'DNI' && doc.length === 8) {
      this.model.update(m => ({
        ...m,
        nombre: 'Juan Carlos', apellido_paterno: 'García', apellido_materno: 'López',
      }));
    } else if (tipo_documento === 'RUC' && doc.length === 11) {
      this.model.update(m => ({
        ...m,
        nombre: 'EMPRESA DEMO S.A.C.', apellido_paterno: '', apellido_materno: '',
        direccion: 'Av. Ejemplo 123, Lima',
        departamento: 'Lima', provincia: 'Lima', distrito: 'Miraflores',
      }));
    }
  }

  save() {
    const v       = this.model();
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
