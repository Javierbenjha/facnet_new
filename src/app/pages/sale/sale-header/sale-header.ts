import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { SaleInfoSummary } from '../sale.models';

@Component({
  selector: 'app-sale-header',
  templateUrl: './sale-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Popover, DecimalPipe],
})
export class SaleHeader {
  readonly saleInfo = input.required<SaleInfoSummary>();

  readonly nc            = output<void>();
  readonly nd            = output<void>();
  readonly historial     = output<void>();
  readonly crearProducto = output<void>();
  readonly nuevoCliente  = output<void>();
}
