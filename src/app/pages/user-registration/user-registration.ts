import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Users } from '../../core/services/users';
import { Auth } from '../../core/services/auth';
import { Toaster } from '../../core/services/toast';
import { UserDetail, UserListItem } from './users.model';
import { TableColumn, DataTable } from '../../shared/data-table/data-table';
import { TablePagination } from '../../shared/table-pagination/table-pagination';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { Button } from 'primeng/button';
import { UserForm } from './user-form/user-form';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataTable, TablePagination, PageHeader, KpiCard, Button, Menu, UserForm],
})
export class UserRegistration {
  private readonly users = inject(Users);
  private readonly auth = inject(Auth);
  private readonly toaster = inject(Toaster);
  private readonly confirm = inject(ConfirmationService);

  // Solo el dueño (role=1) puede crear sub-usuarios y reasignar roles.
  readonly isOwner = computed(() => this.auth.currentUser()?.role === 1);

  readonly list = signal<UserListItem[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = signal(10);
  readonly loading = signal(false);
  readonly stats = signal<{ total: number; activos: number; inactivos: number }>({
    total: 0,
    activos: 0,
    inactivos: 0,
  });

  readonly editing = signal<UserDetail | 'new' | null>(null);
  readonly rowMenuItems = signal<MenuItem[]>([]);

  // Templates de celda — se inyectan en las columnas vía computed.
  private readonly userTpl = viewChild<TemplateRef<unknown>>('userTpl');
  private readonly rolesTpl = viewChild<TemplateRef<unknown>>('rolesTpl');
  private readonly estadoTpl = viewChild<TemplateRef<unknown>>('estadoTpl');
  private readonly actionsTpl = viewChild<TemplateRef<unknown>>('actions');

  readonly columns = computed<TableColumn[]>(() => [
    { key: 'nombre', label: 'Usuario', cellTemplate: this.userTpl() },
    { key: 'roles', label: 'Roles', cellTemplate: this.rolesTpl() },
    { key: 'estado', label: 'Estado', class: 'w-32', cellTemplate: this.estadoTpl() },
    { key: '_actions', label: '', class: 'w-16 text-right', cellTemplate: this.actionsTpl() },
  ]);

  constructor() {
    this.load();
    this.loadStats();
  }

  load(): void {
    this.loading.set(true);
    this.users.list({ page: this.page(), limit: this.limit() }).subscribe({
      next: (res) => {
        this.list.set(res.data);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadStats(): void {
    this.users.getStats().subscribe((s) => this.stats.set(s));
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  onPageSizeChange(size: number): void {
    this.limit.set(size);
    this.page.set(1);
    this.load();
  }

  exportExcel(): void {
    const ciaId = this.auth.activeCompany()?.id;
    if (!ciaId) return;
    this.users.exportExcel(ciaId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toaster.error('Error', 'No se pudo exportar el listado'),
    });
  }

  nuevo(): void {
    this.editing.set('new');
  }

  edit(row: UserListItem): void {
    this.users.get(row.id).subscribe({
      next: (detail) => this.editing.set(detail),
      error: (err) =>
        this.toaster.error('Error', err.error?.message ?? 'No se pudo cargar el usuario'),
    });
  }

  openRowMenu(event: Event, row: UserListItem, menu: Menu): void {
    const activo = row.estado === 1;
    const items: MenuItem[] = [
      { label: 'Editar', icon: 'pi pi-pencil', command: () => this.edit(row) },
    ];
    if (this.isOwner()) {
      items.push({
        label: activo ? 'Desactivar' : 'Activar',
        icon: activo ? 'pi pi-ban' : 'pi pi-check-circle',
        command: () => this.toggleActive(row),
      });
    }
    this.rowMenuItems.set(items);
    menu.toggle(event);
  }

  onSaved(): void {
    this.editing.set(null);
    this.load();
    this.loadStats();
  }

  toggleActive(row: UserListItem): void {
    const desactivar = row.estado === 1;
    this.confirm.confirm({
      header: desactivar ? 'Desactivar usuario' : 'Activar usuario',
      message: desactivar
        ? `¿Desactivar a "${row.nombre}"? Se cerrarán sus sesiones y perderá el acceso.`
        : `¿Activar a "${row.nombre}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => {
        this.users.toggleActive(row.id).subscribe({
          next: (res) => {
            this.load();
            this.loadStats();
            this.toaster.success('Listo', res.message);
            // Al reactivar, el backend deja al usuario sin asignaciones: hay que reasignar.
            if (!desactivar) {
              this.toaster.info(
                'Reasigná sus accesos',
                'El usuario quedó sin sucursal ni rol. Editalo para reasignarle accesos antes de que pueda operar.',
              );
            }
          },
          error: (err) =>
            this.toaster.error('Error', err.error?.message ?? 'No se pudo cambiar el estado'),
        });
      },
    });
  }
}
