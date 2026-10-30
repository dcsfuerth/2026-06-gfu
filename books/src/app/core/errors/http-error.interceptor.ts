import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TimeoutError, retry, throwError, timeout, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Logger } from '../logging';
import { AppError } from './app-error';

/** Zeitlimit je Versuch in Millisekunden; pro Request über `HttpContext` überschreibbar. */
export const REQUEST_TIMEOUT = new HttpContextToken<number>(() => 10_000);

/** Anzahl der Wiederholungen für GET-Requests bei vorübergehenden Fehlern. */
export const RETRY_COUNT = new HttpContextToken<number>(() => 2);

const RETRY_BASE_DELAY_MS = 300;

/**
 * Technische Fehlerbehandlung für alle HTTP-Aufrufe:
 * 1. Zeitlimit je Versuch (`each`: HttpClient meldet sofort ein `Sent`-Ereignis,
 *    daher darf nicht auf die *erste* Emission gewartet werden)
 * 2. Wiederholung mit exponentiellem Backoff, nur für GET und nur bei
 *    vorübergehenden Fehlern (Netzwerk, Timeout, 5xx)
 * 3. Übersetzung in eine `AppError` mit verständlicher Meldung
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const log = inject(Logger).withContext('Http');
  const timeoutMs = req.context.get(REQUEST_TIMEOUT);
  const retries = req.method === 'GET' ? req.context.get(RETRY_COUNT) : 0;

  return next(req).pipe(
    timeout({ each: timeoutMs }),
    retry({
      count: retries,
      delay: (error: unknown, retryCount: number) => {
        if (!isTransient(error)) {
          return throwError(() => error);
        }
        const delayMs = RETRY_BASE_DELAY_MS * 2 ** (retryCount - 1);
        log.warn(
          `Wiederhole ${req.method} ${req.urlWithParams} in ${delayMs} ms (Versuch ${retryCount + 1})`,
          {
            reason: describe(error),
          },
        );
        return timer(delayMs);
      },
    }),
    catchError((error: unknown) => throwError(() => AppError.from(error, req.urlWithParams))),
  );
};

function isTransient(error: unknown): boolean {
  if (error instanceof TimeoutError) {
    return true;
  }
  if (error instanceof HttpErrorResponse) {
    return error.status === 0 || error.status >= 500;
  }
  return false;
}

function describe(error: unknown): string {
  if (error instanceof TimeoutError) {
    return 'timeout';
  }
  if (error instanceof HttpErrorResponse) {
    return `HTTP ${error.status}`;
  }
  return error instanceof Error ? error.message : String(error);
}
