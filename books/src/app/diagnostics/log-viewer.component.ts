import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  LOG_LEVELS,
  LogEntry,
  LogLevel,
  MemorySink,
  isLogLevel,
  logLevelRank,
} from '../core/logging';

/** Zeigt den Ringpuffer des Loggers mit Filter, Download und Leeren. */
@Component({
  selector: 'books-log-viewer',
  imports: [DatePipe],
  host: { class: 'card' },
  templateUrl: './log-viewer.component.html',
  styleUrl: './log-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogViewer {
  private readonly memorySink = inject(MemorySink);

  protected readonly levels = LOG_LEVELS;
  protected readonly filterLevel = signal<LogLevel>('debug');
  protected readonly filterText = signal('');

  /** Gefilterte Einträge, neueste zuerst. */
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

  updateFilterLevel(value: string): void {
    if (isLogLevel(value)) {
      this.filterLevel.set(value);
    }
  }

  updateFilterText(value: string): void {
    this.filterText.set(value);
  }

  clear(): void {
    this.memorySink.clear();
  }

  download(): void {
    const json = JSON.stringify(this.memorySink.entries(), replacer, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `books-log-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

/** Fehlerobjekte sind nicht serialisierbar; Message und Stack reichen für das Protokoll. */
function replacer(_key: string, value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
}
