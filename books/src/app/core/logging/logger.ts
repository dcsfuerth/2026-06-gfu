import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConsoleSink } from './console-sink';
import { LogEntry, LogLevel, isLogLevel, logLevelRank } from './log-level';
import { LOG_SINK, LogSink } from './log-sink';

const LEVEL_STORAGE_KEY = 'books.logLevel';

/**
 * Zentraler Logger.
 *
 * - Das aktive Mindest-Level ist ein Signal und kann zur Laufzeit geändert werden
 *   (Diagnose-Seite). Es wird im localStorage gemerkt.
 * - Einträge gehen an alle über `LOG_SINK` registrierten Senken. Ohne Registrierung
 *   wird nur die Konsole bedient.
 * - Komponenten und Services holen sich einen Kontext-Logger:
 *   `private readonly log = inject(Logger).withContext('BookList');`
 */
@Injectable({ providedIn: 'root' })
export class Logger {
  private readonly sinks: readonly LogSink[] = inject(LOG_SINK, { optional: true }) ?? [
    inject(ConsoleSink),
  ];

  /** Aktives Mindest-Level. */
  readonly level = signal<LogLevel>(readStoredLevel() ?? environment.logLevel);

  setLevel(level: LogLevel): void {
    this.level.set(level);
    try {
      localStorage.setItem(LEVEL_STORAGE_KEY, level);
    } catch {
      // Speicher nicht verfügbar (z. B. Private Mode): Level gilt nur für diese Sitzung.
    }
  }

  isEnabled(level: LogLevel): boolean {
    return logLevelRank(level) >= logLevelRank(this.level());
  }

  withContext(context: string): ContextLogger {
    return new ContextLogger(this, context);
  }

  log(level: LogLevel, context: string, message: string, data?: unknown): void {
    if (!this.isEnabled(level)) {
      return;
    }
    const entry: LogEntry = { timestamp: new Date(), level, context, message, data };
    for (const sink of this.sinks) {
      sink.write(entry);
    }
  }
}

/** Logger mit festem Kontext, z. B. dem Namen einer Komponente. */
export class ContextLogger {
  constructor(
    private readonly logger: Logger,
    readonly context: string,
  ) {}

  debug(message: string, data?: unknown): void {
    this.logger.log('debug', this.context, message, data);
  }

  info(message: string, data?: unknown): void {
    this.logger.log('info', this.context, message, data);
  }

  warn(message: string, data?: unknown): void {
    this.logger.log('warn', this.context, message, data);
  }

  error(message: string, data?: unknown): void {
    this.logger.log('error', this.context, message, data);
  }
}

function readStoredLevel(): LogLevel | undefined {
  try {
    const stored = localStorage.getItem(LEVEL_STORAGE_KEY);
    return isLogLevel(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
}
