import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const user = auth.currentUser();

  if (!user) {
    return true;
  }

  if (user.role === 1 && !auth.activeCompany()) {
    return router.createUrlTree(['/company-setup']);
  }

  return router.createUrlTree(['/sales']);
};
