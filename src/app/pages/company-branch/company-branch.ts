import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { SelectButton } from 'primeng/selectbutton';
import { PageHeader } from '../../shared/page-header/page-header';
import { CompanyForm } from './company-form/company-form';
import { BranchForm } from './branch-form/branch-form';
import { Company } from '../../core/services/company';
import { Cia, CompanyRequest } from '../../core/models/company.model';
import { Branch } from '../../core/services/branch';
import { Sucursal, SucursalRequest } from '../../core/models/branch.model';
import { Toaster } from '../../core/services/toast';

@Component({
  selector: 'app-company-branch',
  templateUrl: './company-branch.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, Tag, SelectButton, PageHeader, CompanyForm, BranchForm],
})
export class CompanyBranch {
  private readonly company = inject(Company);
  private readonly branch = inject(Branch);
  private readonly toast = inject(Toaster);
  readonly cias = signal<Cia[]>([]);
  readonly branches = signal<Sucursal[]>([]);

  constructor() {
    this.loadCompanies();
    this.loadBranches();
  }

  private loadCompanies() {
    this.company.getCompanies().subscribe((list) => this.cias.set(list));
  }

  private loadBranches() {
    this.branch.getAllBranches().subscribe((list) => this.branches.set(list));
  }

  readonly tab = signal<'empresa' | 'sucursal'>('empresa');

  readonly tabOptions = [
    { label: 'Empresa', value: 'empresa', icon: 'pi pi-building' },
    { label: 'Sucursales', value: 'sucursal', icon: 'pi pi-shop' },
  ];
  readonly editingEmpresa = signal<Cia | 'new' | null>(null);
  readonly editingSucursal = signal<Sucursal | 'new' | null>(null);

  openNewEmpresa() {
    this.editingEmpresa.set('new');
  }
  openEditEmpresa(e: Cia) {
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

  onEmpresaSaved(payload: CompanyRequest) {
    const editing = this.editingEmpresa();
    const request$ =
      editing && editing !== 'new'
        ? this.company.update(payload, editing.id)
        : this.company.create(payload);

    request$.subscribe({
      next: () => {
        this.loadCompanies();
        this.editingEmpresa.set(null);
      },
      error: (err) => {
        this.toast.error('Error al guardar empresa', err.error?.message);
      },
    });
  }

  onSucursalSaved({ ciaId, payload }: { ciaId: string; payload: SucursalRequest }) {
    if (!ciaId) {
      this.toast.error('Empresa requerida', 'Seleccioná una empresa para la sucursal.');
      return;
    }
    this.branch.createByCiaID(payload, ciaId).subscribe({
      next: () => {
        this.loadBranches();
        this.editingSucursal.set(null);
      },
      error: (err) => {
        this.toast.error('Error al guardar sucursal', err.error?.message);
      },
    });
  }

  estadoSev(estado: string): 'success' | 'danger' {
    return estado === 'ACTIVO' ? 'success' : 'danger';
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
