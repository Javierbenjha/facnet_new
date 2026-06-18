import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-num-field',
  templateUrl: './num-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputNumber],
})
export class NumField {
  label    = input.required<string>();
  control  = input.required<FormControl<number>>();
  mode     = input<string>('decimal');
  decimals = input<number>(2);
}
