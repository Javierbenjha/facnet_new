import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { CustomerForm } from './customer-form/customer-form';
import { DireccionModal } from './direccion-modal/direccion-modal';
import { Persona, TipoPersona, PERSONAS_MOCK } from './customers-suppliers.models';

type StatusFilter = 'todos' | 'activos' | 'inactivos';

@Component({
  selector: 'app-customers-suppliers',
  templateUrl: './customers-suppliers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TableModule, Button, SelectButton, Tag, InputText, IconField, InputIcon, Menu, PageHeader, KpiCard, CustomerForm, DireccionModal],
})
export class CustomersSuppliers {
  readonly tab = signal<TipoPersona>('CLIENTE');
  readonly tabOptions = [
    { label: 'Clientes',    value: 'CLIENTE',   icon: 'pi pi-user'  },
    { label: 'Proveedores', value: 'PROVEEDOR', icon: 'pi pi-truck' },
  ];

  readonly status = signal<StatusFilter>('todos');
  readonly statusOptions = [
    { label: 'Todos',     value: 'todos'     },
    { label: 'Activos',   value: 'activos'   },
    { label: 'Inactivos', value: 'inactivos' },
  ];

  readonly personas          = signal<Persona[]>(PERSONAS_MOCK);
  readonly editing           = signal<Persona | 'new' | null>(null);
  readonly editingDireccion  = signal<Persona | null>(null);
  readonly searchTerm        = signal('');

  readonly clientes    = computed(() => this.personas().filter(p => p.tipo === 'CLIENTE'));
  readonly proveedores = computed(() => this.personas().filter(p => p.tipo === 'PROVEEDOR'));

  readonly stats = computed(() => {
    const base = this.tab() === 'CLIENTE' ? this.clientes() : this.proveedores();
    return {
      total:     base.length,
      activos:   base.filter(p => p.estado === 'ACTIVO').length,
      inactivos: base.filter(p => p.estado === 'INACTIVO').length,
    };
  });

  readonly tableData = computed(() => {
    const q = this.searchTerm().toLowerCase().trim();
    const s = this.status();
    const base = this.tab() === 'CLIENTE' ? this.clientes() : this.proveedores();
    return base
      .filter(p => !q ||
        this.nombreCompleto(p).toLowerCase().includes(q) ||
        p.numero_documento.includes(q) ||
        p.email.toLowerCase().includes(q)
      )
      .filter(p =>
        s === 'todos' ||
        (s === 'activos'   && p.estado === 'ACTIVO') ||
        (s === 'inactivos' && p.estado === 'INACTIVO')
      );
  });

  readonly headerSubtitle = computed(() => {
    const s = this.stats();
    const tipo = this.tab() === 'CLIENTE' ? 'clientes' : 'proveedores';
    return `${s.total} ${tipo} registrados`;
  });

  nombreCompleto(p: any): string {
    if (p?.tipo_documento === 'RUC') return p.nombre ?? '';
    return [p?.nombre, p?.apellido_paterno, p?.apellido_materno].filter(Boolean).join(' ');
  }

  initials(p: any): string {
    return this.nombreCompleto(p).substring(0, 2).toUpperCase();
  }

  avatarClass(p: any): string {
    const gradient = p?.tipo === 'CLIENTE'
      ? 'from-sky-400 to-blue-500'
      : 'from-emerald-400 to-teal-500';
    return `w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`;
  }

  getMenuItems(p: Persona): MenuItem[] {
    return [
      { label: 'Dirección', icon: 'pi pi-map-marker', command: () => this.editDireccion(p) },
      { label: 'Editar',    icon: 'pi pi-pencil',     command: () => this.edit(p) },
      { separator: true },
      {
        label:   p.estado === 'ACTIVO' ? 'Inactivar' : 'Activar',
        icon:    p.estado === 'ACTIVO' ? 'pi pi-ban' : 'pi pi-check-circle',
        command: () => this.toggleEstado(p),
      },
    ];
  }

  onSaved(persona: Persona) {
    const list = this.personas();
    if (list.some(p => p.id === persona.id)) {
      this.personas.set(list.map(p => p.id === persona.id ? persona : p));
    } else {
      this.personas.set([...list, persona]);
    }
    this.editing.set(null);
  }

  toggleEstado(persona: Persona) {
    this.personas.set(
      this.personas().map(p =>
        p.id === persona.id
          ? { ...p, estado: p.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
          : p
      )
    );
  }

  exportar() {
    const data = this.tableData();
    const tipo = this.tab() === 'CLIENTE' ? 'clientes' : 'proveedores';

    const headers = [
      'Tipo', 'Tipo Doc.', 'Nro. Documento', 'Nombre / Razón Social',
      'Apellido Paterno', 'Apellido Materno',
      'Teléfono', 'Email', 'Dirección',
      'Departamento', 'Provincia', 'Distrito', 'Estado',
    ];

    const rows = data.map(p => [
      p.tipo, p.tipo_documento, p.numero_documento,
      p.nombre, p.apellido_paterno ?? '', p.apellido_materno ?? '',
      p.telefono, p.email, p.direccion,
      p.departamento, p.provincia, p.distrito, p.estado,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${tipo}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  editDireccion(p: Persona)          { this.editingDireccion.set(p); }
  closeDireccion(updated: Persona)   {
    this.personas.set(this.personas().map(p => p.id === updated.id ? updated : p));
    this.editingDireccion.set(null);
  }

  switchTab(tab: TipoPersona) {
    this.tab.set(tab);
    this.searchTerm.set('');
    this.status.set('todos');
  }

  edit(persona: Persona) { this.editing.set(persona); }
  addNew()               { this.editing.set('new'); }
  close()                { this.editing.set(null); }
}
