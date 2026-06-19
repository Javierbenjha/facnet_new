import { Component, computed, debounced, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { DataTable, TableColumn } from '../../../shared/data-table/data-table';
import { Persona, TipoPersona } from '../customers-suppliers.models';

type StatusFilter = 'todos' | 'activos' | 'inactivos';

@Component({
  selector: 'app-customers-suppliers-table',
  templateUrl: './customers-suppliers-table.html',
  imports: [FormsModule, Button, SelectButton, Tag, InputText, IconField, InputIcon, Menu, DataTable],
})
export class CustomersSupplierTable {
  personas = input<Persona[]>([]);
  tab      = input<TipoPersona>('CLIENTE');

  tabChange     = output<TipoPersona>();
  editPersona   = output<Persona>();
  editDireccion = output<Persona>();
  toggleEstado  = output<Persona>();

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

  readonly searchTerm      = signal('');
  readonly debouncedSearch = debounced(this.searchTerm, 300);

  private readonly nombreCellTpl    = viewChild.required<TemplateRef<unknown>>('nombreCellTpl');
  private readonly docCellTpl       = viewChild.required<TemplateRef<unknown>>('docCellTpl');
  private readonly telefonoCellTpl  = viewChild.required<TemplateRef<unknown>>('telefonoCellTpl');
  private readonly emailCellTpl     = viewChild.required<TemplateRef<unknown>>('emailCellTpl');
  private readonly ubicacionCellTpl = viewChild.required<TemplateRef<unknown>>('ubicacionCellTpl');
  private readonly estadoCellTpl    = viewChild.required<TemplateRef<unknown>>('estadoCellTpl');
  private readonly actionCellTpl    = viewChild.required<TemplateRef<unknown>>('actionCellTpl');

  readonly tableColumns = computed<TableColumn[]>(() => [
    { key: 'nombre',           label: 'Nombre / Razón Social', cellTemplate: this.nombreCellTpl()    },
    { key: 'numero_documento', label: 'Documento',             cellTemplate: this.docCellTpl()       },
    { key: 'telefono',         label: 'Teléfono',              cellTemplate: this.telefonoCellTpl()  },
    { key: 'email',            label: 'Email',                 cellTemplate: this.emailCellTpl()     },
    { key: 'ubicacion',        label: 'Ubicación',             cellTemplate: this.ubicacionCellTpl() },
    { key: 'estado',           label: 'Estado',                cellTemplate: this.estadoCellTpl()    },
    { key: '_actions',         label: '',         class: 'w-16', cellTemplate: this.actionCellTpl()  },
  ]);

  readonly tableData = computed(() => {
    const q = (this.debouncedSearch.value() ?? '').toLowerCase().trim();
    const s = this.status();
    return this.personas()
      .filter(p => p.tipo === this.tab())
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

  nombreCompleto(p: Persona): string {
    if (p.tipo_documento === 'RUC') return p.nombre ?? '';
    return [p.nombre, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(' ');
  }

  initials(p: Persona): string {
    return this.nombreCompleto(p).substring(0, 2).toUpperCase();
  }

  avatarClass(p: Persona): string {
    const gradient = p.tipo === 'CLIENTE'
      ? 'from-sky-400 to-blue-500'
      : 'from-emerald-400 to-teal-500';
    return `w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`;
  }

  getMenuItems(p: Persona): MenuItem[] {
    return [
      { label: 'Dirección', icon: 'pi pi-map-marker', command: () => this.editDireccion.emit(p) },
      { label: 'Editar',    icon: 'pi pi-pencil',     command: () => this.editPersona.emit(p)   },
      { separator: true },
      {
        label:   p.estado === 'ACTIVO' ? 'Inactivar' : 'Activar',
        icon:    p.estado === 'ACTIVO' ? 'pi pi-ban' : 'pi pi-check-circle',
        command: () => this.toggleEstado.emit(p),
      },
    ];
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

  onTabChange(t: TipoPersona) {
    this.searchTerm.set('');
    this.status.set('todos');
    this.tabChange.emit(t);
  }
}
