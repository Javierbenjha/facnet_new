import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SubModule {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.html',
  styleUrl: './ventas.scss',
  imports: [RouterLink]
})
export class Ventas {
  protected readonly subModules: SubModule[] = [
    { title: 'Nueva Venta', description: 'Registrar una nueva venta en el sistema', icon: 'pi-plus-circle', route: '/ventas/nueva' },
    { title: 'Historial', description: 'Listar y consultar ventas anteriores', icon: 'pi-history', route: '/ventas/historial' },
    { title: 'Parte de Caja', description: 'Gestionar el cuadre y movimientos de caja', icon: 'pi-wallet', route: '/ventas/parte-caja' },
    { title: 'Caja Chica', description: 'Control de caja chica y listado de egresos', icon: 'pi-calculator', route: '/caja-chica' },
    { title: 'Cobranzas', description: 'Módulo de cobranzas y cuentas por cobrar', icon: 'pi-money-bill', route: '/cobranzas' },
    { title: 'Pagos y Abonos', description: 'Listado y registro de cobros', icon: 'pi-percentage', route: '/pagos' },
    { title: 'Proformas', description: 'Generar cotizaciones y proformas', icon: 'pi-file', route: '/proformas' },
    { title: 'Guías de Remisión', description: 'Emitir guías y consultar historial', icon: 'pi-truck', route: '/guias' },
    { title: 'Reportes de Venta', description: 'Estadísticas e informes detallados', icon: 'pi-chart-bar', route: '/reportes' }
  ];
}
