import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Company } from '../../core/services/company';
import { Cia } from '../../core/models/company.model';
import { Auth } from '../../core/services/auth';
import { Branch } from '../../core/services/branch';
import { Sucursal } from '../../core/models/branch.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-company-select',
  templateUrl: './company-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Select, FormsModule],
})
export class CompanySelect {
  private readonly company = inject(Company);
  private readonly branch = inject(Branch);
  private readonly auth = inject(Auth);

  readonly companies = signal<Cia[]>([]);
  selectedCia = '';

  readonly branches = signal<Sucursal[]>([]);
  selectedBranch = '';

  // Mapeamos las cias al formato que espera p-select
  readonly companiesOptions = computed(() =>
    this.companies().map((c) => ({
      label: c.descripcion,
      value: c.id,
    })),
  );

  readonly branchesOptions = computed(() =>
    this.branches().map((c) => ({
      label: c.descripcion,
      value: c.id,
    })),
  );

  ngOnInit() {
    this.company.getCompanies().subscribe((list) => this.companies.set(list));
  }

  onCiaChange(code: string) {
  this.auth.switchCompany({ ciaId: code, sucursalId: '' }).pipe(
    switchMap(() => this.auth.me()),
    switchMap(() => this.branch.getBranches()),
  ).subscribe((branches) => this.branches.set(branches));
}
}
