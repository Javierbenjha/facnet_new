import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

import { routes } from './app.routes';

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
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: AppTheme, options: { darkModeSelector: '.dark' } },
      overlayOptions: { appendTo: 'body' },
    }),
  ]
};
