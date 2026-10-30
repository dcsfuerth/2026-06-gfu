import type { LogLevel } from '../app/core/logging/log-level';

export const environment = {
  SERVER_URL: 'http://mein-toller-backend-server.com',
  production: true,
  /** Mindest-Log-Level beim Start. */
  logLevel: 'warn' as LogLevel,
  /** Sehr ausführliches Router-Tracing (withDebugTracing). */
  routerDebugTracing: false,
};
