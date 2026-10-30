import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';

export type AppErrorKind = 'offline' | 'timeout' | 'not-found' | 'client' | 'server' | 'unknown';

/**
 * Fachlich aufbereiteter Fehler mit verständlicher Meldung. Der technische
 * Ursprung bleibt über `cause` erhalten.
 */
export class AppError extends Error {
  override readonly name = 'AppError';

  constructor(
    readonly kind: AppErrorKind,
    message: string,
    readonly details: {
      readonly status?: number;
      readonly url?: string;
      readonly cause?: unknown;
    } = {},
  ) {
    super(message, { cause: details.cause });
  }

  /** Normalisiert beliebige Fehlerobjekte zu einer `AppError`. */
  static from(error: unknown, url?: string): AppError {
    if (error instanceof AppError) {
      return error;
    }
    if (error instanceof TimeoutError) {
      return new AppError('timeout', 'Der Server hat nicht rechtzeitig geantwortet.', {
        url,
        cause: error,
      });
    }
    if (error instanceof HttpErrorResponse) {
      return AppError.fromHttp(error);
    }
    const message = error instanceof Error ? error.message : String(error);
    return new AppError('unknown', message || 'Unbekannter Fehler', { url, cause: error });
  }

  static fromHttp(error: HttpErrorResponse): AppError {
    const details = { status: error.status, url: error.url ?? undefined, cause: error };

    if (error.status === 0) {
      return new AppError('offline', 'Der Server ist nicht erreichbar.', details);
    }
    if (error.status === 404) {
      return new AppError('not-found', 'Der angeforderte Datensatz wurde nicht gefunden.', details);
    }
    if (error.status >= 400 && error.status < 500) {
      return new AppError('client', `Die Anfrage wurde abgelehnt (HTTP ${error.status}).`, details);
    }
    if (error.status >= 500) {
      return new AppError(
        'server',
        `Der Server hat einen Fehler gemeldet (HTTP ${error.status}).`,
        details,
      );
    }
    return new AppError('unknown', error.message, details);
  }
}
