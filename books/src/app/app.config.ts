import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideGermanLocale } from './locale';

export const appConfig: ApplicationConfig = {
  providers: [
    provideGermanLocale(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    // withComponentInputBinding: Routen-Parameter (z. B. :isbn) werden direkt
    // an gleichnamige Komponenten-Inputs gebunden.
    provideRouter(routes, withComponentInputBinding()),
  ],
};
