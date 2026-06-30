import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormRoot, FormField, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Persona, TipoDocumento, TipoPersona } from '../customers-suppliers.models';
import { ClientsService } from '../../../core/services/clients';
import { Reniec } from '../../../core/services/reniec';
import { Sunat } from '../../../core/services/sunat';
import { Toaster } from '../../../core/services/toast';
import { ClientSupplier, DocumentType } from '../../../core/models/client.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField, FormsModule, Button, InputText, Select, InputGroup, InputGroupAddon, AppModal],
})
export class CustomerForm {
  readonly editing     = input<Persona | 'new' | null>(null);
  readonly tipoPersona = input<TipoPersona>('CLIENTE');
  readonly pickerMode  = input(false);
  readonly closed         = output<void>();
  readonly saved          = output<void>();
  readonly clientePicked  = output<ClientSupplier>();

  private readonly clientsSvc = inject(ClientsService);
  private readonly reniecSvc  = inject(Reniec);
  private readonly sunatSvc   = inject(Sunat);
  private readonly toast      = inject(Toaster);

  readonly visible = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    if (this.pickerMode()) return 'Buscar cliente';
    const tipo = this.tipoPersona() === 'CLIENTE' ? 'cliente' : 'proveedor';
    return e === 'new' ? `Nuevo ${tipo}` : `Editar ${tipo}`;
  });

  readonly documentTypes   = signal<DocumentType[]>([]);
  readonly loadingDocTypes = signal(true);

  readonly tipoDocOptions = computed(() => {
    const types = this.documentTypes();
    const filtered = this.tipoPersona() === 'PROVEEDOR'
      ? types.filter(d => d.sigla === 'RUC')
      : types;
    return filtered.map(d => ({ label: d.sigla, value: d.sigla }));
  });

  readonly searching     = signal(false);
  readonly saving        = signal(false);
  readonly searchError   = signal('');
  readonly expressResult = signal<ClientSupplier | null>(null);
  readonly existsInDb    = signal(false);

  readonly model = signal({
    tipo_documento:   'DNI' as TipoDocumento,
    numero_documento: '',
    nombre:           '',
    apellido_paterno: '',
    apellido_materno: '',
    telefono:         '',
    email:            '',
  });

  readonly form = form(this.model);

  readonly isDni = computed(() => this.model().tipo_documento === 'DNI' || this.model().tipo_documento === 'CE');
  readonly isRuc = computed(() => this.model().tipo_documento === 'RUC');

  readonly docPlaceholder = computed(() => {
    const t = this.model().tipo_documento;
    if (t === 'DNI') return '76329484';
    if (t === 'RUC') return '20123456789';
    return 'CE-000000000';
  });

  constructor() {
    this.clientsSvc.getDocumentTypes().pipe(takeUntilDestroyed()).subscribe({
      next: types => {
        this.documentTypes.set(types);
        this.loadingDocTypes.set(false);
        const opts = this.tipoDocOptions();
        const current = this.model().tipo_documento;
        if (!opts.find(o => o.value === current) && opts.length) {
          this.model.update(m => ({ ...m, tipo_documento: opts[0].value as TipoDocumento }));
        }
      },
      error: () => this.loadingDocTypes.set(false),
    });

    effect(() => {
      const e = this.editing();
      if (!e) return;
      this.expressResult.set(null);
      this.existsInDb.set(false);
      this.searchError.set('');
      if (e === 'new') {
        const defaultDoc = (this.tipoDocOptions()[0]?.value ?? 'DNI') as TipoDocumento;
        this.model.set({
          tipo_documento: defaultDoc, numero_documento: '',
          nombre: '', apellido_paterno: '', apellido_materno: '',
          telefono: '', email: '',
        });
      } else {
        const raw = (e as Persona)._raw;
        const p   = e as Persona;
        this.model.set({
          tipo_documento:   p.tipo_documento,
          numero_documento: p.numero_documento,
          nombre:           this.isRuc() ? (raw.razon_social ?? p.nombre) : (raw.nombre ?? p.nombre),
          apellido_paterno: raw.apellido_paterno ?? '',
          apellido_materno: raw.apellido_materno ?? '',
          telefono:         raw.telefono ?? '',
          email:            raw.email ?? '',
        });
      }
    });
  }

  buscarDocumento() {
    const doc = this.model().numero_documento.trim();
    if (!doc || this.searching()) return;

    this.searching.set(true);
    this.searchError.set('');
    this.expressResult.set(null);
    this.existsInDb.set(false);

    // Check DB first — if exists, load and avoid any external call
    this.clientsSvc.findOne(doc).subscribe({
      next: client => {
        this.expressResult.set(client);
        this.existsInDb.set(true);
        this.fillFromClient(client);
        this.searching.set(false);
        this.toast.success('Encontrado', `${client.display_name} ya está registrado.`);
      },
      error: err => {
        if (err.status !== 404) {
          this.searching.set(false);
          this.searchError.set('Error al consultar el registro.');
          this.toast.error('Error', 'No se pudo consultar el registro.');
          return;
        }
        // Not in DB → consult RENIEC or SUNAT (read-only, no creation)
        this.lookupExternal(doc);
      },
    });
  }

  private lookupExternal(doc: string) {
    if (this.isRuc()) {
      this.sunatSvc.getByRuc(doc).subscribe({
        next: data => {
          this.model.update(m => ({ ...m, nombre: data.razon_social }));
          this.searching.set(false);
          this.toast.success('SUNAT', `${data.razon_social} encontrado.`);
        },
        error: () => {
          this.searching.set(false);
          this.searchError.set('RUC no encontrado en SUNAT.');
          this.toast.error('Sin resultados', 'RUC no encontrado en SUNAT.');
        },
      });
    } else {
      this.reniecSvc.getByDni(doc).subscribe({
        next: data => {
          this.model.update(m => ({
            ...m,
            nombre:           data.nombres,
            apellido_paterno: data.apellido_paterno,
            apellido_materno: data.apellido_materno,
          }));
          this.searching.set(false);
          this.toast.success('RENIEC', `${data.nombres} ${data.apellido_paterno} encontrado.`);
        },
        error: () => {
          this.searching.set(false);
          this.searchError.set('DNI no encontrado en RENIEC.');
          this.toast.error('Sin resultados', 'DNI no encontrado en RENIEC.');
        },
      });
    }
  }

  save() {
    if (this.saving()) return;
    this.saving.set(true);

    const v       = this.model();
    const existing = this.editing();

    const commonFields = {
      nombre:           v.nombre || undefined,
      apellido_paterno: this.isDni() ? (v.apellido_paterno || undefined) : undefined,
      apellido_materno: this.isDni() ? (v.apellido_materno || undefined) : undefined,
      razon_social:     this.isRuc() ? (v.nombre || undefined) : undefined,
      telefono:         v.telefono || undefined,
      email:            v.email || undefined,
    };

    const tipo  = this.tipoPersona() === 'CLIENTE' ? 'Cliente' : 'Proveedor';
    const onSuccess = () => {
      this.saving.set(false);
      this.toast.success('Guardado', `${tipo} guardado correctamente.`);
      this.saved.emit();
    };
    const onError = () => {
      this.saving.set(false);
      this.toast.error('Error', `No se pudo guardar el ${tipo.toLowerCase()}.`);
    };

    if (existing && existing !== 'new') {
      this.clientsSvc.update((existing as Persona).numero_documento, commonFields)
        .subscribe({ next: onSuccess, error: onError });
    } else if (this.existsInDb()) {
      this.clientsSvc.update(this.expressResult()!.numero_documento, commonFields)
        .subscribe({ next: onSuccess, error: onError });
    } else {
      const docId = this.documentTypes().find(d => d.sigla === v.tipo_documento)?.id_documento
        ?? (v.tipo_documento === 'RUC' ? '2' : '1');
      this.clientsSvc.create({
        numero_documento:       v.numero_documento,
        documento_id_documento: docId,
        tipo_persona:           this.tipoPersona() === 'CLIENTE' ? 1 : 2,
        ...commonFields,
      }).subscribe({
        next: created => {
          onSuccess();
          if (this.pickerMode()) this.clientePicked.emit(created);
        },
        error: onError,
      });
    }
  }

  selectExisting() {
    const c = this.expressResult();
    if (c) { this.clientePicked.emit(c); this.close(); }
  }

  private fillFromClient(c: ClientSupplier) {
    const sigla = this.documentTypes().find(d => d.id_documento === c.documento_id_documento)?.sigla?.toUpperCase();
    const desc  = (c.documento_descripcion ?? '').toUpperCase();
    const resolved = sigla ?? desc;
    const tipoDoc: TipoDocumento =
      (resolved === 'RUC' || desc.includes('CONTRIBUYENTE')) ? 'RUC' :
      (resolved === 'CEX' || desc.includes('EXTRANJERIA'))   ? 'CE'  : 'DNI';
    const isRuc = tipoDoc === 'RUC';

    this.model.update(m => ({
      ...m,
      tipo_documento:   tipoDoc,
      nombre:           isRuc ? (c.razon_social ?? '') : (c.nombre ?? ''),
      apellido_paterno: isRuc ? '' : (c.apellido_paterno ?? ''),
      apellido_materno: isRuc ? '' : (c.apellido_materno ?? ''),
      telefono:         c.telefono ?? '',
      email:            c.email ?? '',
    }));
  }

  close() { this.closed.emit(); }
}
