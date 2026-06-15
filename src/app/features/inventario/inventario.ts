import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SubModule {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss',
  imports: [RouterLink]
})
export class Inventario {
  protected readonly subModules: SubModule[] = [
    { title: 'Catálogo de Productos', description: 'Crear, editar y listar productos y categorías', icon: 'pi-box', route: '/productos' },
    { title: 'Regulación de Stock', description: 'Ajustes de inventario, ingresos y salidas manuales', icon: 'pi-pencil', route: '/regular-stock' }
  ];
}
