import { Component } from '@angular/core';

interface AlertItem {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss',
  imports: []
})
export class Alerts {
  protected readonly alerts: AlertItem[] = [
    { id: 1, title: 'Minimum Stock Reached', message: 'Product "Steel Screw 1/2" reached minimum safety stock level.', type: 'warning', timestamp: '10 min ago' },
    { id: 2, title: 'Pending Sale Confirmation', message: 'Quotation PF-0034 is pending payment confirmation.', type: 'info', timestamp: '1 hour ago' },
    { id: 3, title: 'Billing Error', message: 'Could not sync invoice BO-0012 with tax agency. Error: 104.', type: 'error', timestamp: '3 hours ago' }
  ];
}
