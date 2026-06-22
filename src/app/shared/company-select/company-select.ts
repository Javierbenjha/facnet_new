import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Company } from '../../core/services/company';
import { Cia } from '../../core/models/company.model';

@Component({
  selector: 'app-company-select',
  templateUrl: './company-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Select, FormsModule],
})
export class CompanySelect {
  private readonly company = inject(Company);

  readonly companies = signal<Cia[]>([]);
  selectedCia = '';  // ngModel two-way no funciona bien con signal()

  // Mapeamos las cias al formato que espera p-select
  readonly companiesOptions = computed(() =>
    this.companies().map((c) => ({
      label: c.descripcion,
      value: c.id,
    }))
  );

  ngOnInit() {
    this.company.getCompanies().subscribe((list) => this.companies.set(list));
  }

  onCiaChange(code: string) {
    console.log('Cia seleccionada:', code);
  }
}