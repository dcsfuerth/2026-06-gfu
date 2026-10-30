import { InjectionToken } from '@angular/core';
import { LogEntry } from './log-level';

/** Ziel, in das der Logger Einträge schreibt (Konsole, Speicher, Server, …). */
export interface LogSink {
  write(entry: LogEntry): void;
}

/** Multi-Provider-Token: alle registrierten Senken erhalten jeden Eintrag. */
export const LOG_SINK = new InjectionToken<readonly LogSink[]>('LOG_SINK');
