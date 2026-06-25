import {
  ChangeDetectionStrategy, Component, computed, effect, input, output, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { AppModal } from '../../../shared/app-modal/app-modal';
import {
  GuiaRemision, ModalidadTransporte, MOTIVOS_GUIA, TIPOS_DOC_REF,
} from '../referral-guide.models';
import { VentaHistorial, VENTAS_MOCK } from '../../sale-list/sale-list.models';
import { Persona } from '../../customers-suppliers/customers-suppliers.models';

interface DetalleRow {
  _id: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  peso: number;
}

let _nextId = 1;

@Component({
  selector: 'app-referral-guide-form',
  templateUrl: './referral-guide-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    AppModal, Button, InputText, InputNumber, Select, SelectButton, DatePickerModule,
  ],
})
export class ReferralGuideForm {
  readonly editing = input<'new' | null>(null);
  readonly closed  = output<void>();
  readonly saved   = output<Partial<GuiaRemision>>();

  // ── Opciones estáticas ─────────────────────────────────────────────────────
  readonly motivos           = MOTIVOS_GUIA;
  readonly tiposDocRef       = TIPOS_DOC_REF;
  readonly opcionesModalidad = [
    { label: 'Público / Externo', value: 'PUBLICO' },
    { label: 'Privado / Propio',  value: 'PRIVADO' },
  ];

  readonly ventaOpts = VENTAS_MOCK
    .filter(v => v.estado === 'ACTIVO' && (v.tip_doc === 1 || v.tip_doc === 2))
    .map(v => ({
      label: `${v.sigla_documento}${v.serie}-${v.correlativo} · ${v.cliente}`,
      value: v,
    }));

  readonly clienteOpts: { label: string; value: Persona }[] = [];

  // ── Form state ─────────────────────────────────────────────────────────────
  readonly modalidad          = signal<ModalidadTransporte>('PUBLICO');
  readonly motivo             = signal(MOTIVOS_GUIA[0]);
  readonly fecha              = signal<Date>(new Date());
  readonly fechaTraslado      = signal<Date>(new Date());
  readonly cliente            = signal('');
  readonly rucCliente         = signal('');
  readonly partidaDireccion   = signal('');
  readonly destinoDireccion   = signal('');
  readonly ordenCompra        = signal('');
  readonly empresaTransporte  = signal('');
  readonly rucTransporte      = signal('');
  readonly conductor          = signal('');
  readonly dniConductor       = signal('');
  readonly placa              = signal('');
  readonly pesoTotal          = signal(0);
  readonly docRefTipo         = signal(TIPOS_DOC_REF[0]);
  readonly docRefSerie        = signal('');
  readonly docRefCorrelativo  = signal('');
  readonly detalles           = signal<DetalleRow[]>([this._emptyRow()]);

  // ── Smart selection ────────────────────────────────────────────────────────
  readonly selectedVenta    = signal<VentaHistorial | null>(null);
  readonly selectedCliente  = signal<Persona | null>(null);

  readonly clienteAddresses = computed(() => [] as { descripcion: string; es_principal: boolean }[]);

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly visible        = computed(() => this.editing() !== null);
  readonly modalTitle     = computed(() =>
    this.editing() === 'new' ? 'Nueva Guía de Remisión' : 'Editar Guía de Remisión'
  );
  readonly requiereDocRef = computed(() => this.motivo() === 'VENTA');

  readonly pesoCalculado = computed(() =>
    this.detalles().reduce((sum, d) => sum + d.cantidad * d.peso, 0)
  );

  readonly esValido = computed(() =>
    this.cliente().trim().length > 0 &&
    this.destinoDireccion().trim().length > 0 &&
    this.detalles().some(d => d.descripcion.trim().length > 0)
  );

  constructor() {
    effect(() => {
      if (this.editing() === 'new') this.resetForm();
    });
  }

  // ── Smart selection methods ────────────────────────────────────────────────
  selectVenta(v: VentaHistorial | null) {
    this.selectedVenta.set(v);
    if (!v) return;

    this.docRefTipo.set(v.tip_doc === 1 ? 'FACTURA' : 'BOLETA');
    this.docRefSerie.set(v.serie);
    this.docRefCorrelativo.set(v.correlativo);

    if (!this.selectedCliente()) {
      this.cliente.set(v.cliente);
      this.rucCliente.set(v.ruc_dni);
    }

    if (v.detalles?.length) {
      this.detalles.set(v.detalles.map(d => ({
        _id:         _nextId++,
        codigo:      '',
        descripcion: d.producto_nombre,
        cantidad:    d.cantidad,
        peso:        0,
      })));
    }
  }

  selectCliente(p: Persona | null) {
    this.selectedCliente.set(p);
    if (!p) return;

    this.cliente.set(
      [p.nombre, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(' ')
    );
    this.rucCliente.set(p.numero_documento);

    if (p.direccion) this.destinoDireccion.set(p.direccion);
  }

  // ── Methods ────────────────────────────────────────────────────────────────
  setModalidad(m: ModalidadTransporte) { this.modalidad.set(m); }

  addRow() {
    this.detalles.update(rows => [...rows, this._emptyRow()]);
  }

  removeRow(id: number) {
    this.detalles.update(rows => rows.filter(r => r._id !== id));
  }

  updateRow(id: number, field: keyof DetalleRow, value: string | number) {
    this.detalles.update(rows =>
      rows.map(r => r._id === id ? { ...r, [field]: value } : r)
    );
  }

  registrar() {
    if (!this.esValido()) return;
    this.saved.emit({
      motivo:              this.motivo(),
      cliente:             this.cliente(),
      ruc_cliente:         this.rucCliente(),
      partida_direccion:   this.partidaDireccion(),
      destino_direccion:   this.destinoDireccion(),
      modalidad:           this.modalidad(),
      empresa_transporte:  this.modalidad() === 'PUBLICO' ? this.empresaTransporte() : undefined,
      ruc_transporte:      this.modalidad() === 'PUBLICO' ? this.rucTransporte()     : undefined,
      conductor:           this.modalidad() === 'PRIVADO' ? this.conductor()         : undefined,
      dni_conductor:       this.modalidad() === 'PRIVADO' ? this.dniConductor()      : undefined,
      placa:               this.placa(),
      peso_total:          this.pesoTotal() || this.pesoCalculado(),
      numero_orden_compra: this.ordenCompra() || undefined,
      doc_ref_tipo:        this.requiereDocRef() ? this.docRefTipo()        : undefined,
      doc_ref_serie:       this.requiereDocRef() ? this.docRefSerie()       : undefined,
      doc_ref_correlativo: this.requiereDocRef() ? this.docRefCorrelativo() : undefined,
      detalles: this.detalles()
        .filter(d => d.descripcion.trim().length > 0)
        .map(d => ({
          id: String(d._id), codigo: d.codigo,
          descripcion: d.descripcion, cantidad: d.cantidad, peso: d.peso,
        })),
    });
    this.closed.emit();
  }

  close() { this.closed.emit(); }

  private _emptyRow(): DetalleRow {
    return { _id: _nextId++, codigo: '', descripcion: '', cantidad: 1, peso: 0 };
  }

  private resetForm() {
    this.modalidad.set('PUBLICO');
    this.motivo.set(MOTIVOS_GUIA[0]);
    this.fecha.set(new Date());
    this.fechaTraslado.set(new Date());
    this.cliente.set('');
    this.rucCliente.set('');
    this.partidaDireccion.set('');
    this.destinoDireccion.set('');
    this.ordenCompra.set('');
    this.empresaTransporte.set('');
    this.rucTransporte.set('');
    this.conductor.set('');
    this.dniConductor.set('');
    this.placa.set('');
    this.pesoTotal.set(0);
    this.docRefTipo.set(TIPOS_DOC_REF[0]);
    this.docRefSerie.set('');
    this.docRefCorrelativo.set('');
    this.detalles.set([this._emptyRow()]);
    this.selectedVenta.set(null);
    this.selectedCliente.set(null);
  }
}
