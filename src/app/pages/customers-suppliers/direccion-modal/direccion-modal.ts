import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { DEPARTAMENTOS, getProvincias, getDistritos } from '../../../shared/ubigeo.data';
import { Direccion, Persona } from '../customers-suppliers.models';

@Component({
  selector: 'app-direccion-modal',
  templateUrl: './direccion-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, InputText, InputGroup, InputGroupAddon, Select, Checkbox, Divider, Tag, Tooltip, AppModal],
})
export class DireccionModal {
  persona = input<Persona | null>(null);
  closed  = output<Persona>();

  readonly visible = computed(() => this.persona() !== null);

  readonly modalTitle = computed(() => {
    const p = this.persona();
    if (!p) return '';
    const nombre = p.tipo_documento === 'RUC'
      ? p.nombre
      : [p.nombre, p.apellido_paterno].filter(Boolean).join(' ');
    const accion = this.isEditing() ? 'Editar dirección' : 'Añadir dirección';
    return `${accion} — ${nombre}`;
  });

  readonly direcciones = signal<Direccion[]>([]);

  // Form state
  readonly fDesc      = signal('');
  readonly fDep       = signal('');
  readonly fProv      = signal('');
  readonly fDist      = signal('');
  readonly fPrincipal = signal(false);
  readonly editIdx    = signal(-1);

  readonly isEditing = computed(() => this.editIdx() >= 0);

  // Ubigeo cascading options
  readonly depOpts  = DEPARTAMENTOS;
  readonly provOpts = computed(() => getProvincias(this.fDep()));
  readonly distOpts = computed(() => getDistritos(this.fDep(), this.fProv()));

  constructor() {
    effect(() => {
      const p = this.persona();
      this.direcciones.set(p?.direcciones ? [...p.direcciones] : []);
      this.resetForm();
    });
  }

  setDep(dep: string) {
    this.fDep.set(dep);
    this.fProv.set('');
    this.fDist.set('');
  }

  setProv(prov: string) {
    this.fProv.set(prov);
    this.fDist.set('');
  }

  guardar() {
    const desc = this.fDesc().trim();
    const dep  = this.fDep();
    const prov = this.fProv();
    const dist = this.fDist();
    if (!desc || !dep || !prov || !dist) return;

    const item: Direccion = {
      id:           this.isEditing() ? this.direcciones()[this.editIdx()].id : crypto.randomUUID(),
      descripcion:  desc,
      departamento: dep,
      provincia:    prov,
      distrito:     dist,
      es_principal: this.fPrincipal(),
    };

    let list = [...this.direcciones()];
    if (item.es_principal) {
      list = list.map(d => ({ ...d, es_principal: false }));
    }
    if (this.isEditing()) {
      list[this.editIdx()] = item;
    } else {
      if (list.length === 0) item.es_principal = true;
      list.push(item);
    }

    this.direcciones.set(list);
    this.resetForm();
  }

  editar(index: number) {
    const d = this.direcciones()[index];
    this.fDesc.set(d.descripcion);
    this.fDep.set(d.departamento);
    this.fProv.set(d.provincia);
    this.fDist.set(d.distrito);
    this.fPrincipal.set(d.es_principal);
    this.editIdx.set(index);
  }

  eliminar(index: number) {
    const wasPrincipal = this.direcciones()[index].es_principal;
    let list = this.direcciones().filter((_, i) => i !== index);
    if (wasPrincipal && list.length > 0) {
      list = [{ ...list[0], es_principal: true }, ...list.slice(1)];
    }
    this.direcciones.set(list);
    if (this.editIdx() === index) this.resetForm();
  }

  setPrincipal(index: number) {
    this.direcciones.set(
      this.direcciones().map((d, i) => ({ ...d, es_principal: i === index }))
    );
  }

  close() {
    const p = this.persona();
    if (p) this.closed.emit({ ...p, direcciones: this.direcciones() });
  }

  cancelEdit() { this.resetForm(); }

  private resetForm() {
    this.fDesc.set('');
    this.fDep.set('');
    this.fProv.set('');
    this.fDist.set('');
    this.fPrincipal.set(false);
    this.editIdx.set(-1);
  }
}
