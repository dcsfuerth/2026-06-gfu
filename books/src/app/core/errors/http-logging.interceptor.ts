import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { Logger } from '../logging';
import { AppError } from './app-error';

/** Header, über den sich ein Request im Server-Protokoll wiederfinden lässt. */
export const REQUEST_ID_HEADER = 'X-Request-Id';

/**
 * Protokolliert jeden HTTP-Aufruf mit Korrelations-ID, Status und Dauer.
 * Steht in der Interceptor-Kette vor der Fehlerbehandlung und sieht daher
 * das Endergebnis inklusive aller Wiederholungen.
 */
export const httpLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  const log = inject(Logger).withContext('Http');
  const requestId = crypto.randomUUID();
  const started = performance.now();
  const label = `${req.method} ${req.urlWithParams}`;

  log.debug(`→ ${label}`, { requestId });

  return next(req.clone({ setHeaders: { [REQUEST_ID_HEADER]: requestId } })).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          log.info(`← ${label} ${event.status} (${elapsed(started)} ms)`, { requestId });
        }
      },
      error: (error: unknown) => {
        const status = statusOf(error);
        const level = status !== undefined && status >= 400 && status < 500 ? 'warn' : 'error';
        log[level](`✕ ${label} ${status ?? 'ohne Antwort'} (${elapsed(started)} ms)`, {
          requestId,
          error: error instanceof Error ? error.message : error,
        });
      },
    }),
  );
};

function elapsed(started: number): number {
  return Math.round(performance.now() - started);
}

function statusOf(error: unknown): number | undefined {
  if (error instanceof AppError) {
    return error.details.status;
  }
  if (error instanceof HttpErrorResponse) {
    return error.status;
  }
  return undefined;
}
