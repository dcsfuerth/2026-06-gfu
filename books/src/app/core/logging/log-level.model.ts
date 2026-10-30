export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

/** Numerischer Rang eines Levels; höhere Werte sind wichtiger. */
export function logLevelRank(level: LogLevel): number {
  return LOG_LEVELS.indexOf(level);
}

export function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === 'string' && (LOG_LEVELS as readonly string[]).includes(value);
}

/** Ein einzelner Protokolleintrag. */
export interface LogEntry {
  /** Laufende Nummer je Logger-Instanz; eindeutig auch bei gleichem Zeitstempel und Text. */
  readonly id: number;
  readonly timestamp: Date;
  readonly level: LogLevel;
  readonly context: string;
  readonly message: string;
  readonly data?: unknown;
}
