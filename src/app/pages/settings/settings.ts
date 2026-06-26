import { Component, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { PageHeader } from '../../shared/page-header/page-header';
import { DocumentsModal } from './documents-modal/documents-modal';
import { CategoriesModal } from './categories-modal/categories-modal';
import { BrandsModal } from './brands-modal/brands-modal';
import { UnitsModal } from './units-modal/units-modal';
import { TransportCompanyModal } from "./transport-company-modal/transport-company-modal";

interface SettingAction {
  label: string;
  icon: string;
}

interface SettingModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  actions: SettingAction[];
}

interface SettingSection {
  id: string;
  label: string;
  icon: string;
  modules: SettingModule[];
}

const SECTIONS: SettingSection[] = [
  {
    id: 'catalogo',
    label: 'Catálogo',
    icon: 'pi pi-box',
    modules: [
      {
        id: 'documento',
        title: 'Documentos',
        description: 'Gestionar los documentos disponibles en el sistema.',
        icon: 'pi pi-file',
        actions: [
          { label: 'Listar documentos', icon: 'pi pi-list' },
        ],
      },
      {
        id: 'categoria',
        title: 'Categorías',
        description: 'Organizar los productos por categorías.',
        icon: 'pi pi-tag',
        actions: [
          { label: 'Administrar categorías', icon: 'pi pi-sliders-h' },
        ],
      },
      {
        id: 'marca',
        title: 'Marcas',
        description: 'Gestionar las marcas de los productos.',
        icon: 'pi pi-verified',
        actions: [
          { label: 'Administrar marcas', icon: 'pi pi-sliders-h' },
        ],
      },
      {
        id: 'unidad',
        title: 'Unidades de medida',
        description: 'Configurar las unidades con las que se trabajan los productos.',
        icon: 'pi pi-calculator',
        actions: [
          { label: 'Administrar unidades', icon: 'pi pi-sliders-h' },
        ],
      },
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: 'pi pi-wallet',
    modules: [
      {
        id: 'moneda',
        title: 'Monedas',
        description: 'Activar o desactivar las divisas del sistema para ventas y compras.',
        icon: 'pi pi-dollar',
        actions: [
          { label: 'Administrar monedas', icon: 'pi pi-sliders-h' },
        ],
      },
      {
        id: 'tipo-cambio',
        title: 'Tipo de cambio',
        description: 'Configurar el valor de cambio entre soles y dólares.',
        icon: 'pi pi-arrow-right-arrow-left',
        actions: [
          { label: 'Registrar tipo de cambio', icon: 'pi pi-plus' },
        ],
      },
      {
        id: 'banco',
        title: 'Entidades bancarias',
        description: 'Configurar los bancos con los que trabajás.',
        icon: 'pi pi-building',
        actions: [
          { label: 'Crear banco',   icon: 'pi pi-plus' },
          { label: 'Listar bancos', icon: 'pi pi-list' },
        ],
      },
      {
        id: 'billetera',
        title: 'Billeteras digitales',
        description: 'Configurar las billeteras digitales de pago.',
        icon: 'pi pi-mobile',
        actions: [
          { label: 'Crear billetera',   icon: 'pi pi-plus' },
          { label: 'Listar billeteras', icon: 'pi pi-list' },
        ],
      },
      {
        id: 'metodo-pago',
        title: 'Métodos de pago',
        description: 'Configurar los métodos con los que se realizarán las cobranzas.',
        icon: 'pi pi-credit-card',
        actions: [
          { label: 'Listar métodos', icon: 'pi pi-list' },
        ],
      },
    ],
  },
  {
    id: 'documentacion',
    label: 'Documentación',
    icon: 'pi pi-file-edit',
    modules: [
      {
        id: 'tipo-documento',
        title: 'Documentos de emisión',
        description: 'Activar o desactivar los documentos para ventas y compras (facturas, boletas, notas de crédito, etc.).',
        icon: 'pi pi-receipt',
        actions: [
          { label: 'Administrar documentos', icon: 'pi pi-sliders-h' },
        ],
      },
      {
        id: 'nota-debito',
        title: 'Conceptos de Nota de Débito',
        description: 'Gestionar los conceptos utilizados en las Notas de Débito.',
        icon: 'pi pi-file-plus',
        actions: [
          { label: 'Crear concepto',   icon: 'pi pi-plus' },
          { label: 'Listar conceptos', icon: 'pi pi-list' },
        ],
      },
      {
        id: 'igv',
        title: 'IGV en venta',
        description: 'Configurar si los productos en venta incluyen IGV o no.',
        icon: 'pi pi-percentage',
        actions: [
          { label: 'Activar / Desactivar IGV', icon: 'pi pi-sliders-h' },
        ],
      },
    ],
  },
  {
    id: 'logistica',
    label: 'Logística',
    icon: 'pi pi-truck',
    modules: [
      {
        id: 'conductor',
        title: 'Conductores',
        description: 'Gestionar los conductores registrados en el sistema.',
        icon: 'pi pi-id-card',
        actions: [
          { label: 'Crear conductor',   icon: 'pi pi-plus' },
          { label: 'Listar conductores', icon: 'pi pi-list' },
        ],
      },
      {
        id: 'transportista',
        title: 'Transportistas',
        description: 'Gestionar las empresas y personas de transporte.',
        icon: 'pi pi-truck',
        actions: [
          { label: 'Administrar transportistas', icon: 'pi pi-sliders-h' },
        ],
      },
    ],
  },
  {
    id: 'operaciones',
    label: 'Operaciones',
    icon: 'pi pi-cog',
    modules: [
      {
        id: 'motivo-caja',
        title: 'Motivos de Caja Chica',
        description: 'Gestionar los motivos de ingreso y egreso para cada documento de caja chica.',
        icon: 'pi pi-money-bill',
        actions: [
          { label: 'Crear motivo',   icon: 'pi pi-plus' },
          { label: 'Listar motivos', icon: 'pi pi-list' },
        ],
      },
      {
        id: 'password',
        title: 'Contraseña para la venta',
        description: 'Activar o desactivar una contraseña de seguridad para realizar ventas.',
        icon: 'pi pi-lock',
        actions: [
          { label: 'Activar / Desactivar', icon: 'pi pi-sliders-h' },
        ],
      },
    ],
  },
  {
    id: 'impresion',
    label: 'Impresión',
    icon: 'pi pi-print',
    modules: [
      {
        id: 'impresora',
        title: 'Impresoras',
        description: 'Configurar y seleccionar las impresoras de tu sucursal.',
        icon: 'pi pi-print',
        actions: [
          { label: 'Agregar impresora',   icon: 'pi pi-plus' },
          { label: 'Listar impresoras', icon: 'pi pi-list' },
        ],
      },
      {
        id: 'ticket',
        title: 'Formato de ticket',
        description: 'Imprimir pruebas de ticket para verificar el formato de tus dispositivos.',
        icon: 'pi pi-barcode',
        actions: [
          { label: 'Probar impresión', icon: 'pi pi-send' },
        ],
      },
    ],
  },
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  imports: [Button, Card, PageHeader, DocumentsModal, CategoriesModal, BrandsModal, UnitsModal, TransportCompanyModal],
})
export class Settings {
  readonly sections = SECTIONS;
  readonly activeSection      = signal(SECTIONS[0].id);
  readonly documentsVisible   = signal(false);
  readonly categoriesVisible  = signal(false);
  readonly brandsVisible      = signal(false);
  readonly unitsVisible       = signal(false);
  readonly transportCompanyVisible = signal(false);
  readonly currentSection = () =>
    this.sections.find(s => s.id === this.activeSection()) ?? this.sections[0];

  handleAction(moduleId: string) {
    if (moduleId === 'documento')  this.documentsVisible.set(true);
    if (moduleId === 'categoria')  this.categoriesVisible.set(true);
    if (moduleId === 'marca')      this.brandsVisible.set(true);
    if (moduleId === 'unidad')     this.unitsVisible.set(true);
    if (moduleId === 'transportista') this.transportCompanyVisible.set(true);
  }
}
