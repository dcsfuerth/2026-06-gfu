import { createBdd, test as base } from 'playwright-bdd';
import { mockBookApi, type Book } from '../fixtures/books';

/**
 * Gemeinsame Fixtures für alle Steps.
 *
 * `backend` kapselt das gemockte Buch-Backend. Szenarien legen über
 * "Angenommen folgende Bücher sind im Bestand" fest, welche Daten geliefert
 * werden; ohne diesen Schritt antwortet das Backend mit einer leeren Liste.
 */
type Backend = {
  /** Richtet das Mock-Backend mit den angegebenen Büchern ein. */
  provide(books: Book[]): Promise<void>;
};

export const test = base.extend<{ backend: Backend }>({
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
});

export const { Given, When, Then } = createBdd(test);
