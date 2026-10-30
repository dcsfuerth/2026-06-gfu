import { HttpClient, HttpContext } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  VERSION,
  computed,
  enableProfiling,
  inject,
  resource,
  signal,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { REQUEST_TIMEOUT } from '../core/errors';
import { LOG_LEVELS, LogEntry, LogLevel, Logger, MemorySink, logLevelRank } from '../core/logging';
import { Notifications } from '../core/notifications/notifications';

interface HealthResult {
  readonly ok: boolean;
  readonly status?: number;
  readonly durationMs: number;
  readonly message?: string;
}

/**
 * Diagnose-Seite: macht Logger, Fehlerbehandlung, Backend-Zustand und
 * Profiling sichtbar und erlaubt, Fehlerpfade gezielt auszulösen.
 */
@Component({
  selector: 'books-diagnostics',
  imports: [DatePipe],
  templateUrl: './diagnostics.html',
  styleUrl: './diagnostics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Diagnostics {
  private readonly http = inject(HttpClient);
  private readonly notifications = inject(Notifications);
  private readonly memorySink = inject(MemorySink);
  protected readonly logger = inject(Logger);
  private readonly log = this.logger.withContext('Diagnose');

  // --- Umgebung ----------------------------------------------------------------
  protected readonly angularVersion = VERSION.full;
  protected readonly production = environment.production;
  protected readonly serverUrl = environment.SERVER_URL;
  protected readonly startedAt = new Date(performance.timeOrigin);

  // --- Log-Level -----------------------------------------------------------------
  protected readonly levels = LOG_LEVELS;

  setLevel(level: LogLevel): void {
    // Erst protokollieren, dann umschalten: Sonst würde der Eintrag beim Wechsel
    // auf ein höheres Level sofort verworfen.
    this.log.info(`Log-Level auf „${level}“ gesetzt`);
    this.logger.setLevel(level);
  }

  // --- Protokoll -----------------------------------------------------------------
  protected readonly filterLevel = signal<LogLevel>('debug');
  protected readonly filterText = signal('');

  protected readonly entries = computed<readonly LogEntry[]>(() => {
    const minRank = logLevelRank(this.filterLevel());
    const text = this.filterText().trim().toLowerCase();
    return this.memorySink
      .entries()
      .filter((entry) => logLevelRank(entry.level) >= minRank)
      .filter(
        (entry) =>
          !text ||
          entry.context.toLowerCase().includes(text) ||
          entry.message.toLowerCase().includes(text),
      )
      .slice()
      .reverse();
  });

  protected readonly totalCount = this.memorySink.count;

  clearLog(): void {
    this.memorySink.clear();
  }

  downloadLog(): void {
    const json = JSON.stringify(this.memorySink.entries(), replacer, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `books-log-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // --- Backend -----------------------------------------------------------------
  protected readonly health = resource<HealthResult, void>({
    loader: async () => {
      const started = performance.now();
      try {
        const response = await firstValueFrom(
          this.http.get(`${this.serverUrl}/books`, {
            observe: 'response',
            context: new HttpContext().set(REQUEST_TIMEOUT, 5_000),
          }),
        );
        return { ok: true, status: response.status, durationMs: elapsed(started) };
      } catch (error) {
        return {
          ok: false,
          durationMs: elapsed(started),
          message: error instanceof Error ? error.message : String(error),
        };
      }
    },
  });

  // --- Fehler auslösen -------------------------------------------------------------
  throwInHandler(): void {
    throw new Error('Demo: Fehler im Event-Handler');
  }

  rejectPromise(): void {
    void Promise.reject(new Error('Demo: abgelehnte Promise'));
  }

  /** Die Anfrage schlägt mit 404 fehl; der Fehler bleibt unbehandelt und erreicht den ErrorHandler. */
  requestNotFound(): void {
    void firstValueFrom(this.http.get(`${this.serverUrl}/books/gibt-es-nicht`));
  }

  /** Zeitlimit von 1 ms: löst Timeout, Wiederholungen und schließlich den ErrorHandler aus. */
  requestTimeout(): void {
    void firstValueFrom(
      this.http.get(`${this.serverUrl}/books`, {
        context: new HttpContext().set(REQUEST_TIMEOUT, 1),
      }),
    );
  }

  showInfo(): void {
    this.log.info('Demo: Info-Meldung');
    this.notifications.info('Das ist eine Info-Meldung.');
  }

  // --- Profiling -----------------------------------------------------------------
  private stopProfiling: (() => void) | undefined;
  protected readonly profiling = signal(false);

  toggleProfiling(): void {
    if (this.stopProfiling) {
      this.stopProfiling();
      this.stopProfiling = undefined;
      this.profiling.set(false);
      this.log.info('Profiling beendet');
    } else {
      this.stopProfiling = enableProfiling();
      this.profiling.set(true);
      this.log.info(
        'Profiling gestartet: Aufzeichnung im Chrome-Performance-Panel zeigt Angular-Daten',
      );
    }
  }
}

function elapsed(started: number): number {
  return Math.round(performance.now() - started);
}

/** Fehlerobjekte sind nicht serialisierbar; Message und Stack reichen für das Protokoll. */
function replacer(_key: string, value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
}
