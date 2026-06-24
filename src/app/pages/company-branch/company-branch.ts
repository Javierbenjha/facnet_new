import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { SelectButton } from 'primeng/selectbutton';
import { PageHeader } from '../../shared/page-header/page-header';
import { CompanyForm } from './company-form/company-form';
import { BranchForm } from './branch-form/branch-form';
import { Empresa, Sucursal, EMPRESAS_MOCK, SUCURSALES_MOCK } from './company-branch.models';
import { Company } from '../../core/services/company';
import { Cia } from '../../core/models/company.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Branch } from '../../core/services/branch';

@Component({
  selector: 'app-company-branch',
  templateUrl: './company-branch.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, Tag, SelectButton, PageHeader, CompanyForm, BranchForm],
})
export class CompanyBranch {
  private readonly company = inject(Company);
  private readonly branch = inject(Branch);

  readonly cias = toSignal(this.company.getCompanies(), { initialValue: [] });
  readonly branches = toSignal(this.branch.getAllBranches(), { initialValue: [] });
  
  readonly tab = signal<'empresa' | 'sucursal'>('empresa');

  readonly tabOptions = [
    { label: 'Empresa', value: 'empresa', icon: 'pi pi-building' },
    { label: 'Sucursales', value: 'sucursal', icon: 'pi pi-shop' },
  ];
  readonly empresas = signal<Empresa[]>([...EMPRESAS_MOCK]);
  readonly sucursales = signal<Sucursal[]>([...SUCURSALES_MOCK]);

  readonly editingEmpresa = signal<Empresa | 'new' | null>(null);
  readonly editingSucursal = signal<Sucursal | 'new' | null>(null);

  openNewEmpresa() {
    this.editingEmpresa.set('new');
  }
  openEditEmpresa(e: Empresa) {
    this.editingEmpresa.set(e);
  }
  closeEmpresaForm() {
    this.editingEmpresa.set(null);
  }

  openNewSucursal() {
    this.editingSucursal.set('new');
  }
  openEditSucursal(s: Sucursal) {
    this.editingSucursal.set(s);
  }
  closeSucursalForm() {
    this.editingSucursal.set(null);
  }

  onEmpresaSaved(e: Empresa) {
    this.empresas.update((list) => {
      const exists = list.some((x) => x.id === e.id);
      return exists ? list.map((x) => (x.id === e.id ? e : x)) : [...list, e];
    });
  }

  onSucursalSaved(s: Sucursal) {
    this.sucursales.update((list) => {
      const exists = list.some((x) => x.id === s.id);
      return exists ? list.map((x) => (x.id === s.id ? s : x)) : [...list, s];
    });
  }

  toggleEmpresaEstado(e: Empresa) {
    const updated: Empresa = { ...e, estado: e.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' };
    this.empresas.update((list) => list.map((x) => (x.id === e.id ? updated : x)));
  }

  toggleSucursalEstado(s: Sucursal) {
    const updated: Sucursal = { ...s, estado: s.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' };
    this.sucursales.update((list) => list.map((x) => (x.id === s.id ? updated : x)));
  }

  estadoSev(estado: string): 'success' | 'danger' {
    return estado === 'ACTIVO' ? 'success' : 'danger';
  }

  fmtMeta(n: number) {
    return 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 0 });
  }

  initials(name: string) {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }
}
