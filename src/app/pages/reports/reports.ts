import {
  ChangeDetectionStrategy, Component, TemplateRef,
  computed, signal, viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { PageHeader } from '../../shared/page-header/page-header';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { DataTable, TableColumn } from '../../shared/data-table/data-table';

// ── Mock data ──────────────────────────────────────────────────────────────────
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
const VENTAS_RAW   = [12000, 19000, 15000, 22000, 18000, 25000];
const COSTOS_RAW   = [8000,  12000, 9500,  14000, 11000, 15500];
const UTILIDAD_RAW = VENTAS_RAW.map((v, i) => v - COSTOS_RAW[i]);
const COMPRAS_RAW  = [9000,  13000, 10000, 15000, 12000, 16000];

const CATEGORIAS_LABELS   = ['Tecnología', 'Oficina', 'Limpieza', 'Alimentos', 'Otros'];
const CATEGORIAS_CANTIDAD = [45, 30, 20, 35, 15];

const TOP_PRODUCTOS = [
  { pos: 1, producto: 'Laptop Dell 15"',   cantidad: 24 },
  { pos: 2, producto: 'Silla ergonómica',  cantidad: 18 },
  { pos: 3, producto: 'Mouse inalámbrico', cantidad: 45 },
  { pos: 4, producto: 'Teclado mecánico',  cantidad: 32 },
  { pos: 5, producto: 'Monitor 27"',       cantidad: 15 },
  { pos: 6, producto: 'Hub USB-C',         cantidad: 28 },
  { pos: 7, producto: 'Auriculares BT',    cantidad: 21 },
  { pos: 8, producto: 'Webcam HD',         cantidad: 17 },
  { pos: 9, producto: 'UPS 1200VA',        cantidad: 12 },
  { pos: 10, producto: 'Switch 8 puertos', cantidad: 9  },
];

const TOP_CLIENTES = [
  { nombre: 'Empresa ABC SAC',       total: 45000 },
  { nombre: 'Comercial XYZ EIRL',    total: 38000 },
  { nombre: 'Distribuidora Sur',     total: 29500 },
  { nombre: 'Importaciones Norte',   total: 22000 },
  { nombre: 'Tech Solutions Perú',   total: 18500 },
  { nombre: 'Grupo Empresarial JM',  total: 15200 },
  { nombre: 'Logística Central',     total: 12800 },
  { nombre: 'Comercio Andino SAC',   total: 10900 },
  { nombre: 'Inversiones del Pacífico', total: 9400 },
  { nombre: 'Servicios Generales MR',   total: 7600 },
];

interface VentaHistorial {
  id: string; fecha: string; producto: string; cliente: string;
  cantidad: number; precio_unitario: number; total: number;
}

interface CompraHistorial {
  id: string; fecha: string; producto: string; proveedor: string;
  cantidad: number; precio_unitario: number; total: number;
}

const VENTAS_HISTORIAL: VentaHistorial[] = [
  { id: 'V001', fecha: '2026-06-22', producto: 'Laptop Dell 15"',   cliente: 'Empresa ABC SAC',    cantidad: 2,  precio_unitario: 2500, total: 5000 },
  { id: 'V002', fecha: '2026-06-21', producto: 'Monitor 27"',       cliente: 'Comercial XYZ EIRL', cantidad: 3,  precio_unitario: 850,  total: 2550 },
  { id: 'V003', fecha: '2026-06-20', producto: 'Mouse inalámbrico', cliente: 'Tech Solutions Perú',cantidad: 10, precio_unitario: 85,   total: 850  },
  { id: 'V004', fecha: '2026-06-19', producto: 'Teclado mecánico',  cliente: 'Distribuidora Sur',  cantidad: 5,  precio_unitario: 180,  total: 900  },
  { id: 'V005', fecha: '2026-06-18', producto: 'Silla ergonómica',  cliente: 'Empresa ABC SAC',    cantidad: 4,  precio_unitario: 320,  total: 1280 },
  { id: 'V006', fecha: '2026-06-17', producto: 'Hub USB-C',         cliente: 'Importaciones Norte',cantidad: 8,  precio_unitario: 65,   total: 520  },
  { id: 'V007', fecha: '2026-06-16', producto: 'Auriculares BT',    cliente: 'Comercio Andino SAC',cantidad: 6,  precio_unitario: 220,  total: 1320 },
  { id: 'V008', fecha: '2026-06-15', producto: 'Webcam HD',         cliente: 'Logística Central',  cantidad: 3,  precio_unitario: 190,  total: 570  },
];

const COMPRAS_HISTORIAL: CompraHistorial[] = [
  { id: 'C001', fecha: '2026-06-22', producto: 'Laptop Dell 15"',   proveedor: 'Dell Perú SAC',      cantidad: 5,  precio_unitario: 1800, total: 9000  },
  { id: 'C002', fecha: '2026-06-20', producto: 'Monitor 27"',       proveedor: 'Tech Import SAC',    cantidad: 8,  precio_unitario: 600,  total: 4800  },
  { id: 'C003', fecha: '2026-06-19', producto: 'Mouse inalámbrico', proveedor: 'Electro Sur EIRL',   cantidad: 20, precio_unitario: 45,   total: 900   },
  { id: 'C004', fecha: '2026-06-18', producto: 'Silla ergonómica',  proveedor: 'Muebles Office SAC', cantidad: 10, precio_unitario: 210,  total: 2100  },
  { id: 'C005', fecha: '2026-06-17', producto: 'Teclado mecánico',  proveedor: 'Tech Import SAC',    cantidad: 12, precio_unitario: 110,  total: 1320  },
  { id: 'C006', fecha: '2026-06-15', producto: 'Hub USB-C',         proveedor: 'Accesorios PC',      cantidad: 15, precio_unitario: 35,   total: 525   },
];

const TIPOS_GRAFICO = [
  { label: 'Líneas',          value: 'line'        },
  { label: 'Curvas',          value: 'curved-line' },
  { label: 'Barras apiladas', value: 'stacked-bar' },
];

@Component({
  selector: 'app-reports',
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ChartModule, Select, DatePickerModule, InputText, Button,
    PageHeader, KpiCard, DataTable,
  ],
})
export class Reports {

  // ── Cell template refs ─────────────────────────────────────────────────────
  readonly tplFechaVenta     = viewChild.required<TemplateRef<unknown>>('tplFechaVenta');
  readonly tplImporteVenta   = viewChild.required<TemplateRef<unknown>>('tplImporteVenta');
  readonly tplTotalVenta     = viewChild.required<TemplateRef<unknown>>('tplTotalVenta');
  readonly tplFechaCompra    = viewChild.required<TemplateRef<unknown>>('tplFechaCompra');
  readonly tplImporteCompra  = viewChild.required<TemplateRef<unknown>>('tplImporteCompra');
  readonly tplTotalCompra    = viewChild.required<TemplateRef<unknown>>('tplTotalCompra');

  // ── Filter state ───────────────────────────────────────────────────────────
  readonly tiposGrafico = TIPOS_GRAFICO;
  readonly tipoGrafico  = signal('line');
  readonly fechaInicio  = signal<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  readonly fechaFin     = signal<Date | null>(new Date());
  readonly busquedaVenta   = signal('');
  readonly busquedaCompra  = signal('');

  // ── KPIs ───────────────────────────────────────────────────────────────────
  readonly totalVentas  = VENTAS_RAW.reduce((a, b) => a + b, 0);
  readonly totalCostos  = COSTOS_RAW.reduce((a, b) => a + b, 0);
  readonly totalUtilidad = UTILIDAD_RAW.reduce((a, b) => a + b, 0);
  readonly totalCompras  = COMPRAS_RAW.reduce((a, b) => a + b, 0);

  // ── Chart data ─────────────────────────────────────────────────────────────
  readonly resumenChartType = computed<'line' | 'bar'>(() =>
    this.tipoGrafico() === 'stacked-bar' ? 'bar' : 'line'
  );

  readonly resumenChartData = computed(() => {
    const tension = this.tipoGrafico() === 'curved-line' ? 0.4 : 0;
    return {
      labels: MESES,
      datasets: [
        { label: 'Ventas',   data: VENTAS_RAW,   borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.12)',  fill: true, tension },
        { label: 'Costos',   data: COSTOS_RAW,   borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.12)',   fill: true, tension },
        { label: 'Utilidad', data: UTILIDAD_RAW, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)',  fill: true, tension },
        { label: 'Compras',  data: COMPRAS_RAW,  borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)',  fill: true, tension },
      ],
    };
  });

  readonly resumenChartOpts = computed(() => {
    const stacked = this.tipoGrafico() === 'stacked-bar';
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (ctx: any) => ` ${ctx.dataset.label}: S/ ${Number(ctx.parsed.y).toLocaleString('es-PE')}`,
          },
        },
      },
      scales: {
        x: { stacked },
        y: {
          stacked,
          ticks: { callback: (v: any) => `S/ ${Number(v).toLocaleString('es-PE')}` },
        },
      },
    };
  });

  readonly donutData = {
    labels: CATEGORIAS_LABELS,
    datasets: [{
      data: CATEGORIAS_CANTIDAD,
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    }],
  };

  readonly donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } },
  };

  // ── Top tables ─────────────────────────────────────────────────────────────
  readonly topProductos = TOP_PRODUCTOS;
  readonly topClientes  = TOP_CLIENTES;

  // ── Historial columns (computed so templates are resolved) ─────────────────
  readonly columnsVentas = computed<TableColumn[]>(() => [
    { key: 'fecha',           label: 'Fecha',       cellTemplate: this.tplFechaVenta()   },
    { key: 'producto',        label: 'Producto',    class: 'max-w-48 truncate'            },
    { key: 'cliente',         label: 'Cliente'                                            },
    { key: 'cantidad',        label: 'Cant.',       class: 'text-center'                  },
    { key: 'precio_unitario', label: 'P. Unit.',    cellTemplate: this.tplImporteVenta()  },
    { key: 'total',           label: 'Total',       cellTemplate: this.tplTotalVenta()    },
  ]);

  readonly columnsCompras = computed<TableColumn[]>(() => [
    { key: 'fecha',           label: 'Fecha',       cellTemplate: this.tplFechaCompra()   },
    { key: 'producto',        label: 'Producto',    class: 'max-w-48 truncate'             },
    { key: 'proveedor',       label: 'Proveedor'                                           },
    { key: 'cantidad',        label: 'Cant.',       class: 'text-center'                   },
    { key: 'precio_unitario', label: 'P. Unit.',    cellTemplate: this.tplImporteCompra()  },
    { key: 'total',           label: 'Total',       cellTemplate: this.tplTotalCompra()    },
  ]);

  readonly ventasFiltradas = computed<VentaHistorial[]>(() => {
    const q = this.busquedaVenta().toLowerCase();
    if (!q) return VENTAS_HISTORIAL;
    return VENTAS_HISTORIAL.filter(v =>
      v.producto.toLowerCase().includes(q) || v.cliente.toLowerCase().includes(q)
    );
  });

  readonly comprasFiltradas = computed<CompraHistorial[]>(() => {
    const q = this.busquedaCompra().toLowerCase();
    if (!q) return COMPRAS_HISTORIAL;
    return COMPRAS_HISTORIAL.filter(c =>
      c.producto.toLowerCase().includes(q) || c.proveedor.toLowerCase().includes(q)
    );
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  fmtNum(n: number)  { return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`; }
  fmtDate(s: string) {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
