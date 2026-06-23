import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { AppModal } from '../../../shared/app-modal/app-modal';
import {
  MONEDAS, Moneda, MOTIVOS_MOCK, MotivoCajaChica,
  TIPOS_DOC_CAJA_CHICA, TipoMovimiento,
} from '../petty-cash.models';

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
  readonly editing = input<'new' | null>(null);
  readonly closed  = output<void>();
  readonly saved   = output<{ tipo: TipoMovimiento; importe: number; moneda: string }>();

  // ── Opciones ───────────────────────────────────────────────────────────────
  readonly monedas = MONEDAS;
  readonly opcionesTipo = [
    { label: 'Egreso',  value: 'EGRESO'  },
    { label: 'Ingreso', value: 'INGRESO' },
  ];

  // ── Form state ─────────────────────────────────────────────────────────────
  readonly tipo       = signal<TipoMovimiento>('EGRESO');
  readonly motivo     = signal<MotivoCajaChica | null>(null);
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

  // tipoDoc derivado del toggle — usado para la serie y el payload
  readonly tipoDoc = computed(() =>
    TIPOS_DOC_CAJA_CHICA.find(t => t.tipo === this.tipo()) ?? TIPOS_DOC_CAJA_CHICA[0]
  );

  readonly serie = computed(() => this.tipoDoc().serie);

  // Motivos filtrados según el tipo seleccionado
  readonly motivosFiltrados = computed(() =>
    MOTIVOS_MOCK.filter(m => m.tipo === this.tipo())
  );

  readonly esValido = computed(() =>
    this.motivo() !== null &&
    this.entregadoA().trim().length > 0 &&
    this.importe() > 0
  );

  constructor() {
    effect(() => {
      if (this.editing() === 'new') this.resetForm();
    });
  }

  // ── Methods ────────────────────────────────────────────────────────────────
  setTipo(t: TipoMovimiento) {
    this.tipo.set(t);
    this.motivo.set(null); // limpiar motivo al cambiar tipo
  }

  agregarMotivo() {
    // placeholder — abre modal para crear motivo en producción
  }

  registrar() {
    if (!this.esValido()) return;
    this.saved.emit({ tipo: this.tipo(), importe: this.importe(), moneda: this.moneda().sigla });
    this.closed.emit();
  }

  close() { this.closed.emit(); }

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
