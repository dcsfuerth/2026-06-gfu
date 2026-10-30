import { expect } from '@playwright/test';
import { Given, Then, When } from './fixtures';

// --- Navigation -------------------------------------------------------------

Given('ich öffne die Seite {string}', async ({ page }, path: string) => {
  await page.goto(path);
});

When('ich auf den Link {string} klicke', async ({ page }, name: string) => {
  await page.getByRole('link', { name, exact: true }).click();
});

When('ich im Hauptmenü auf {string} klicke', async ({ page }, name: string) => {
  await page
    .getByRole('navigation', { name: 'Hauptnavigation' })
    .getByRole('link', { name, exact: true })
    .click();
});

When('ich auf den Button {string} klicke', async ({ page }, name: string) => {
  await page.getByRole('button', { name, exact: true }).click();
});

// --- Prüfungen ---------------------------------------------------------------

Then('endet die URL mit {string}', async ({ page }, suffix: string) => {
  await expect(page).toHaveURL(new RegExp(`${escapeRegExp(suffix)}$`));
});

Then('lautet der Seitentitel {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(title);
});

Then('sehe ich die Überschrift {string}', async ({ page }, name: string) => {
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
});

Then('sehe ich die Überschrift {string} nicht', async ({ page }, name: string) => {
  await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(0);
});

Then('sehe ich den Text {string}', async ({ page }, text: string) => {
  await expect(page.getByText(text).first()).toBeVisible();
});

Then('sehe ich den Text {string} nicht', async ({ page }, text: string) => {
  await expect(page.getByText(text)).toHaveCount(0);
});

Then('führt der Link {string} nach {string}', async ({ page }, name: string, href: string) => {
  await expect(page.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
});

Then(
  'führt der Link {string} im Hauptbereich nach {string}',
  async ({ page }, name: string, href: string) => {
    await expect(page.getByRole('main').getByRole('link', { name })).toHaveAttribute('href', href);
  },
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
