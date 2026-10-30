import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
} from '@angular/core';
import {
  RouterFeatures,
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withNavigationErrorHandler,
} from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import {
  AppError,
  GlobalErrorHandler,
  httpErrorInterceptor,
  httpLoggingInterceptor,
} from './core/errors';
import { Logger, provideLogging } from './core/logging';
import { Notifications } from './core/notifications/notifications.service';
import { provideRouterLogging } from './core/router/router-logging.providers';
import { provideGermanLocale } from './locale.providers';

const routerFeatures: RouterFeatures[] = [
  // Routen-Parameter (z. B. :isbn) werden direkt an gleichnamige Komponenten-Inputs gebunden.
  withComponentInputBinding(),
  // Fehler beim Navigieren (z. B. fehlgeschlagener Lazy-Load) landen im Protokoll und als Toast.
  withNavigationErrorHandler((error) => {
    const appError = AppError.from(error.error);
    inject(Logger)
      .withContext('Router')
      .error(`Navigation nach ${error.url} fehlgeschlagen`, appError);
    inject(Notifications).error('Die Seite konnte nicht geladen werden.');
  }),
];

if (environment.routerDebugTracing) {
  routerFeatures.push(withDebugTracing());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideGermanLocale(),
    provideLogging({ level: environment.logLevel }),
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(
      withFetch(),
      withInterceptors([httpLoggingInterceptor, httpErrorInterceptor]),
    ),
    provideRouter(routes, ...routerFeatures),
    provideRouterLogging(),
    // Entwicklungsmodus: zusätzliche Prüfung auf Änderungen nach der Change Detection.
    ...(environment.production ? [] : [provideCheckNoChangesConfig({ exhaustive: true })]),
  ],
};
