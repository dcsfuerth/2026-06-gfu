import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * BDD-Konfiguration (playwright-bdd)
 *
 * - `features` : Gherkin-Szenarien unter ./e2e/features (Standardsprache Deutsch)
 * - `steps`    : Step-Definitionen und Fixtures unter ./e2e/steps
 * - `bddgen`   : erzeugt daraus Playwright-Tests in ./.features-gen (nicht versioniert)
 */
const testDir = defineBddConfig({
  features: 'e2e/features/**/*.feature',
  steps: 'e2e/steps/**/*.ts',
  language: 'de',
  missingSteps: 'fail-on-gen',
});

/**
 * Playwright-Konfiguration
 *
 * - `webServer` : Startet bei Bedarf `npm start` (ng serve) und wartet auf Port 4200.
 *                 Läuft bereits ein Dev-Server, wird dieser wiederverwendet.
 * - `baseURL`   : Erlaubt relative Pfade in den Steps, z. B. page.goto('/books').
 *
 * Die Szenarien mocken den json-server (Port 3000) per page.route(), sind dadurch
 * deterministisch und benötigen kein laufendes Backend.
 */
export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure-and-retries',
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
