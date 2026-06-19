import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Rbac } from '../../core/services/rbac';
import { RoleDetail, RoleListItem } from './roles.model';
import { TableColumn, DataTable } from '../../shared/data-table/data-table';
import { Button } from 'primeng/button';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { PageHeader } from '../../shared/page-header/page-header';
import { RoleForm } from './role-form/role-form';

@Component({
  selector: 'app-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roles.html',
  imports: [DataTable, Button, KpiCard, PageHeader, RoleForm],
})
export class Roles {
  private readonly rbac = inject(Rbac);
  readonly roles = signal<RoleListItem[]>([]);
  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Rol' },
    { key: 'permissionsCount', label: 'Permisos' },
  ];
  readonly editing = signal<RoleDetail | 'new' | null>(null);

  readonly kpis = computed(() => {
    const rs = this.roles();
    return {
      total: rs.length,
      sistema: rs.filter((r) => r.isSystem).length,
      propios: rs.filter((r) => !r.isSystem).length,
    };
  });

  constructor() {
    this.rbac.listRoles().subscribe((roles) => this.roles.set(roles));
  }

  nuevo() {
    this.editing.set('new');
  }

  update(role: RoleListItem) {
    this.rbac.getRole(role.id).subscribe((detail) => this.editing.set(detail));
  }

  remove(role: RoleListItem) {
    console.log(role);
  }

  onSaved() {
    this.rbac.listRoles().subscribe((roles) => this.roles.set(roles));
    this.editing.set(null);
  }
}
