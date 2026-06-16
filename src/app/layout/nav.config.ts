export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', icon: 'pi-th-large', route: '/sales' },
    ],
  },
  {
    label: 'Organization',
    items: [
      { label: 'Companies',   icon: 'pi-building', route: '/company-branch', badge: 3 },
      { label: 'Users',       icon: 'pi-user-plus', route: '/user-registration', badge: 2 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Products',              icon: 'pi-box',           route: '/products' },
      { label: 'Sales Point',           icon: 'pi-shopping-cart', route: '/sales' },
      { label: 'Sales History',         icon: 'pi-history',       route: '/sale-list' },
      { label: 'Purchases',             icon: 'pi-tag',           route: '/purchases' },
      { label: 'Quotations',            icon: 'pi-file',          route: '/quotations', badge: 2 },
      { label: 'Customers & Suppliers', icon: 'pi-users',         route: '/customers-suppliers' },
      { label: 'Units of Measure',      icon: 'pi-sliders-h',     route: '/unit-measures' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Reports',      icon: 'pi-chart-bar', route: '/reports' },
      { label: 'Settings',     icon: 'pi-cog',       route: '/settings' },
    ],
  },
];
