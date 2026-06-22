import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { Ubigeo } from '../../core/services/ubigeo';
import { Department, District, Province } from '../../core/models/ubigeo.model';

// What this reusable widget hands up once the three levels are chosen.
export interface UbigeoSelection {
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string;
}

@Component({
  selector: 'app-ubigeo-select',
  templateUrl: './ubigeo-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbigeoSelect implements OnInit {
  private readonly ubigeo = inject(Ubigeo);

  // Emits the full selection when dept+prov+dist are all chosen; null while incomplete.
  readonly selectionChange = output<UbigeoSelection | null>();

  readonly departments = signal<Department[]>([]);
  readonly provinces = signal<Province[]>([]);
  readonly districts = signal<District[]>([]);

  readonly selectedDept = signal('');
  readonly selectedProv = signal('');
  readonly selectedDist = signal('');

  ngOnInit() {
    this.ubigeo.getDepartments().subscribe((list) => this.departments.set(list));
  }

  onDeptChange(code: string) {
    this.selectedDept.set(code);
    // A new department invalidates everything below it.
    this.selectedProv.set('');
    this.selectedDist.set('');
    this.provinces.set([]);
    this.districts.set([]);
    this.emit();
    if (code) this.ubigeo.getProvinces(code).subscribe((list) => this.provinces.set(list));
  }

  onProvChange(code: string) {
    this.selectedProv.set(code);
    this.selectedDist.set('');
    this.districts.set([]);
    this.emit();
    if (code) {
      this.ubigeo
        .getDistricts(this.selectedDept(), code)
        .subscribe((list) => this.districts.set(list));
    }
  }

  onDistChange(code: string) {
    this.selectedDist.set(code);
    this.emit();
  }

  private emit() {
    const dep = this.selectedDept();
    const prov = this.selectedProv();
    const dist = this.selectedDist();
    if (dep && prov && dist) {
      // ASSUMPTION: each codigo is 2 digits, so ubigeo = dep + prov + dist (6 digits).
      // Verify against a real API response — adjust if codes are already cumulative.
      this.selectionChange.emit({ departamento: dep, provincia: prov, distrito: dist, ubigeo: dep + prov + dist });
    } else {
      this.selectionChange.emit(null);
    }
  }
}
