import { Injectable } from '@angular/core';

export interface ItemParaCalculo {
  cantidad:        number;
  precio_venta:    number;
  precio_publico?: number;
  st_afecto?:      0 | 1;
}

export interface TotalesCalculo {
  subtotal:            number;
  inafecto:            number;
  igv:                 number;
  total:               number;
  gratuito:            number;
  descuentoMonto:      number;
  totalAntesDescuento: number;
}

@Injectable({ providedIn: 'root' })
export class SaleCalculadoraService {

  calcularTotales(params: {
    items:         ItemParaCalculo[];
    igvPorcentaje: number;
    igvIncluido:   boolean;
    descuentoMonto: number;
  }): TotalesCalculo {
    const { items, igvPorcentaje, igvIncluido, descuentoMonto: descuentoMontoInput } = params;

    let subtotalAfectoBruto = 0;
    let inafectoBruto       = 0;
    let gratuitoBruto       = 0;

    items.forEach(item => {
      if (item.precio_venta === 0) {
        gratuitoBruto += (item.precio_publico ?? 0) * item.cantidad;
      }
      const neto = item.precio_venta * item.cantidad;
      if (item.st_afecto === 0) {
        inafectoBruto += neto;
      } else {
        subtotalAfectoBruto += neto;
      }
    });

    let subtotal: number;
    let igv: number;
    let totalAntesDescuento: number;

    if (igvIncluido) {
      subtotal            = subtotalAfectoBruto / (1 + igvPorcentaje / 100);
      igv                 = subtotalAfectoBruto - subtotal;
      totalAntesDescuento = subtotalAfectoBruto + inafectoBruto;
    } else {
      subtotal            = subtotalAfectoBruto;
      igv                 = subtotal * (igvPorcentaje / 100);
      totalAntesDescuento = subtotal + igv + inafectoBruto;
    }

    const descuentoMonto = Math.min(descuentoMontoInput, totalAntesDescuento);
    const total = Math.round((totalAntesDescuento - descuentoMonto) * 100) / 100;

    return { subtotal, inafecto: inafectoBruto, igv, total, gratuito: gratuitoBruto, descuentoMonto, totalAntesDescuento };
  }
}
