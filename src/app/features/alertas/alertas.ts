import { Component } from '@angular/core';

interface AlertItem {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.html',
  styleUrl: './alertas.scss',
  imports: []
})
export class Alertas {
  protected readonly alerts: AlertItem[] = [
    { id: 1, title: 'Stock Mínimo Alcanzado', message: 'El producto "Tornillo de Acero 1/2" llegó al stock mínimo de seguridad.', type: 'warning', timestamp: 'Hace 10 min' },
    { id: 2, title: 'Venta por Confirmar', message: 'La proforma PF-0034 está pendiente de confirmación de pago.', type: 'info', timestamp: 'Hace 1 hora' },
    { id: 3, title: 'Error de Facturación', message: 'No se pudo sincronizar la boleta BO-0012 con SUNAT. Error: 104.', type: 'error', timestamp: 'Hace 3 horas' }
  ];
}
