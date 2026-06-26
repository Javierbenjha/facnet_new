import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-branding',
  templateUrl: './auth-branding.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ':host { display: contents; }',
})
export class AuthBranding {}
