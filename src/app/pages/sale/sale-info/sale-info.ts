import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DetraccionConcepto, FormaPago, Moneda, TipoDoc, TipoDocOption } from '../sale.models';

@Component({
  selector: 'app-sale-info',
  templateUrl: './sale-info.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, IconField, InputIcon, InputText, InputNumber, Select, DatePickerModule],
})
export class SaleInfo {
  readonly cliente          = input.required<string>();
  readonly tipoDoc          = input.required<TipoDoc>();
  readonly serie            = input.required<string>();
  readonly fechaEmision     = input.required<Date>();
  readonly moneda           = input.required<Moneda>();
  readonly formaPago        = input.required<FormaPago>();
  readonly fechaVencimiento = input<Date | null>(null);
  readonly igvIncluido      = input.required<boolean>();
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

  readonly clienteChange            = output<string>();
  readonly tipoDocChange            = output<TipoDoc>();
  readonly fechaEmisionChange       = output<Date>();
  readonly monedaChange             = output<Moneda>();
  readonly formaPagoChange          = output<FormaPago>();
  readonly fechaVencimientoChange   = output<Date | null>();
  readonly igvIncluidoChange        = output<boolean>();
  readonly descuentoChange          = output<number>();
  readonly showDetRetChange         = output<boolean>();
  readonly detracConceptoChange     = output<DetraccionConcepto | null>();
  readonly aplicaRetencionToggle    = output<void>();

  fmt(n: number) { return this.sigla() + ' ' + n.toFixed(2); }
}
