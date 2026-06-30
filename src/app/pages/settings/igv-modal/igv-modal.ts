import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { Company } from '../../../core/services/company';

@Component({
  selector: 'app-igv-modal',
  templateUrl: './igv-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, ToggleSwitch],
})
export class IgvModal {
  visible = model(false);

  private readonly svc   = inject(Company);
  private readonly toast = inject(Toaster);

  readonly loading   = signal(false);
  readonly saving    = signal(false);
  readonly igvActive = signal(false);

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        return this.svc.getCompanyIgv();
      }),
    ).subscribe({
      next: res => {
        this.igvActive.set(res.c_igv === 1);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudo cargar la configuración de IGV');
        this.loading.set(false);
      },
    });
  }

  toggle() {
    if (this.saving()) return;
    this.saving.set(true);
    // PATCH /cia/igv toggles server-side and returns the updated company — read the real value.
    this.svc.updateCompanyIgv().subscribe({
      next: res => {
        this.igvActive.set(res.company.c_igv === 1);
        this.saving.set(false);
        this.toast.success('IGV actualizado', res.message);
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Error', 'No se pudo actualizar el IGV');
      },
    });
  }
}
