import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Users } from '../../core/services/users';
import { Auth } from '../../core/services/auth';
import { Toaster } from '../../core/services/toast';
import { UserDetail, UserListItem } from './users.model';
import { TableColumn, DataTable } from '../../shared/data-table/data-table';
import { TablePagination } from '../../shared/table-pagination/table-pagination';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataTable, TablePagination, PageHeader, KpiCard, Button],
})
export class UserRegistration {
  private readonly users = inject(Users);
  private readonly auth = inject(Auth);
  private readonly toaster = inject(Toaster);

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

  // El form de alta/edición se integra en la Tarea 4.
  readonly editing = signal<UserDetail | 'new' | null>(null);

  // Templates de celda — se inyectan en las columnas vía computed.
  private readonly userTpl = viewChild<TemplateRef<unknown>>('userTpl');
  private readonly rolesTpl = viewChild<TemplateRef<unknown>>('rolesTpl');
  private readonly estadoTpl = viewChild<TemplateRef<unknown>>('estadoTpl');

  readonly columns = computed<TableColumn[]>(() => [
    { key: 'nombre', label: 'Usuario', cellTemplate: this.userTpl() },
    { key: 'roles', label: 'Roles', cellTemplate: this.rolesTpl() },
    { key: 'estado', label: 'Estado', class: 'w-32', cellTemplate: this.estadoTpl() },
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
    this.users.get(row.id).subscribe((detail) => this.editing.set(detail));
  }
}
