import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type KpiVariant = 'default' | 'success' | 'danger' | 'warning' | 'info';

const VARIANT_CLASSES: Record<KpiVariant, { iconBg: string; iconColor: string; valueColor: string }> = {
  default: { iconBg: 'bg-primary-light', iconColor: 'text-primary',     valueColor: 'text-stone-900 dark:text-stone-100' },
  success: { iconBg: 'bg-emerald-100',   iconColor: 'text-emerald-600', valueColor: 'text-emerald-600'                   },
  danger:  { iconBg: 'bg-red-100',       iconColor: 'text-red-500',     valueColor: 'text-red-500'                       },
  warning: { iconBg: 'bg-amber-100',     iconColor: 'text-amber-500',   valueColor: 'text-amber-500'                     },
  info:    { iconBg: 'bg-blue-100',      iconColor: 'text-blue-600',    valueColor: 'text-blue-600'                      },
};

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard {
  readonly label    = input.required<string>();
  readonly value    = input.required<string>();
  readonly subtitle = input<string>();
  readonly icon     = input.required<string>();
  readonly variant  = input<KpiVariant>('default');

  readonly colors = computed(() => VARIANT_CLASSES[this.variant()]);
}
