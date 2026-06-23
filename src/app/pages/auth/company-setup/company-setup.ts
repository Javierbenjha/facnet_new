import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { Company } from '../../../core/services/company';
import { Toaster } from '../../../core/services/toast';
import { CompanyForm, CompanyFormData } from './company-form/company-form';
import { BranchForm, BranchFormData } from './branch-form/branch-form';
import { Branch } from '../../../core/services/branch';

@Component({
  selector: 'app-company-setup',
  templateUrl: './company-setup.html',
  styleUrl: './company-setup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, CompanyForm, BranchForm],
})
export class CompanySetup {
  private readonly company = inject(Company);
  private readonly branch = inject(Branch)
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toast = inject(Toaster);

  // 1 = empresa, 2 = sucursal. The wizard never goes back (business rule).
  readonly step = signal<1 | 2>(1);
  readonly loading = signal(false);
  // The branch step needs the company id returned by POST /cia.
  readonly ciaId = signal<string | null>(null);

  onCompanySubmit(data: CompanyFormData) {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      this.toast.error('Sesión inválida', 'Vuelve a iniciar sesión.');
      return;
    }

    this.loading.set(true);
    this.company
      .create({ ...data, usuario_id: userId })
      .pipe(
        // Keep the company id, then refresh permissions before advancing.
        switchMap((res) => {
          this.ciaId.set(res.activeCompany.id);
          return this.auth.me();
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => this.step.set(2),
        error: (err) => this.toast.error('No se pudo crear la empresa', err.error?.message),
      });
  }

  onBranchSubmit(data: BranchFormData) {
    const ciaId = this.ciaId();
    if (!ciaId) {
      this.toast.error('Empresa no encontrada', 'Vuelve a crear la empresa.');
      return;
    }

    // Build the 6-digit ubigeo here, just like usuario_id in onCompanySubmit.
    const ubigeo = data.departamento + data.provincia + data.distrito;

    this.loading.set(true);
    this.branch
      .create({ ...data, ubigeo })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/sales']),
        error: (err) => this.toast.error('No se pudo crear la sucursal', err.error?.message),
      });
  }
}
