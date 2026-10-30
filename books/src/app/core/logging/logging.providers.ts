import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ConsoleSink } from './console.sink';
import { LogLevel } from './log-level.model';
import { LOG_SINK } from './log-sink.model';
import { DEFAULT_LOGGING_CONFIG, LOGGING_CONFIG, LoggingConfig } from './logging.config';
import { MemorySink } from './memory.sink';

export interface LoggingOptions {
  /** Mindest-Level beim Start; Standard ist `info`. */
  readonly level?: LogLevel;
}

/**
 * Richtet den Logger ein: Start-Level sowie die Standard-Senken Konsole und
 * Ringpuffer im Speicher. Weitere Senken lassen sich als zusätzlicher
 * `{ provide: LOG_SINK, useExisting: …, multi: true }` ergänzen.
 */
export function provideLogging(options: LoggingOptions = {}): EnvironmentProviders {
  const config: LoggingConfig = { level: options.level ?? DEFAULT_LOGGING_CONFIG.level };

  return makeEnvironmentProviders([
    { provide: LOGGING_CONFIG, useValue: config },
    { provide: LOG_SINK, useExisting: ConsoleSink, multi: true },
    { provide: LOG_SINK, useExisting: MemorySink, multi: true },
  ]);
}
