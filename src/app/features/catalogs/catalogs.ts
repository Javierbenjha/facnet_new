import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SubModule {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.html',
  styleUrl: './catalogs.scss',
  imports: [RouterLink]
})
export class Catalogs {
  protected readonly subModules: SubModule[] = [
    { title: 'Customers & Suppliers', description: 'Manage customer accounts, suppliers, and contacts', icon: 'pi-users', route: '/customers_suppliers' }
  ];
}
