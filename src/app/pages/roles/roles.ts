import {
  Component,
  ChangeDetectionStrategy,
  TemplateRef,
  inject,
  signal,
  computed,
  viewChild,
} from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Rbac } from '../../core/services/rbac';
import { Toaster } from '../../core/services/toast';
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
  imports: [DataTable, Button, Menu, KpiCard, PageHeader, RoleForm],
})
export class Roles {
  private readonly rbac = inject(Rbac);
  private readonly confirm = inject(ConfirmationService);
  private readonly toaster = inject(Toaster);
  readonly roles = signal<RoleListItem[]>([]);
  readonly editing = signal<RoleDetail | 'new' | null>(null);
  readonly rowMenuItems = signal<MenuItem[]>([]);

  private readonly actionsTpl = viewChild<TemplateRef<unknown>>('actions');

  readonly columns = computed<TableColumn[]>(() => [
    { key: 'name', label: 'Rol' },
    { key: 'permissionsCount', label: 'Permisos' },
    { key: '_actions', label: '', class: 'w-16 text-right', cellTemplate: this.actionsTpl() },
  ]);

  readonly kpis = computed(() => {
    const rs = this.roles();
    return {
      total: rs.length,
      sistema: rs.filter((r) => r.isSystem).length,
      propios: rs.filter((r) => !r.isSystem).length,
    };
  });

  constructor() {
    this.reload();
  }

  private reload() {
    this.rbac.listRoles().subscribe((roles) => this.roles.set(roles));
  }

  nuevo() {
    this.editing.set('new');
  }

  openRowMenu(event: Event, row: RoleListItem, menu: Menu): void {
    this.rowMenuItems.set([
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        disabled: !row.editable,
        command: () => this.update(row),
      },
      {
        label: 'Desactivar',
        icon: 'pi pi-ban',
        disabled: !row.editable,
        command: () => this.remove(row),
      },
    ]);
    menu.toggle(event);
  }

  update(role: RoleListItem) {
    this.rbac.getRole(role.id).subscribe((detail) => this.editing.set(detail));
  }

  remove(role: RoleListItem) {
    this.confirm.confirm({
      header: 'Desactivar rol',
      message: `¿Desactivar el rol "${role.name}"? Dejará de estar disponible para asignar.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, desactivar',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.doRemove(role),
    });
  }

  private doRemove(role: RoleListItem) {
    this.rbac.remove(role.id).subscribe({
      next: (res) => {
        this.toaster.success('Listo', res.message);
        this.reload();
      },
      error: (e) =>
        this.toaster.error('Error', e.error?.message ?? 'No se pudo desactivar el rol.'),
    });
  }

  onSaved() {
    this.reload();
    this.editing.set(null);
  }
}
