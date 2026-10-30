import { type ConsoleMessage, type Page } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';
import { mockBookApi, type Book } from '../fixtures/books';

/**
 * Gemeinsame Fixtures für alle Steps.
 *
 * - `backend` kapselt das gemockte Buch-Backend. Szenarien legen über
 *   "Angenommen folgende Bücher sind im Bestand" fest, welche Daten geliefert
 *   werden; ohne diesen Schritt antwortet das Backend mit einer leeren Liste.
 * - `consoleGuard` sammelt Konsolenfehler und unbehandelte Ausnahmen der Seite und
 *   lässt das Szenario am Ende scheitern. Szenarien, die Fehler absichtlich
 *   auslösen, tragen den Tag `@fehler-erwartet`.
 */
type Backend = {
  /** Richtet das Mock-Backend mit den angegebenen Büchern ein. */
  provide(books: Book[]): Promise<void>;
};

/** Browser-eigene Meldungen zu absichtlich fehlschlagenden Mock-Antworten (z. B. 404). */
const IGNORED_CONSOLE_PATTERNS = [/Failed to load resource/];

export const test = base.extend<{ backend: Backend; consoleGuard: void }>({
  backend: async ({ page }, use) => {
    let initialised = false;
    await use({
      async provide(books) {
        if (initialised) {
          throw new Error('Das Backend kann je Szenario nur einmal eingerichtet werden.');
        }
        initialised = true;
        await mockBookApi(page, books);
      },
    });
  },

  consoleGuard: [
    async ({ page }, use, testInfo) => {
      const problems: string[] = [];
      const onConsole = (message: ConsoleMessage) => {
        if (message.type() !== 'error') return;
        if (IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(message.text()))) return;
        problems.push(`console.error: ${message.text()}`);
      };
      const onPageError = (error: Error) => problems.push(`pageerror: ${error.message}`);

      page.on('console', onConsole);
      page.on('pageerror', onPageError);

      await use();

      page.off('console', onConsole);
      page.off('pageerror', onPageError);

      if (problems.length === 0) return;

      await testInfo.attach('browser-errors', {
        body: problems.join('\n'),
        contentType: 'text/plain',
      });

      if (!testInfo.tags.includes('@fehler-erwartet')) {
        throw new Error(`Unerwartete Fehler in der Browser-Konsole:\n${problems.join('\n')}`);
      }
    },
    { auto: true },
  ],
});

export const { Given, When, Then } = createBdd(test);

export type { Page };
