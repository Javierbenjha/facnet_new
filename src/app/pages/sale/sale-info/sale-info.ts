import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DetraccionConcepto, FormaPago, Moneda, TipoDoc, TipoDocOption } from '../sale.models';
import { ClientSupplier } from '../../../core/models/client.model';

@Component({
  selector: 'app-sale-info',
  templateUrl: './sale-info.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, InputText, InputNumber, Select, DatePickerModule, AutoCompleteModule],
})
export class SaleInfo {
  readonly cliente              = input.required<string>();
  readonly clienteSuggestions   = input<ClientSupplier[]>([]);
  readonly clienteQuery         = output<string>();
  readonly clienteSelect        = output<ClientSupplier>();
  readonly tipoDoc          = input.required<TipoDoc>();
  readonly serie            = input.required<string>();
  readonly fechaEmision     = input.required<Date>();
  readonly moneda           = input.required<Moneda>();
  readonly formaPago        = input.required<FormaPago>();
  readonly fechaVencimiento = input<Date | null>(null);
  readonly descuento        = input.required<number>();
  readonly descuentoMonto   = input.required<number>();
  readonly descuentoPct     = input.required<number>();
  readonly tiposDoc         = input.required<TipoDocOption[]>();
  readonly sigla            = input.required<string>();
  readonly showDetRet       = input.required<boolean>();
  readonly detracConceptos  = input.required<DetraccionConcepto[]>();
  readonly detracConcepto   = input.required<DetraccionConcepto | null>();
  readonly aplicaRetencion  = input.required<boolean>();
  readonly retencionPct     = input.required<number>();
  readonly detracMonto      = input.required<number>();
  readonly retencionMonto   = input.required<number>();

  // Estado local del autocomplete (puede ser string mientras escribe o ClientSupplier al seleccionar)
  readonly acValue = signal<ClientSupplier | string>('');

  constructor() {
    // Sincroniza el valor local cuando el padre resetea el cliente (ej: después de cobrar)
    effect(() => { if (!this.cliente()) this.acValue.set(''); });
  }

  onAcChange(val: ClientSupplier | string | null) {
    if (!val) { this.clienteChange.emit(''); return; }
    if (typeof val === 'string') this.clienteChange.emit(val);
    // Si es objeto, lo maneja (onSelect)
  }

  onAcSelect(c: ClientSupplier) {
    this.acValue.set(c);
    this.clienteSelect.emit(c);
    this.clienteChange.emit(c.display_name);
  }

  readonly clienteChange            = output<string>();
  readonly tipoDocChange            = output<TipoDoc>();
  readonly fechaEmisionChange       = output<Date>();
  readonly monedaChange             = output<Moneda>();
  readonly formaPagoChange          = output<FormaPago>();
  readonly fechaVencimientoChange   = output<Date | null>();
  readonly descuentoChange          = output<number>();
  readonly showDetRetChange         = output<boolean>();
  readonly detracConceptoChange     = output<DetraccionConcepto | null>();
  readonly aplicaRetencionToggle    = output<void>();

  readonly clientePlaceholder = computed(() =>
    (this.tipoDoc() === 'boleta' || this.tipoDoc() === 'nota_venta')
      ? 'CLIENTES OTROS'
      : 'Buscar RUC...'
  );

  fmt(n: number) { return this.sigla() + ' ' + n.toFixed(2); }
}
