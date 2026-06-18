import { Component, ChangeDetectionStrategy, input, output, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

export type ModalSize = 'sm' | 'md' | 'ml' | 'lg' | 'xl' | 'full';

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
  visible = model(false);
  title   = input('');
  size    = input<ModalSize>('md');
  closable = input(true);

  closed = output<void>();

  readonly width = () => SIZE_MAP[this.size()];

  onHide(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
