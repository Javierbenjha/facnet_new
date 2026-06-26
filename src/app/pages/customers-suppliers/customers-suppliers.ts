import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { forkJoin, switchMap } from 'rxjs';
import { Button } from 'primeng/button';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { CustomerForm } from './customer-form/customer-form';
import { DireccionModal } from './direccion-modal/direccion-modal';
import { CustomersSupplierTable } from './customers-suppliers-table/customers-suppliers-table';
import { Persona, TipoPersona, mapClientToPersona } from './customers-suppliers.models';
import { ClientsService } from '../../core/services/clients';
import { Toaster } from '../../core/services/toast';
import { ClientStats } from '../../core/models/client.model';

@Component({
  selector: 'app-customers-suppliers',
  templateUrl: './customers-suppliers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, PageHeader, KpiCard, CustomerForm, DireccionModal, CustomersSupplierTable],
})
export class CustomersSuppliers {
  private readonly clientsSvc = inject(ClientsService);
  private readonly toast      = inject(Toaster);

  readonly tab              = signal<TipoPersona>('CLIENTE');
  readonly loading          = signal(false);
  readonly personas         = signal<Persona[]>([]);
  readonly stats            = signal<ClientStats>({ total: 0, active: 0, inactive: 0, newToday: 0 });
  readonly editing          = signal<Persona | 'new' | null>(null);
  readonly editingDireccion = signal<{ doc: string; name: string } | null>(null);

  readonly headerSubtitle = computed(() => {
    const s    = this.stats();
    const tipo = this.tab() === 'CLIENTE' ? 'clientes' : 'proveedores';
    return `${s.total} ${tipo} registrados`;
  });

  constructor() {
    toObservable(this.tab).pipe(
      switchMap(tab => {
        this.loading.set(true);
        const tipo_persona = tab === 'CLIENTE' ? 1 : 2;
        return forkJoin([
          this.clientsSvc.findAll({ tipo_persona, limit: 200 }),
          this.clientsSvc.getStats({ tipo_persona }),
        ]);
      }),
      takeUntilDestroyed(),
    ).subscribe({
      next: ([list, stats]) => {
        this.personas.set(list.data.map(mapClientToPersona));
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private reload() {
    const tipo_persona = this.tab() === 'CLIENTE' ? 1 : 2;
    this.loading.set(true);
    forkJoin([
      this.clientsSvc.findAll({ tipo_persona, limit: 200 }),
      this.clientsSvc.getStats({ tipo_persona }),
    ]).subscribe({
      next: ([list, stats]) => {
        this.personas.set(list.data.map(mapClientToPersona));
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSaved() {
    this.reload();
    this.editing.set(null);
  }

  onToggleEstado(persona: Persona) {
    const nuevoEstado = persona.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    this.clientsSvc.remove(persona.numero_documento).subscribe({
      next: () => {
        this.personas.update(list =>
          list.map(p => p.id === persona.id ? { ...p, estado: nuevoEstado } : p)
        );
        const tipo_persona = this.tab() === 'CLIENTE' ? 1 : 2;
        this.clientsSvc.getStats({ tipo_persona }).subscribe(s => this.stats.set(s));
        this.toast.success(
          nuevoEstado === 'ACTIVO' ? 'Activado' : 'Desactivado',
          `${persona.nombre} fue ${nuevoEstado === 'ACTIVO' ? 'activado' : 'desactivado'} correctamente.`,
        );
      },
      error: () => this.toast.error('Error', 'No se pudo cambiar el estado.'),
    });
  }

  onEditDireccion(p: Persona) {
    this.editingDireccion.set({ doc: p.numero_documento, name: p.nombre });
  }

  onDireccionSaved() { this.reload(); }

  edit(persona: Persona) { this.editing.set(persona); }
  addNew()               { this.editing.set('new'); }
  close()                { this.editing.set(null); }
}
