import { Component, computed, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { CustomerForm } from './customer-form/customer-form';
import { DireccionModal } from './direccion-modal/direccion-modal';
import { CustomersSupplierTable } from './customers-suppliers-table/customers-suppliers-table';
import { Persona, TipoPersona, PERSONAS_MOCK } from './customers-suppliers.models';

@Component({
  selector: 'app-customers-suppliers',
  templateUrl: './customers-suppliers.html',
  imports: [Button, PageHeader, KpiCard, CustomerForm, DireccionModal, CustomersSupplierTable],
})
export class CustomersSuppliers {
  readonly tab              = signal<TipoPersona>('CLIENTE');
  readonly personas         = signal<Persona[]>(PERSONAS_MOCK);
  readonly editing          = signal<Persona | 'new' | null>(null);
  readonly editingDireccion = signal<Persona | null>(null);

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

  readonly headerSubtitle = computed(() => {
    const s = this.stats();
    const tipo = this.tab() === 'CLIENTE' ? 'clientes' : 'proveedores';
    return `${s.total} ${tipo} registrados`;
  });

  onSaved(persona: Persona) {
    const list = this.personas();
    if (list.some(p => p.id === persona.id)) {
      this.personas.set(list.map(p => p.id === persona.id ? persona : p));
    } else {
      this.personas.set([...list, persona]);
    }
    this.editing.set(null);
  }

  onToggleEstado(persona: Persona) {
    this.personas.set(
      this.personas().map(p =>
        p.id === persona.id
          ? { ...p, estado: p.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
          : p
      )
    );
  }

  onEditDireccion(p: Persona)        { this.editingDireccion.set(p); }
  onCloseDireccion(updated: Persona) {
    this.personas.set(this.personas().map(p => p.id === updated.id ? updated : p));
    this.editingDireccion.set(null);
  }

  edit(persona: Persona) { this.editing.set(persona); }
  addNew()               { this.editing.set('new'); }
  close()                { this.editing.set(null); }
}
