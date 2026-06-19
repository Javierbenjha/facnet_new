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
import { Tag } from 'primeng/tag';
import { Checkbox } from 'primeng/checkbox';
import { AppModal } from '../../../shared/app-modal/app-modal';

const TIPOS_DOC_REF = [
  { label: 'Factura (01)',          value: '01' },
  { label: 'Boleta de Venta (03)', value: '03' },
];

const MOTIVOS_NC = [
  { label: '01 - Anulación de la operación',           value: '01' },
  { label: '02 - Anulación por error en el RUC',        value: '02' },
  { label: '03 - Corrección por error en descripción',  value: '03' },
  { label: '04 - Descuento global',                     value: '04' },
  { label: '05 - Descuento por ítem',                   value: '05' },
  { label: '06 - Devolución total',                     value: '06' },
  { label: '07 - Devolución por ítem',                  value: '07' },
  { label: '08 - Bonificación',                         value: '08' },
  { label: '09 - Disminución en el valor',              value: '09' },
  { label: '10 - Otros conceptos',                      value: '10' },
];

interface DocRef {
  tipoDoc: string;
  tipoDocLabel: string;
  serie: string;
  correlativo: string;
  fechaEmision: string;
  fechaVencimiento: string;
  cliente: string;
  ruc: string;
  moneda: string;
  formaPago: string;
  serieNc: string;
  subtotal: number;
  igv: number;
  total: number;
  estado: 'vigente' | 'pagado' | 'anulado';
}

interface LineaNC {
  productoId: number;
  descripcion: string;
  cantidad: number;
  cantidadMax: number;
  precio: number;
  stAfecto: number;
  isSelected: boolean;
}

@Component({
  selector: 'app-nc-form',
  templateUrl: './nc-form.html',
  imports: [
    AppModal, FormsModule, Button, InputText,
    InputGroupModule, InputGroupAddonModule, Select, InputNumber,
    DatePickerModule, TooltipModule, TableModule, Tag, Checkbox,
  ],
})
export class NcForm {
  readonly visible       = input<boolean>(false);
  readonly visibleChange = output<boolean>();

  readonly tiposDocRef = TIPOS_DOC_REF;
  readonly motivosNc   = MOTIVOS_NC;

  readonly refTipoDoc = signal('01');
  readonly refSerie   = signal('');
  readonly refCorr    = signal('');
  readonly docRef     = signal<DocRef | null>(null);
  readonly buscando   = signal(false);

  readonly lineas    = signal<LineaNC[]>([]);
  readonly motivo    = signal('');
  readonly fecha     = signal(new Date());
  readonly descuento = signal(0);

  readonly allSelected = computed(() =>
    this.lineas().length > 0 && this.lineas().every(l => l.isSelected)
  );

  readonly subtotalLineas = computed(() =>
    this.lineas()
      .filter(l => l.isSelected)
      .reduce((s, l) => s + l.cantidad * l.precio, 0)
  );

  readonly baseGravada = computed(() =>
    Math.max(0, this.subtotalLineas() - this.descuento())
  );
  readonly igv   = computed(() => this.baseGravada() * 0.18);
  readonly total = computed(() => this.baseGravada() + this.igv());

  readonly isValid = computed(() =>
    !!this.motivo() &&
    !!this.docRef() &&
    this.lineas().some(l => l.isSelected) &&
    this.total() > 0
  );

  fmt(n: number) { return 'S/ ' + n.toFixed(2); }

  estadoSeverity(e: DocRef['estado']) {
    return e === 'vigente' ? 'success' : e === 'pagado' ? 'info' : 'danger';
  }

  estadoLabel(e: DocRef['estado']) {
    return e === 'vigente' ? 'Vigente' : e === 'pagado' ? 'Pagado' : 'Anulado';
  }

  toggleAll() {
    const next = !this.allSelected();
    this.lineas.update(ls => ls.map(l => ({ ...l, isSelected: next })));
  }

  toggleLinea(i: number) {
    this.lineas.update(ls => {
      const c = [...ls];
      c[i] = { ...c[i], isSelected: !c[i].isSelected };
      return c;
    });
  }

  updateLinea(i: number, field: 'descripcion' | 'cantidad' | 'precio', value: string | number) {
    this.lineas.update(ls => {
      const c = [...ls];
      if (field === 'cantidad') {
        value = Math.min(Math.max(1, Number(value)), c[i].cantidadMax);
      }
      c[i] = { ...c[i], [field]: value };
      return c;
    });
  }

  buscarDoc() {
    if (!this.refSerie() || !this.refCorr()) return;
    this.buscando.set(true);
    // TODO: reemplazar con this.apiService.obtener_venta(idCia, tipoDoc, serie, correlativo)
    setTimeout(() => {
      const tipoLabel = this.tiposDocRef.find(t => t.value === this.refTipoDoc())?.label ?? '';
      this.docRef.set({
        tipoDoc:          this.refTipoDoc(),
        tipoDocLabel:     tipoLabel.split(' (')[0],
        serie:            this.refSerie().toUpperCase(),
        correlativo:      this.refCorr().padStart(6, '0'),
        fechaEmision:     '10/06/2026',
        fechaVencimiento: '10/07/2026',
        cliente:          'CLIENTE EJEMPLO S.A.C.',
        ruc:              '20123456789',
        moneda:           'PEN',
        formaPago:        'Contado',
        serieNc:          'FC01',
        subtotal:         423.73,
        igv:              76.27,
        total:            500.00,
        estado:           'vigente',
      });
      // Productos del documento de referencia — todos seleccionados por defecto
      this.lineas.set([
        { productoId: 1, descripcion: 'Producto A', cantidad: 2, cantidadMax: 2, precio: 150,    stAfecto: 1, isSelected: true },
        { productoId: 2, descripcion: 'Producto B', cantidad: 1, cantidadMax: 1, precio: 123.73, stAfecto: 1, isSelected: true },
      ]);
      this.buscando.set(false);
    }, 600);
  }

  save() {
    if (!this.isValid()) return;
    // TODO: integrar con API de emisión NC
    // Enviar solo lineas.filter(l => l.isSelected)
    this.close();
  }

  close() {
    this.refTipoDoc.set('01');
    this.refSerie.set('');
    this.refCorr.set('');
    this.docRef.set(null);
    this.motivo.set('');
    this.fecha.set(new Date());
    this.descuento.set(0);
    this.lineas.set([]);
    this.visibleChange.emit(false);
  }
}
