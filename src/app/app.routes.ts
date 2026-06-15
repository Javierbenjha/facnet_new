import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'ventas',
        pathMatch: 'full'
      },
      // Ventas y sus sub-rutas
      {
        path: 'ventas',
        loadComponent: () => import('./features/ventas/ventas').then(m => m.Ventas)
      },
      {
        path: 'ventas/nueva',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'ventas/historial',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'ventas/parte-caja',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'ventas/garantia',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'caja-chica',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'caja-chica/listado',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'cobranzas',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'cobranzas/:idCia/:tipo_doc/:serie/:correlativo',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'cobranzas/:id',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'listar-cobranzas',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'pagos',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'list-pago',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'proformas',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'guias',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'guias/listado',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },

      // Compras y sus sub-rutas
      {
        path: 'compras',
        loadComponent: () => import('./features/compras/compras').then(m => m.Compras)
      },
      {
        path: 'compras/registrar',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'compras/historial',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },

      // Inventario y sus sub-rutas
      {
        path: 'inventario',
        loadComponent: () => import('./features/inventario/inventario').then(m => m.Inventario)
      },
      {
        path: 'productos',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },
      {
        path: 'regular-stock',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },

      // Maestros y sus sub-rutas
      {
        path: 'maestros',
        loadComponent: () => import('./features/maestros/maestros').then(m => m.Maestros)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./shared/placeholder/placeholder').then(m => m.Placeholder)
      },

      // Alertas
      {
        path: 'alertas',
        loadComponent: () => import('./features/alertas/alertas').then(m => m.Alertas)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
