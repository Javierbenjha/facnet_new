import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SubModule {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
  imports: [RouterLink]
})
export class Inventory {
  protected readonly subModules: SubModule[] = [
    { title: 'Products Catalog', description: 'Create, edit, and list products and categories', icon: 'pi-box', route: '/products' },
    { title: 'Stock Adjustment', description: 'Inventory adjustments, manual inputs and outputs', icon: 'pi-pencil', route: '/stock_adjustment' }
  ];
}
