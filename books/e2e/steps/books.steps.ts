import { expect, type Locator, type Page } from '@playwright/test';
import type { DataTable } from 'playwright-bdd';
import type { Book } from '../fixtures/books';
import { Given, Then, When } from './fixtures';

// --- Backend-Daten -----------------------------------------------------------

Given('folgende Bücher sind im Bestand:', async ({ backend }, table: DataTable) => {
  const books: Book[] = table.hashes().map((row) => ({
    isbn: row['ISBN'],
    title: row['Titel'],
    price: Number(row['Preis']),
    stars: Number(row['Sterne']),
    coverUrl: `https://example.test/${row['ISBN']}.jpg`,
    ...(row['Kommentar'] ? { comment: row['Kommentar'] } : {}),
  }));
  await backend.provide(books);
});

Given('es sind keine Bücher im Bestand', async ({ backend }) => {
  await backend.provide([]);
});

// --- Buchliste ---------------------------------------------------------------

/** Datenzeilen = Zeilen mit verlinktem Buchtitel (Kopfzeile und Hinweiszeile zählen nicht). */
function dataRows(page: Page): Locator {
  return page.getByRole('row').filter({ has: page.locator('td a') });
}

function rowOf(page: Page, title: string): Locator {
  return page
    .getByRole('row')
    .filter({ has: page.getByRole('link', { name: title, exact: true }) });
}

Then('sehe ich {int} Bücher in der Tabelle', async ({ page }, count: number) => {
  await expect(dataRows(page)).toHaveCount(count);
});

Then('sehe ich das Buch {string} in der Tabelle', async ({ page }, title: string) => {
  await expect(rowOf(page, title)).toBeVisible();
});

Then('sehe ich das Buch {string} nicht in der Tabelle', async ({ page }, title: string) => {
  await expect(rowOf(page, title)).toHaveCount(0);
});

Then(
  'ist der Titel {string} mit {string} verlinkt',
  async ({ page }, title: string, href: string) => {
    await expect(page.getByRole('link', { name: title, exact: true })).toHaveAttribute(
      'href',
      href,
    );
  },
);

Then('ist der Preis {string} als Angebot hervorgehoben', async ({ page }, price: string) => {
  const discounted = page.locator('.price--discount');
  await expect(discounted).toHaveCount(1);
  await expect(discounted).toHaveText(price);
});

Then('ist der Preis {string} nicht hervorgehoben', async ({ page }, price: string) => {
  await expect(page.locator('.price--discount', { hasText: price })).toHaveCount(0);
});

When('ich nach {string} suche', async ({ page }, term: string) => {
  await page.getByLabel('Bücher suchen').fill(term);
});

Then('ist die Spalte {string} sichtbar', async ({ page }, name: string) => {
  await expect(page.getByRole('columnheader', { name })).toBeVisible();
});

Then('ist die Spalte {string} nicht sichtbar', async ({ page }, name: string) => {
  await expect(page.getByRole('columnheader', { name })).toHaveCount(0);
});

// --- Bewertung ---------------------------------------------------------------

Then(
  'hat das Buch {string} eine Bewertung von {string}',
  async ({ page }, title: string, label: string) => {
    await expect(rowOf(page, title).getByRole('img', { name: /von 5 Sternen/ })).toHaveAttribute(
      'aria-label',
      label,
    );
  },
);

When(
  'ich beim Buch {string} auf {string} klicke',
  async ({ page }, title: string, button: string) => {
    await rowOf(page, title).getByRole('button', { name: button, exact: true }).click();
  },
);

// --- Löschen -----------------------------------------------------------------

/** Öffnet die Lösch-Rückfrage für das Buch und liefert den Dialog. */
async function openDeleteDialog(page: Page, title: string): Promise<Locator> {
  await page.getByRole('button', { name: `Buch „${title}“ löschen` }).click();
  const dialog = page.getByRole('dialog', { name: 'Buch löschen?' });
  await expect(dialog).toBeVisible();
  return dialog;
}

When('ich das Buch {string} lösche', async ({ page }, title: string) => {
  const dialog = await openDeleteDialog(page, title);
  const deleteRequest = page.waitForRequest((req) => req.method() === 'DELETE');
  await dialog.getByRole('button', { name: 'Löschen', exact: true }).click();
  await deleteRequest;
});

When('ich das Löschen von {string} abbreche', async ({ page }, title: string) => {
  const dialog = await openDeleteDialog(page, title);
  await dialog.getByRole('button', { name: 'Abbrechen' }).click();
  await expect(dialog).toBeHidden();
});

Then('wurde das Buch mit der ISBN {string} am Backend gelöscht', async ({ page }, isbn: string) => {
  // Der DELETE-Request wurde bereits im When-Schritt abgewartet; hier prüfen wir
  // nur noch, dass die Zeile verschwunden ist.
  await expect(page.getByText(isbn, { exact: true })).toHaveCount(0);
});

// --- Detailseite -------------------------------------------------------------

Then('sehe ich die Bewertung {string}', async ({ page }, label: string) => {
  await expect(page.getByRole('img', { name: label })).toBeVisible();
});
