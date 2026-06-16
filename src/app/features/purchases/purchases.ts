import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SubModule {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.html',
  styleUrl: './purchases.scss',
  imports: [RouterLink]
})
export class Purchases {
  protected readonly subModules: SubModule[] = [
    { title: 'New Purchase', description: 'Register supplier invoices and purchase orders', icon: 'pi-plus-circle', route: '/purchases/new' },
    { title: 'Purchase History', description: 'Consult and filter previous purchases and expenses', icon: 'pi-history', route: '/purchases/history' }
  ];
}
