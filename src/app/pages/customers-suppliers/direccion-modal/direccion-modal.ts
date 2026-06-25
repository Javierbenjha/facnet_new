import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Select } from 'primeng/select';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Ubigeo } from '../../../core/services/ubigeo';
import { Department, Province, District } from '../../../core/models/ubigeo.model';
import { Direccion, mapAddressToDireccion } from '../customers-suppliers.models';
import { ClientsService } from '../../../core/services/clients';
import { Toaster } from '../../../core/services/toast';

@Component({
  selector: 'app-direccion-modal',
  templateUrl: './direccion-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, InputText, InputGroup, InputGroupAddon, Select, Divider, Tag, Tooltip, AppModal],
})
export class DireccionModal {
  readonly clientDoc  = input<string | null>(null);
  readonly clientName = input<string>('');
  readonly closed     = output<void>();

  private readonly clientsSvc = inject(ClientsService);
  private readonly ubiSvc     = inject(Ubigeo);
  private readonly toast      = inject(Toaster);

  readonly visible = computed(() => this.clientDoc() !== null);

  readonly modalTitle = computed(() => {
    const name   = this.clientName();
    const action = this.isEditing() ? 'Editar dirección' : 'Añadir dirección';
    return name ? `${action} — ${name}` : action;
  });

  readonly direcciones     = signal<Direccion[]>([]);
  readonly loadingAddresses = signal(false);
  readonly saving           = signal(false);

  // Form state
  readonly fDesc      = signal('');
  readonly fDep       = signal('');
  readonly fProv      = signal('');
  readonly fDist      = signal('');
  readonly fPrincipal = signal(false);
  readonly editIdx    = signal(-1);

  readonly isEditing = computed(() => this.editIdx() >= 0);

  readonly departamentos = signal<Department[]>([]);
  readonly provincias    = signal<Province[]>([]);
  readonly distritos     = signal<District[]>([]);

  constructor() {
    this.ubiSvc.getDepartments().subscribe(d => this.departamentos.set(d));

    effect(() => {
      const doc = this.clientDoc();
      if (!doc) {
        this.direcciones.set([]);
        this.resetForm();
        return;
      }
      this.loadingAddresses.set(true);
      this.clientsSvc.findAllAddresses(doc).subscribe({
        next: addrs => {
          this.direcciones.set(addrs.map(mapAddressToDireccion));
          this.loadingAddresses.set(false);
        },
        error: () => this.loadingAddresses.set(false),
      });
    });
  }

  setDep(codigo: string) {
    this.fDep.set(codigo);
    this.fProv.set('');
    this.fDist.set('');
    this.provincias.set([]);
    this.distritos.set([]);
    if (codigo) {
      this.ubiSvc.getProvinces(codigo).subscribe(p => this.provincias.set(p));
    }
  }

  setProv(codigo: string) {
    this.fProv.set(codigo);
    this.fDist.set('');
    this.distritos.set([]);
    if (this.fDep() && codigo) {
      this.ubiSvc.getDistricts(this.fDep(), codigo).subscribe(d => this.distritos.set(d));
    }
  }

  guardar() {
    const desc = this.fDesc().trim();
    const dep  = this.fDep();
    const prov = this.fProv();
    const dist = this.fDist();
    const doc  = this.clientDoc();
    if (!desc || !dep || !prov || !dist || !doc || this.saving()) return;

    this.saving.set(true);
    const payload = { descripcion: desc, departamento: dep, provincia: prov, distrito: dist };

    if (this.isEditing()) {
      const editing    = this.direcciones()[this.editIdx()];
      const idx        = this.editIdx();
      const depNombre  = this.departamentos().find(d => d.codigo === dep)?.nombre ?? dep;
      const provNombre = this.provincias().find(p => p.codigo === prov)?.nombre ?? prov;
      const distNombre = this.distritos().find(d => d.codigo === dist)?.nombre ?? dist;

      const onOk = () => {
        this.saving.set(false);
        this.toast.success('Actualizado', 'Dirección actualizada correctamente.');
        this.direcciones.update(list =>
          list.map((d, i) => i === idx
            ? { ...d, descripcion: desc, departamento: dep, provincia: prov, distrito: dist,
                dep_nombre: depNombre, prov_nombre: provNombre, dist_nombre: distNombre }
            : d
          )
        );
        this.resetForm();
      };
      const onErr = () => { this.saving.set(false); this.toast.error('Error', 'No se pudo actualizar la dirección.'); };

      if (editing.source === 'primary') {
        this.clientsSvc.update(doc, { direccion: desc, departamento: dep, provincia: prov, distrito: dist })
          .subscribe({ next: onOk, error: onErr });
      } else if (editing.id) {
        this.clientsSvc.updateAddress(doc, editing.id, payload)
          .subscribe({ next: onOk, error: onErr });
      } else {
        this.saving.set(false);
      }
    } else {
      this.clientsSvc.createAddress(doc, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.toast.success('Agregado', 'Dirección agregada correctamente.');
          this.reload();
          this.resetForm();
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Error', 'No se pudo agregar la dirección.');
        },
      });
    }
  }

  editar(index: number) {
    const d    = this.direcciones()[index];
    const dep  = d.departamento ?? '';
    const prov = d.provincia ?? '';
    this.fDesc.set(d.descripcion);
    this.fDep.set(dep);
    this.fProv.set(prov);
    this.fDist.set(d.distrito ?? '');
    this.fPrincipal.set(d.es_principal);
    this.editIdx.set(index);
    if (dep) {
      this.ubiSvc.getProvinces(dep).subscribe(p => {
        this.provincias.set(p);
        if (prov) {
          this.ubiSvc.getDistricts(dep, prov).subscribe(ds => this.distritos.set(ds));
        }
      });
    }
  }

  setPrincipal(index: number) {
    const d   = this.direcciones()[index];
    const doc = this.clientDoc();
    if (!doc || d.source === 'primary' || !d.id) return;

    this.clientsSvc.update(doc, {
      direccion:    d.descripcion,
      departamento: d.departamento ?? undefined,
      provincia:    d.provincia ?? undefined,
      distrito:     d.distrito ?? undefined,
    }).pipe(
      switchMap(() => this.clientsSvc.removeAddress(doc, d.id!)),
    ).subscribe({
      next: () => {
        this.toast.success('Dirección principal actualizada', `"${d.descripcion}" es ahora la dirección principal.`);
        this.reload();
      },
      error: () => this.toast.error('Error', 'No se pudo establecer como dirección principal.'),
    });
  }

  eliminar(index: number) {
    const d   = this.direcciones()[index];
    const doc = this.clientDoc();
    if (!doc || !d.id || d.source === 'primary') return;

    this.clientsSvc.removeAddress(doc, d.id).subscribe({
      next: () => {
        this.toast.success('Eliminado', 'Dirección eliminada correctamente.');
        this.reload();
        if (this.editIdx() === index) this.resetForm();
      },
      error: () => this.toast.error('Error', 'No se pudo eliminar la dirección.'),
    });
  }

  close() { this.closed.emit(); }

  cancelEdit() { this.resetForm(); }

  private reload() {
    const doc = this.clientDoc();
    if (!doc) return;
    this.clientsSvc.findAllAddresses(doc).subscribe({
      next: addrs => this.direcciones.set(addrs.map(mapAddressToDireccion)),
    });
  }

  private resetForm() {
    this.fDesc.set('');
    this.fDep.set('');
    this.fProv.set('');
    this.fDist.set('');
    this.fPrincipal.set(false);
    this.provincias.set([]);
    this.distritos.set([]);
    this.editIdx.set(-1);
  }
}
