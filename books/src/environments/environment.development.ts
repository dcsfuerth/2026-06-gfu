import type { LogLevel } from '../app/core/logging/log-level';

export const environment = {
  SERVER_URL: 'http://localhost:3000',
  production: false,
  /** Mindest-Log-Level beim Start. */
  logLevel: 'debug' as LogLevel,
  /** Sehr ausführliches Router-Tracing (withDebugTracing). */
  routerDebugTracing: false,
};
