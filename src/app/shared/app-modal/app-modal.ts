import { Component, ChangeDetectionStrategy, computed, input, output, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

export type ModalSize = 'sm' | 'md' | 'ml' | 'lg' | 'xl' | 'full';
export type ModalIconColor = 'danger' | 'warning' | 'info' | 'success';

const SIZE_MAP: Record<ModalSize, string> = {
  sm:   '28rem',
  md:   '40rem',
  ml:   '48rem',
  lg:   '56rem',
  xl:   '72rem',
  full: '95vw',
};

@Component({
  selector: 'app-modal',
  templateUrl: './app-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule],
})
export class AppModal {
  visible   = model(false);
  title     = input('');
  size      = input<ModalSize>('md');
  closable  = input(true);
  icon      = input('');
  iconColor = input<ModalIconColor>('danger');

  closed = output<void>();

  readonly width = () => SIZE_MAP[this.size()];

  readonly iconBg = computed(() => ({
    danger:  'bg-red-100 dark:bg-red-900/40',
    warning: 'bg-amber-100 dark:bg-amber-900/40',
    info:    'bg-blue-100 dark:bg-blue-900/40',
    success: 'bg-emerald-100 dark:bg-emerald-900/40',
  }[this.iconColor()]));

  readonly iconCls = computed(() => ({
    danger:  'text-red-500',
    warning: 'text-amber-500',
    info:    'text-blue-500',
    success: 'text-emerald-500',
  }[this.iconColor()]));

  onHide(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
