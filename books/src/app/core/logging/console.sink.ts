import { Injectable } from '@angular/core';
import { LogEntry } from './log-level.model';
import { LogSink } from './log-sink.model';

/**
 * Schreibt Einträge auf die Browser-Konsole. Die einzige Stelle der Anwendung,
 * die `console.*` direkt verwendet.
 */
@Injectable({ providedIn: 'root' })
export class ConsoleSink implements LogSink {
  write(entry: LogEntry): void {
    const prefix = `${entry.timestamp.toISOString()} [${entry.context}]`;
    const args =
      entry.data === undefined ? [prefix, entry.message] : [prefix, entry.message, entry.data];

    switch (entry.level) {
      case 'debug':
        console.debug(...args);
        break;
      case 'info':
        console.info(...args);
        break;
      case 'warn':
        console.warn(...args);
        break;
      case 'error':
        console.error(...args);
        break;
    }
  }
}
