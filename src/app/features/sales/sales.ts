import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SubModule {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
  imports: [RouterLink]
})
export class Sales {
  protected readonly subModules: SubModule[] = [
    { title: 'New Sale', description: 'Register a new sale in the system', icon: 'pi-plus-circle', route: '/sales/new' },
    { title: 'History', description: 'List and consult previous sales', icon: 'pi-history', route: '/sale_list' },
    { title: 'Cash Report', description: 'Manage cashier sessions and cash drawer logs', icon: 'pi-wallet', route: '/cash_report' },
    { title: 'Petty Cash', description: 'Control petty cash transactions and expenses', icon: 'pi-calculator', route: '/petty_cash' },
    { title: 'Debt Collection', description: 'Manage collection records and accounts receivable', icon: 'pi-money-bill', route: '/collection' },
    { title: 'Payments', description: 'Register customer payments and receipts', icon: 'pi-percentage', route: '/payments' },
    { title: 'Quotations', description: 'Generate and manage customer quotes', icon: 'pi-file', route: '/quotations' },
    { title: 'Shipping Guides', description: 'Issue referral guides and track shipments', icon: 'pi-truck', route: '/referral_guide' },
    { title: 'Reports', description: 'Detailed sales statistics and reports', icon: 'pi-chart-bar', route: '/reports' }
  ];
}
