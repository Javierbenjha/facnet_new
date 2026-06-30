import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Toaster } from '../../../core/services/toast';
import { DocTypesService } from '../../../core/services/doc-types';
import { CompanyDocType } from '../../../core/models/doc-type.model';

@Component({
  selector: 'app-emission-docs-modal',
  templateUrl: './emission-docs-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AppModal, TableModule, Tag, ToggleSwitch],
})
export class EmissionDocsModal {
  visible = model(false);

  private readonly svc   = inject(DocTypesService);
  private readonly toast = inject(Toaster);

  readonly loading  = signal(false);
  readonly toggling = signal<string | null>(null);
  readonly docs     = signal<CompanyDocType[]>([]);

  constructor() {
    toObservable(this.visible).pipe(
      takeUntilDestroyed(),
      filter(Boolean),
      switchMap(() => {
        this.loading.set(true);
        this.docs.set([]);
        return this.svc.findAll();
      }),
    ).subscribe({
      next: types => { this.docs.set(types); this.loading.set(false); },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar los documentos');
        this.loading.set(false);
      },
    });
  }

  toggleVentas(doc: CompanyDocType) {
    const key = `v-${doc.id}`;
    if (this.toggling() === key) return;
    this.toggling.set(key);
    this.svc.toggleVentas(doc.tipo_doc).subscribe({
      next: res => {
        this.docs.update(list => list.map(d => d.id === doc.id ? res.doc_type : d));
        this.toggling.set(null);
      },
      error: () => {
        this.toast.error('Error', 'No se pudo actualizar');
        this.toggling.set(null);
      },
    });
  }

  toggleCompras(doc: CompanyDocType) {
    const key = `c-${doc.id}`;
    if (this.toggling() === key) return;
    this.toggling.set(key);
    this.svc.toggleCompras(doc.tipo_doc).subscribe({
      next: res => {
        this.docs.update(list => list.map(d => d.id === doc.id ? res.doc_type : d));
        this.toggling.set(null);
      },
      error: () => {
        this.toast.error('Error', 'No se pudo actualizar');
        this.toggling.set(null);
      },
    });
  }
}
