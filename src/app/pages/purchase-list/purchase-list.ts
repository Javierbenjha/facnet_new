import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.html',
  styleUrl: './purchase-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class PurchaseList {}
