import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright-Konfiguration
 *
 * - `testDir`   : Alle E2E-Tests liegen unter ./e2e
 * - `webServer` : Startet bei Bedarf `npm start` (ng serve) und wartet auf Port 4200.
 *                 Läuft bereits ein Dev-Server, wird dieser wiederverwendet.
 * - `baseURL`   : Erlaubt relative Pfade in den Tests, z. B. page.goto('/books').
 *
 * Die Tests mocken den json-server (Port 3000) per page.route(), sind dadurch
 * deterministisch und benötigen kein laufendes Backend.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
