import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SubModule {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-maestros',
  templateUrl: './maestros.html',
  styleUrl: './maestros.scss',
  imports: [RouterLink]
})
export class Maestros {
  protected readonly subModules: SubModule[] = [
    { title: 'Clientes y Proveedores', description: 'Administración de cuentas de clientes, proveedores y contactos asociados', icon: 'pi-users', route: '/clientes' }
  ];
}
