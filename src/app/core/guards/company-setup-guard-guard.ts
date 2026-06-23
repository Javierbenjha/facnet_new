import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const companySetupGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = auth.currentUser();
  const activeCompany = auth.activeCompany();

  // Si no está autenticado, redirigir a login
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  // Solo los dueños (role === 1) pueden configurar empresas
  if (user.role !== 1) {
    return router.createUrlTree(['/sales']);
  }

  // Si ya cuenta con una empresa activa, no debe volver aconfigurar
  if (activeCompany) {
    return router.createUrlTree(['/sales']);
  }

  return true;
};
