import type { Page } from '@playwright/test';
import type { Book } from '../../src/app/books/book';

export type { Book };

/**
 * Deterministische Testdaten. Bewusst so gewählt, dass die fachlichen
 * Sonderfälle der UI abgedeckt sind:
 *  - "Angular 21": Preis < 20 € -> CSS-Klasse `price--discount`, kein Kommentar
 *  - "Angular 22": Preis >= 20 € -> kein Rabatt, mit Kommentar
 */
export const MOCK_BOOKS: Book[] = [
  {
    isbn: '123-456-789',
    title: 'Angular 21',
    price: 19.99,
    coverUrl: 'https://example.test/cover-21.jpg',
    stars: 3.5,
  },
  {
    isbn: '987-654-321',
    title: 'Angular 22',
    price: 29.9,
    coverUrl: 'https://example.test/cover-22.jpg',
    stars: 4.5,
    comment: 'Sehr empfehlenswert.',
  },
];

// Der json-server läuft auf einem anderen Port (3000) als die App (4200).
// Beim Mocken müssen wir die CORS-Header selbst setzen, sonst blockt der
// Browser die Cross-Origin-Antwort und HttpClient läuft in einen Fehler.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

/**
 * Fängt alle Aufrufe an den json-server (Port 3000) ab und liefert die
 * Mock-Daten zurück. Dadurch sind die Tests unabhängig vom Backend.
 *
 * Die Routes werden bewusst auf den Backend-Origin (Port 3000) eingeschränkt.
 * Ein zu breites Pattern wie '**\/books' würde auch den Navigations-Request
 * auf die Angular-Route http://localhost:4200/books abfangen.
 *
 * Cover-Bilder werden ebenfalls geblockt (leeres 1x1-Pixel), damit keine
 * echten Netzwerk-Requests nach außen gehen.
 */
export async function mockBookApi(page: Page, books: Book[] = MOCK_BOOKS): Promise<void> {
  const API = 'http://localhost:3000';
  // Eigene Kopie, damit DELETE den Zustand innerhalb eines Tests verändern kann.
  const state = books.map((book) => ({ ...book }));

  // /books/:isbn – Einzelbuch (GET) und Löschen (DELETE); muss vor der Listen-Route stehen
  await page.route(`${API}/books/*`, async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS });
      return;
    }

    const isbn = decodeURIComponent(new URL(request.url()).pathname.split('/').pop() ?? '');
    const index = state.findIndex((b) => b.isbn === isbn);

    if (index === -1) {
      await route.fulfill({ status: 404, json: {}, headers: CORS });
      return;
    }

    if (request.method() === 'DELETE') {
      state.splice(index, 1);
      await route.fulfill({ status: 200, json: {}, headers: CORS });
      return;
    }

    await route.fulfill({ json: state[index], headers: CORS });
  });

  // GET /books – Buchliste
  await page.route(`${API}/books`, async (route) => {
    await route.fulfill({ json: state, headers: CORS });
  });

  // Externe Cover-Bilder neutralisieren
  await page.route('https://example.test/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/gif',
      // 1x1 transparentes GIF
      body: Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64'),
    });
  });
}
