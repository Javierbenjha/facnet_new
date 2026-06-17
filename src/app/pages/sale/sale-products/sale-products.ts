import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { PosProducto } from '../sale.models';

@Component({
  selector: 'app-sale-products',
  templateUrl: './sale-products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'flex flex-col flex-1 overflow-hidden' },
  imports: [Button, IconField, InputIcon, InputText],
})
export class SaleProducts {
  readonly query      = input.required<string>();
  readonly catActiva  = input.required<string>();
  readonly categorias = input.required<string[]>();
  readonly productos  = input.required<PosProducto[]>();
  readonly sigla      = input.required<string>();

  readonly queryChange     = output<string>();
  readonly catActivaChange = output<string>();
  readonly productClick    = output<PosProducto>();
  readonly createProduct   = output<void>();
}
