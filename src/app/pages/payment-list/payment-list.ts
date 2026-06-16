import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class PaymentList {}
