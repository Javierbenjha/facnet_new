import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { companySetupGuard } from './core/guards/company-setup-guard';

export const routes: Routes = [
  // ─── Auth Pages (Without Sidenav/Header Shell) ─────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then(m => m.Register)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password').then(m => m.ForgotPassword)
  },
  {
    path: 'sms-verification',
    loadComponent: () => import('./pages/auth/sms-verification/sms-verification').then(m => m.SmsVerification)
  },
  {
    path: 'confirm-password',
    loadComponent: () => import('./pages/auth/confirm-password/confirm-password').then(m => m.ConfirmPassword)
  },
  {
    path: 'company-setup',
    canActivate: [companySetupGuard],
    loadComponent: () => import('./pages/auth/company-setup/company-setup').then(m => m.CompanySetup)
  },

  // ─── Main App Layout (With Sidenav/Header Shell) ───────────────────────
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'sales',
        pathMatch: 'full'
      },


     /*  {
        path: 'company',
        loadComponent: () => import('./pages/company/company').then(m => m.Company)
      }, */
      // ─── Dashboard (landing, not a backend menu item) ──────────────────────
      {
        path: 'sales',
        loadComponent: () => import('./features/sales/sales').then(m => m.Sales)
      },

      // ─── Backend menu modules (routes match GET /modulos) ──────────────────
      {
        // "Realizar Venta" (POS)
        path: 'ventas',
        loadComponent: () => import('./pages/sale/sale').then(m => m.Sale)
      },
      {
        // "Ventas Realizadas"
        path: 'ventas-historial',
        loadComponent: () => import('./pages/sale-list/sale-list').then(m => m.SaleList)
      },
      {
        // "Guías de remisión"
        path: 'guias',
        loadComponent: () => import('./pages/referral-guide/referral-guide').then(m => m.ReferralGuide)
      },
      {
        // "Proformas"
        path: 'proformas',
        loadComponent: () => import('./pages/quotations/quotations').then(m => m.Quotations)
      },
      {
        // "Compras"
        path: 'compras',
        loadComponent: () => import('./pages/purchase-list/purchase-list').then(m => m.PurchaseList)
      },
      {
        // "Reportes"
        path: 'reportes',
        loadComponent: () => import('./pages/reports/reports').then(m => m.Reports)
      },
      {
        // "Clientes y Proveedores"
        path: 'clientes',
        loadComponent: () => import('./pages/customers-suppliers/customers-suppliers').then(m => m.CustomersSuppliers)
      },
      {
        // "Productos y Servicios"
        path: 'productos',
        loadComponent: () => import('./pages/products/products').then(m => m.Products)
      },
      {
        // "Compañía y Sucursal"
        path: 'empresa',
        loadComponent: () => import('./pages/company-branch/company-branch').then(m => m.CompanyBranch)
      },
      {
        // "Configuración"
        path: 'config',
        loadComponent: () => import('./pages/settings/settings').then(m => m.Settings)
      },
      {
        // "Crear Usuario"
        path: 'usuarios',
        loadComponent: () => import('./pages/user-registration/user-registration').then(m => m.UserRegistration)
      },
      {
        // "Sire"
        path: 'sire',
        loadComponent: () => import('./pages/login-sire/login-sire').then(m => m.LoginSire)
      },
      {
        // "Caja Chica"
        path: 'caja-chica',
        loadComponent: () => import('./pages/petty-cash/petty-cash').then(m => m.PettyCash)
      },
      {
        // "Roles" (placeholder — falta el componente real)
        path: 'roles',
        loadComponent: () => import('./pages/roles/roles').then(m => m.Roles)
      },

      // ─── Secondary pages (not in backend menu, kept as-is) ─────────────────
      {
        path: 'user-profile',
        loadComponent: () => import('./pages/user-profile/user-profile').then(m => m.UserProfile)
      },
      {
        path: 'support',
        loadComponent: () => import('./pages/support/support').then(m => m.Support)
      },
      {
        path: 'content-sire',
        loadComponent: () => import('./pages/content-sire/content-sire').then(m => m.ContentSire)
      },
      {
        path: 'notification-history',
        loadComponent: () => import('./pages/notification-history/notification-history').then(m => m.NotificationHistory)
      },
      {
        path: 'cash-report',
        loadComponent: () => import('./pages/cash-report/cash-report').then(m => m.CashReport)
      },
      {
        path: 'warranty',
        loadComponent: () => import('./pages/warranty/warranty').then(m => m.Warranty)
      },
      {
        path: 'petty-cash/list',
        loadComponent: () => import('./pages/petty-cash-list/petty-cash-list').then(m => m.PettyCashList)
      },
      {
        path: 'collection',
        loadComponent: () => import('./pages/collection/collection').then(m => m.Collection)
      },
      {
        path: 'collection/:idCia/:tipo_doc/:serie/:correlativo',
        loadComponent: () => import('./pages/collection/collection').then(m => m.Collection)
      },
      {
        path: 'collection/:id',
        loadComponent: () => import('./pages/collection/collection').then(m => m.Collection)
      },
      {
        path: 'collection-list',
        loadComponent: () => import('./pages/collection-list/collection-list').then(m => m.CollectionList)
      },
      {
        path: 'payments',
        loadComponent: () => import('./pages/payments/payments').then(m => m.Payments)
      },
      {
        path: 'payment-list',
        loadComponent: () => import('./pages/payment-list/payment-list').then(m => m.PaymentList)
      },
      {
        path: 'referral-guide/list',
        loadComponent: () => import('./pages/referral-guide-list/referral-guide-list').then(m => m.ReferralGuideList)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./features/inventory/inventory').then(m => m.Inventory)
      },
      {
        path: 'stock-adjustment',
        loadComponent: () => import('./pages/stock-adjustment/stock-adjustment').then(m => m.StockAdjustment)
      },
      {
        path: 'catalogs',
        loadComponent: () => import('./features/catalogs/catalogs').then(m => m.Catalogs)
      },
      {
        path: 'unit-measures',
        loadComponent: () => import('./pages/unit-measures/unit-measures').then(m => m.UnitMeasures)
      },
      {
        path: 'alerts',
        loadComponent: () => import('./features/alerts/alerts').then(m => m.Alerts)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
