import { Injectable, computed, signal } from '@angular/core';
import { LogEntry } from './log-level.model';
import { LogSink } from './log-sink.model';

/** Maximale Anzahl gepufferter Einträge. */
export const MEMORY_SINK_CAPACITY = 200;

/**
 * Ringpuffer der letzten Einträge als Signal. Grundlage für die Diagnose-Seite
 * und zum Herunterladen eines Protokolls.
 */
@Injectable({ providedIn: 'root' })
export class MemorySink implements LogSink {
  private readonly buffer = signal<readonly LogEntry[]>([]);

  /** Alle gepufferten Einträge, älteste zuerst. */
  readonly entries = this.buffer.asReadonly();

  readonly count = computed(() => this.buffer().length);

  write(entry: LogEntry): void {
    this.buffer.update((entries) => [...entries, entry].slice(-MEMORY_SINK_CAPACITY));
  }

  clear(): void {
    this.buffer.set([]);
  }
}
