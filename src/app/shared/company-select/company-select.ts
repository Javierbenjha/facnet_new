import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
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
export class CompanySelect implements OnInit {
  private readonly branch = inject(Branch);
  private readonly auth = inject(Auth);

  readonly companies = this.auth.companies;
  readonly selectedCia = linkedSignal(() => this.auth.activeCompany()?.id ?? '');

  readonly branches = signal<Sucursal[]>([]);
  readonly selectedBranch = linkedSignal(() => this.auth.sucursalId() ?? '');

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
    this.branch.getBranches().subscribe((list) => this.branches.set(list));
  }

  onCiaChange(code: string) {
      console.log('onCiaChange fired →', code);
    this.auth
      .switchCompany({ ciaId: code })
      .pipe(
        switchMap(() => this.auth.me()),
        switchMap(() => this.branch.getBranches()),
      )
      .subscribe((list) => this.branches.set(list));
  }

  onBranchChange(sucursalId: string) {
    this.auth
      .switchCompany({ ciaId: this.selectedCia(), sucursalId })
      .pipe(switchMap(() => this.auth.me()))
      .subscribe();
  }
}
