import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ConsoleSink } from './console-sink';
import { LOG_SINK } from './log-sink';
import { MemorySink } from './memory-sink';

/**
 * Registriert die Standard-Senken: Konsole und Ringpuffer im Speicher.
 * Weitere Senken (z. B. ein Server) lassen sich als zusätzlicher
 * `{ provide: LOG_SINK, useClass: …, multi: true }` ergänzen.
 */
export function provideLogging(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: LOG_SINK, useExisting: ConsoleSink, multi: true },
    { provide: LOG_SINK, useExisting: MemorySink, multi: true },
  ]);
}
