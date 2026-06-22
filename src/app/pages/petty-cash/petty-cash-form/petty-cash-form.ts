import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { CATEGORIAS_EGRESO, CATEGORIAS_INGRESO, TipoMovimiento } from '../petty-cash.models';

@Component({
  selector: 'app-petty-cash-form',
  templateUrl: './petty-cash-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    AppModal, Button,
    InputText, InputNumber, Textarea,
    Select, DatePickerModule,
  ],
})
export class PettyCashForm {
  readonly editing = input<'new' | null>(null);
  readonly closed  = output<void>();
  readonly saved   = output<{ tipo: TipoMovimiento; concepto: string; monto: number }>();

  // ── Form state ─────────────────────────────────────────────────────────────
  readonly tipo          = signal<TipoMovimiento>('EGRESO');
  readonly fecha         = signal<Date>(new Date());
  readonly concepto      = signal('');
  readonly categoria     = signal('');
  readonly monto         = signal(0);
  readonly responsable   = signal('');
  readonly comprobante   = signal('');
  readonly observaciones = signal('');

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly visible = computed(() => this.editing() !== null);

  readonly categorias = computed(() =>
    this.tipo() === 'INGRESO' ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO
  );

  readonly esValido = computed(() =>
    this.concepto().trim().length > 0 &&
    this.categoria().length > 0 &&
    this.monto() > 0
  );

  constructor() {
    effect(() => {
      if (this.editing() === 'new') this.resetForm();
    });
  }

  // ── Methods ────────────────────────────────────────────────────────────────
  setTipo(t: TipoMovimiento) {
    this.tipo.set(t);
    this.categoria.set('');
  }

  registrar() {
    if (!this.esValido()) return;
    this.saved.emit({ tipo: this.tipo(), concepto: this.concepto(), monto: this.monto() });
    this.closed.emit();
  }

  close() { this.closed.emit(); }

  private resetForm() {
    this.tipo.set('EGRESO');
    this.fecha.set(new Date());
    this.concepto.set('');
    this.categoria.set('');
    this.monto.set(0);
    this.responsable.set('');
    this.comprobante.set('');
    this.observaciones.set('');
  }
}
