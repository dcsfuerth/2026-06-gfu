import type { Page } from '@playwright/test';

/** Buch-Datenmodell, identisch zu src/app/books/book.ts */
export interface Book {
  isbn: string;
  title: string;
  price: number;
  coverUrl: string;
  stars: number;
  comment?: string;
}

/**
 * Deterministische Testdaten. Bewusst so gewählt, dass die fachlichen
 * Sonderfälle der UI abgedeckt sind:
 *  - "Angular 21": Preis < 20 € -> CSS-Klasse `price--discount`
 *  - "Angular 22": Preis >= 20 € -> kein Rabatt
 *  - ISBN 123-456-789 ist die EINZIGE, die der bookGuard durchlässt.
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

/**
 * Fängt alle Aufrufe an den json-server (Port 3000) ab und liefert die
 * Mock-Daten zurück. Dadurch sind die Tests unabhängig vom Backend.
 *
 * Cover-Bilder werden ebenfalls geblockt (leeres 1x1-Pixel), damit keine
 * echten Netzwerk-Requests nach außen gehen.
 */
// Der json-server läuft auf einem anderen Port (3000) als die App (4200).
// Beim Mocken müssen wir die CORS-Header selbst setzen, sonst blockt der
// Browser die Cross-Origin-Antwort und HttpClient läuft in einen Fehler.
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function mockBookApi(page: Page, books: Book[] = MOCK_BOOKS): Promise<void> {
  // WICHTIG: Die Routes werden bewusst auf den Backend-Origin (Port 3000)
  // eingeschränkt. Ein zu breites Pattern wie '**/books' würde auch den
  // Navigations-Request auf die Angular-Route http://localhost:4200/books
  // abfangen und die App damit aushebeln.
  const API = 'http://localhost:3000';

  // GET /books/:isbn  – Einzelbuch (muss vor der Listen-Route registriert sein)
  await page.route(`${API}/books/*`, async (route) => {
    const url = new URL(route.request().url());
    const isbn = url.pathname.split('/').pop();
    const book = books.find((b) => b.isbn === isbn);
    if (book) {
      await route.fulfill({ json: book, headers: CORS });
    } else {
      await route.fulfill({ status: 404, json: {}, headers: CORS });
    }
  });

  // GET /books – Buchliste
  await page.route(`${API}/books`, async (route) => {
    await route.fulfill({ json: books, headers: CORS });
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
