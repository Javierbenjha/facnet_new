import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-branding',
  templateUrl: './auth-branding.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthBranding {
  readonly year = new Date().getFullYear();
  readonly features = [
    'Facturación electrónica integrada',
    'Control de inventario en tiempo real',
    'Reportes y dashboards al instante',
  ];
}
