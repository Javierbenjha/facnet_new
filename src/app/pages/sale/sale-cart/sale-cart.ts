import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { CartItem, CartTotals } from '../sale.models';

@Component({
  selector: 'app-sale-cart',
  templateUrl: './sale-cart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'flex flex-col bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-700 overflow-hidden' },
  imports: [Button, InputText],
})
export class SaleCart {
  readonly cart        = input.required<CartItem[]>();
  readonly ticketNum   = input.required<number>();
  readonly sigla       = input.required<string>();
  readonly totals      = input.required<CartTotals>();
  readonly cobrarLabel = input.required<string>();

  readonly removeItem   = output<string>();
  readonly changeQty    = output<{ id: string; delta: number }>();
  readonly updatePrecio = output<{ id: string; precio: number }>();
  readonly clearCart    = output<void>();
  readonly cobrar       = output<void>();

  fmt(n: number) { return this.sigla() + ' ' + n.toFixed(2); }
  padTicket(n: number) { return '#' + n.toString().padStart(3, '0'); }
}
