export const environment = {
  SERVER_URL: 'http://localhost:3000',
  production: false,
  /** Mindest-Log-Level beim Start: debug, info, warn oder error. */
  logLevel: 'debug' as const,
  /** Sehr ausführliches Router-Tracing (withDebugTracing). */
  routerDebugTracing: false,
};
