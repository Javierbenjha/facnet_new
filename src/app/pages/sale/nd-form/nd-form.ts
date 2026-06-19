import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { AppModal } from '../../../shared/app-modal/app-modal';

const TIPOS_DOC_REF = [
  { label: 'Factura (01)',         value: '01' },
  { label: 'Boleta de Venta (03)', value: '03' },
];

const MOTIVOS_ND = [
  { label: '01 - Intereses por mora',            value: '01' },
  { label: '02 - Aumento en el valor',            value: '02' },
  { label: '03 - Penalidades / otros conceptos', value: '03' },
];

interface DocRef {
  tipoDoc: string;
  tipoDocLabel: string;
  serie: string;
  correlativo: string;
  fechaEmision: string;
  cliente: string;
  ruc: string;
  moneda: string;
  formaPago: string;
  subtotal: number;
  igv: number;
  total: number;
}

interface ConceptoND {
  descripcion: string;
  monto: number;
}

@Component({
  selector: 'app-nd-form',
  templateUrl: './nd-form.html',
  imports: [
    AppModal, FormsModule, Button, InputText,
    InputGroupModule, InputGroupAddonModule, Select, InputNumber, DatePickerModule, TooltipModule, TableModule,
  ],
})
export class NdForm {
  readonly visible       = input<boolean>(false);
  readonly visibleChange = output<boolean>();

  readonly tiposDocRef = TIPOS_DOC_REF;
  readonly motivosNd   = MOTIVOS_ND;

  readonly refTipoDoc = signal('01');
  readonly refSerie   = signal('');
  readonly refCorr    = signal('');
  readonly docRef     = signal<DocRef | null>(null);
  readonly buscando   = signal(false);

  readonly conceptos = signal<ConceptoND[]>([{ descripcion: '', monto: 0 }]);
  readonly motivo    = signal('');
  readonly fecha     = signal(new Date());

  readonly subtotal = computed(() => this.conceptos().reduce((s, c) => s + c.monto, 0));
  readonly igv      = computed(() => this.subtotal() * 0.18);
  readonly total    = computed(() => this.subtotal() + this.igv());
  readonly isValid  = computed(() => !!this.motivo() && !!this.docRef());

  fmt(n: number) { return 'S/ ' + n.toFixed(2); }

  buscarDoc() {
    if (!this.refSerie() || !this.refCorr()) return;
    this.buscando.set(true);
    // TODO: integrar con API obtener_venta_nota(idCia, tipoDoc, serie, correlativo)
    setTimeout(() => {
      const label = this.tiposDocRef.find(t => t.value === this.refTipoDoc())?.label ?? '';
      this.docRef.set({
        tipoDoc: this.refTipoDoc(),
        tipoDocLabel: label.split(' (')[0],
        serie: this.refSerie().toUpperCase(),
        correlativo: this.refCorr().padStart(6, '0'),
        fechaEmision: '10/06/2026',
        cliente: 'CLIENTE EJEMPLO S.A.C.',
        ruc: '20123456789',
        moneda: 'PEN',
        formaPago: 'Contado',
        subtotal: 423.73,
        igv: 76.27,
        total: 500.00,
      });
      this.buscando.set(false);
    }, 600);
  }

  addConcepto() { this.conceptos.update(cs => [...cs, { descripcion: '', monto: 0 }]); }

  removeConcepto(i: number) { this.conceptos.update(cs => cs.filter((_, idx) => idx !== i)); }

  updateConcepto(i: number, field: keyof ConceptoND, value: string | number) {
    this.conceptos.update(cs => { const c = [...cs]; c[i] = { ...c[i], [field]: value }; return c; });
  }

  save() {
    if (!this.isValid()) return;
    // TODO: integrar con API de emisión ND
    this.close();
  }

  close() {
    this.refTipoDoc.set('01');
    this.refSerie.set('');
    this.refCorr.set('');
    this.docRef.set(null);
    this.motivo.set('');
    this.fecha.set(new Date());
    this.conceptos.set([{ descripcion: '', monto: 0 }]);
    this.visibleChange.emit(false);
  }
}
