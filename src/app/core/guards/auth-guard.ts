import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

  export const authGuard: CanActivateFn = (_route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);

    console.log('[guard] state.url =', state.url);
    console.log('[guard] currentUser =', auth.currentUser());

    if (auth.currentUser()) return true;

    const tree = router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    console.log('[guard] redirijo a =', tree.toString());
    return tree;
  };
