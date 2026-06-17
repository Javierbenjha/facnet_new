import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

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
    loadComponent: () => import('./pages/auth/company-setup/company-setup').then(m => m.CompanySetup)
  },

  // ─── Main App Layout (With Sidenav/Header Shell) ───────────────────────
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'sales',
        pathMatch: 'full'
      },
      // ─── Core Pages ────────────────────────────────────────────────────────
      {
        path: 'user-profile',
        loadComponent: () => import('./pages/user-profile/user-profile').then(m => m.UserProfile)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then(m => m.Settings)
      },
      {
        path: 'company-branch',
        loadComponent: () => import('./pages/company-branch/company-branch').then(m => m.CompanyBranch)
      },
      {
        path: 'user-registration',
        loadComponent: () => import('./pages/user-registration/user-registration').then(m => m.UserRegistration)
      },
      {
        path: 'support',
        loadComponent: () => import('./pages/support/support').then(m => m.Support)
      },
      {
        path: 'login-sire',
        loadComponent: () => import('./pages/login-sire/login-sire').then(m => m.LoginSire)
      },
      {
        path: 'content-sire',
        loadComponent: () => import('./pages/content-sire/content-sire').then(m => m.ContentSire)
      },
      {
        path: 'notification-history',
        loadComponent: () => import('./pages/notification-history/notification-history').then(m => m.NotificationHistory)
      },

      // ─── Sales Pages ───────────────────────────────────────────────────────
      {
        path: 'sales',
        loadComponent: () => import('./features/sales/sales').then(m => m.Sales)
      },
      {
        path: 'pos',
        loadComponent: () => import('./pages/sale/sale').then(m => m.Sale)
      },
      {
        path: 'sale-list',
        loadComponent: () => import('./pages/sale-list/sale-list').then(m => m.SaleList)
      },
      {
        path: 'purchase-list',
        redirectTo: 'purchases',
        pathMatch: 'full'
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
        path: 'petty-cash',
        loadComponent: () => import('./pages/petty-cash/petty-cash').then(m => m.PettyCash)
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
        path: 'quotations',
        loadComponent: () => import('./pages/quotations/quotations').then(m => m.Quotations)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports').then(m => m.Reports)
      },
      {
        path: 'referral-guide',
        loadComponent: () => import('./pages/referral-guide/referral-guide').then(m => m.ReferralGuide)
      },
      {
        path: 'referral-guide/list',
        loadComponent: () => import('./pages/referral-guide-list/referral-guide-list').then(m => m.ReferralGuideList)
      },

      // ─── Purchases Pages ───────────────────────────────────────────────────
      {
        path: 'purchases',
        loadComponent: () => import('./pages/purchase-list/purchase-list').then(m => m.PurchaseList)
      },

      // ─── Inventory Pages ───────────────────────────────────────────────────
      {
        path: 'inventory',
        loadComponent: () => import('./features/inventory/inventory').then(m => m.Inventory)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products').then(m => m.Products)
      },
      {
        path: 'stock-adjustment',
        loadComponent: () => import('./pages/stock-adjustment/stock-adjustment').then(m => m.StockAdjustment)
      },

      // ─── Catalogs Pages ────────────────────────────────────────────────────
      {
        path: 'catalogs',
        loadComponent: () => import('./features/catalogs/catalogs').then(m => m.Catalogs)
      },
      {
        path: 'customers-suppliers',
        loadComponent: () => import('./pages/customers-suppliers/customers-suppliers').then(m => m.CustomersSuppliers)
      },
      {
        path: 'unit-measures',
        loadComponent: () => import('./pages/unit-measures/unit-measures').then(m => m.UnitMeasures)
      },

      // ─── Alerts ────────────────────────────────────────────────────────────
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
