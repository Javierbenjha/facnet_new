import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Rbac } from '../../core/services/rbac';
import { RoleListItem } from './roles.model';
import { TableColumn, DataTable } from '../../shared/data-table/data-table';
import { Button } from 'primeng/button';
import { KpiCard } from "../../shared/kpi-card/kpi-card";
import { PageHeader } from "../../shared/page-header/page-header";

@Component({
  selector: 'app-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roles.html',
  imports: [DataTable, Button, KpiCard, PageHeader],
})
export class Roles {
  private readonly rbac = inject(Rbac);
  readonly roles = signal<RoleListItem[]>([]);
  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Rol' },
    { key: 'permissionsCount', label: 'Permisos' },
  ];

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

  update(role: RoleListItem) {
    console.log(role);
  }

  remove(role: RoleListItem) {
    console.log(role);
  }
}
