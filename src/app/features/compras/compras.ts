import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SubModule {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-compras',
  templateUrl: './compras.html',
  styleUrl: './compras.scss',
  imports: [RouterLink]
})
export class Compras {
  protected readonly subModules: SubModule[] = [
    { title: 'Nueva Compra', description: 'Registrar facturas y órdenes de compra de proveedores', icon: 'pi-plus-circle', route: '/compras/registrar' },
    { title: 'Historial de Compras', description: 'Consultar y filtrar compras y egresos previos', icon: 'pi-history', route: '/compras/historial' }
  ];
}
