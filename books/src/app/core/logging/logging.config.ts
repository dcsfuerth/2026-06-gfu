import { InjectionToken } from '@angular/core';
import { LogLevel } from './log-level.model';

/** Konfiguration des Loggers; wird über `provideLogging()` gesetzt. */
export interface LoggingConfig {
  /** Mindest-Level beim Start. Ein im localStorage gespeichertes Level hat Vorrang. */
  readonly level: LogLevel;
}

export const DEFAULT_LOGGING_CONFIG: LoggingConfig = { level: 'info' };

/** Ohne `provideLogging()` gilt die Standardkonfiguration. */
export const LOGGING_CONFIG = new InjectionToken<LoggingConfig>('LOGGING_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_LOGGING_CONFIG,
});
