import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Logger } from '../logging';
import { Notifications } from '../notifications/notifications.service';
import { AppError } from './app.error';

/** Gleiche Meldungen innerhalb dieses Zeitfensters werden nur einmal angezeigt. */
const DUPLICATE_WINDOW_MS = 3_000;

/**
 * Zentrale Anlaufstelle für alle unbehandelten Fehler: aus Event-Handlern,
 * Promises, Effects und Templates (über `provideBrowserGlobalErrorListeners`
 * auch aus `window.onerror`/`unhandledrejection`).
 *
 * Protokolliert technisch vollständig und zeigt der Nutzerin eine kurze,
 * verständliche Meldung. Wirft selbst nie.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly log = inject(Logger).withContext('ErrorHandler');
  private readonly notifications = inject(Notifications);

  private lastMessage = '';
  private lastShownAt = 0;

  handleError(error: unknown): void {
    try {
      const appError = AppError.from(unwrap(error));

      this.log.error(`${appError.kind}: ${appError.message}`, {
        status: appError.details.status,
        url: appError.details.url,
        cause: appError.details.cause ?? error,
        stack:
          appError.details.cause instanceof Error ? appError.details.cause.stack : appError.stack,
      });

      const now = Date.now();
      if (appError.message !== this.lastMessage || now - this.lastShownAt > DUPLICATE_WINDOW_MS) {
        this.notifications.error(appError.message);
        this.lastMessage = appError.message;
        this.lastShownAt = now;
      }
    } catch {
      // Ein Fehler im Fehlerhandler darf die Anwendung nicht zusätzlich stören.
    }
  }
}

/** Angular und Browser verpacken Fehler teils in Hüllobjekte. */
function unwrap(error: unknown): unknown {
  if (typeof error === 'object' && error !== null && 'rejection' in error) {
    return (error as { rejection: unknown }).rejection;
  }
  return error;
}
