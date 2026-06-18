import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRouter, withDebugTracing, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

registerLocaleData(localeDe, "de-DE", localeDeExtra);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: "de-DE" },
    { provide: DEFAULT_CURRENCY_CODE, useValue: "EUR" },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), // , withHashLocation(), withDebugTracing()
    importProvidersFrom(FormsModule)
  ]
};
