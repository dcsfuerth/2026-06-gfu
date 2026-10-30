export const environment = {
  SERVER_URL: 'http://mein-toller-backend-server.com',
  production: true,
  /** Mindest-Log-Level beim Start: debug, info, warn oder error. */
  logLevel: 'warn' as const,
  /** Sehr ausführliches Router-Tracing (withDebugTracing). */
  routerDebugTracing: false,
};
