import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface AccountOption {
  id: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonModule],
})
export class UserProfile {
  // Static options for now — functionality is wired in later tasks.
  readonly accountOptions: AccountOption[] = [
    {
      id: 'change-password',
      icon: 'pi pi-key',
      title: 'Cambiar Contraseña',
      description: 'Actualiza tu contraseña',
    },
    {
      id: 'sales-confirmation',
      icon: 'pi pi-shield',
      title: 'Contraseña de confirmación de Ventas',
      description: 'Configuración de seguridad para tus ventas',
    },
    {
      id: 'notification-history',
      icon: 'pi pi-bell',
      title: 'Historial de Notificaciones',
      description: 'Revisa tus notificaciones',
    },
  ];
}
