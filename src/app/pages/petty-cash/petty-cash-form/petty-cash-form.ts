import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { PettyCashService } from '../../../core/services/petty-cash';
import { Toaster } from '../../../core/services/toast';
import { MONEDAS, Moneda, Receipt, Reason, ReceiptType, TIPO_A_RECIBO, TipoMovimiento } from '../../../core/models/petty-cash.model';

@Component({
  selector: 'app-petty-cash-form',
  templateUrl: './petty-cash-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    AppModal, Button,
    InputText, InputNumber, Textarea,
    Select, SelectButton, DatePickerModule,
  ],
})
export class PettyCashForm {
  private readonly svc     = inject(PettyCashService);
  private readonly toaster = inject(Toaster);

  readonly editing = input<'new' | null>(null);
  readonly closed  = output<void>();
  readonly saved   = output<Receipt>();
  readonly guardandoRecibo = signal(false);

  // ── Opciones ───────────────────────────────────────────────────────────────
  readonly monedas = MONEDAS;
  readonly opcionesTipo = [
    { label: 'Egreso',  value: 'EGRESO'  },
    { label: 'Ingreso', value: 'INGRESO' },
  ];

  // ── Datos del backend ──────────────────────────────────────────────────────
  readonly receiptTypes    = signal<ReceiptType[]>([]);
  readonly reasons         = signal<Reason[]>([]);
  readonly filterMotivo    = signal('');
  readonly guardandoMotivo = signal(false);
  readonly labelAgregar    = computed(() =>
    this.filterMotivo().trim() ? `Agregar "${this.filterMotivo().trim()}"` : 'Agregar motivo'
  );

  // ── Form state ─────────────────────────────────────────────────────────────
  readonly tipo       = signal<TipoMovimiento>('EGRESO');
  readonly motivo     = signal<Reason | null>(null);
  readonly fecha      = signal<Date>(new Date());
  readonly entregadoA = signal('');
  readonly moneda     = signal<Moneda>(MONEDAS[0]);
  readonly importe    = signal(0);
  readonly detalle    = signal('');

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly visible = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() =>
    this.tipo() === 'INGRESO' ? 'Nuevo Ingreso' : 'Nuevo Egreso'
  );

  readonly tipoDoc = computed(() =>
    this.receiptTypes().find(rt => rt.id === TIPO_A_RECIBO[this.tipo()])
  );

  readonly serie = computed(() => this.tipoDoc()?.sigla ?? '...');

  readonly motivosFiltrados = computed(() => {
    const tipoRecibo = TIPO_A_RECIBO[this.tipo()];
    return this.reasons().filter(r => r.tipo_recibo === tipoRecibo && r.estado === 1);
  });

  readonly esValido = computed(() =>
    this.motivo() !== null &&
    this.entregadoA().trim().length > 0 &&
    this.importe() > 0
  );

  constructor() {
    this.loadData();

    effect(() => {
      if (this.editing() === 'new') this.resetForm();
    });
  }

  // ── Methods ────────────────────────────────────────────────────────────────
  setTipo(t: TipoMovimiento) {
    this.tipo.set(t);
    this.motivo.set(null);
  }

  onFilterMotivo(event: { filter: string }) {
    this.filterMotivo.set(event.filter ?? '');
  }

  agregarMotivo() {
    const descripcion = this.filterMotivo().trim();
    if (!descripcion) return;

    this.guardandoMotivo.set(true);
    this.svc.createReason({ descripcion, tipo_recibo: TIPO_A_RECIBO[this.tipo()] }).subscribe({
      next: reason => {
        this.reasons.update(list => [reason, ...list]);
        this.motivo.set(reason);
        this.filterMotivo.set('');
        this.guardandoMotivo.set(false);
        this.toaster.success('Motivo creado', `"${reason.descripcion}" agregado correctamente`);
      },
      error: () => {
        this.toaster.error('Error', 'No se pudo crear el motivo. Verificá que no exista uno igual.');
        this.guardandoMotivo.set(false);
      },
    });
  }

  registrar() {
    if (!this.esValido()) return;

    const fecha = this.fecha();
    const payload = {
      tip_doc:       TIPO_A_RECIBO[this.tipo()],
      fecha:         `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`,
      entregado:     this.entregadoA(),
      codigo_motivo: Number(this.motivo()!.id),
      tipo_moneda:   this.moneda().id_moneda,
      importe:       this.importe(),
      observacion:   this.detalle(),
    };

    this.guardandoRecibo.set(true);
    this.svc.createReceipt(payload).subscribe({
      next: receipt => {
        this.toaster.success('Recibo registrado', `N° ${receipt.numero} creado correctamente`);
        this.saved.emit(receipt);
        this.closed.emit();
        this.guardandoRecibo.set(false);
      },
      error: () => {
        this.toaster.error('Error', 'No se pudo registrar el recibo. Verificá los datos.');
        this.guardandoRecibo.set(false);
      },
    });
  }

  close() { this.closed.emit(); }

  private loadData() {
    this.svc.getReceiptTypes().subscribe({
      next:  types => this.receiptTypes.set(types),
      error: ()    => this.toaster.error('Error', 'No se pudieron cargar los tipos de recibo'),
    });

    this.svc.getReasons().subscribe({
      next:  reasons => this.reasons.set(reasons),
      error: ()       => this.toaster.error('Error', 'No se pudieron cargar los motivos'),
    });
  }

  private resetForm() {
    this.tipo.set('EGRESO');
    this.motivo.set(null);
    this.fecha.set(new Date());
    this.entregadoA.set('');
    this.moneda.set(MONEDAS[0]);
    this.importe.set(0);
    this.detalle.set('');
  }
}
