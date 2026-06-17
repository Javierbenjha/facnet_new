import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

import { ConfirmationService, MessageService } from 'primeng/api';
import { routes } from './app.routes';
import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { Auth } from './core/services/auth';
import { catchError, of } from 'rxjs';

const AppTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#e8f4fb',
      100: '#c5e3f5',
      200: '#9fcfee',
      300: '#6db5e4',
      400: '#3d9bd9',
      500: '#0971B8',
      600: '#0862a1',
      700: '#06528a',
      800: '#054272',
      900: '#03325a',
      950: '#021e38',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    provideAnimationsAsync(),
    MessageService,
    ConfirmationService,
    providePrimeNG({
      theme: { preset: AppTheme, options: { darkModeSelector: '.dark' } },
      overlayOptions: { appendTo: 'body' },
    }),
    provideAppInitializer(() => {
      const auth = inject(Auth);
      return auth.me().pipe(catchError(() => of(null)));
    })
  ]
};
