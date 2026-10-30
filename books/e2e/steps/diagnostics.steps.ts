import { expect } from '@playwright/test';
import { Then, When } from './fixtures';

Then('sehe ich die Angular-Version', async ({ page }) => {
  await expect(page.getByRole('main')).toContainText(/\d+\.\d+\.\d+/);
});

Then('ist das Backend als {string} markiert', async ({ page }, status: string) => {
  await expect(page.getByTestId('health-status')).toContainText(status);
});

Then('enthält das Protokoll einen Eintrag {string}', async ({ page }, message: string) => {
  await expect(page.locator('.log-row', { hasText: message }).first()).toBeVisible();
});

Then(
  'enthält das Protokoll einen Eintrag mit Level {string} und Kontext {string}',
  async ({ page }, level: string, context: string) => {
    await expect(
      page.locator(`.log-row--${level}`).filter({ hasText: context }).first(),
    ).toBeVisible();
  },
);

Then('enthält jede Protokollzeile den Kontext {string}', async ({ page }, context: string) => {
  const rows = page.locator('.log-row');
  await expect(rows.first()).toBeVisible();
  const contexts = await rows.locator('td:nth-child(3)').allInnerTexts();
  expect(contexts.every((c) => c.includes(context))).toBe(true);
});

When('ich das Log-Level auf {string} setze', async ({ page }, level: string) => {
  await page.getByRole('group', { name: 'Log-Level' }).getByRole('button', { name: level }).click();
});

Then('ist das Log-Level {string} aktiv', async ({ page }, level: string) => {
  await expect(
    page.getByRole('group', { name: 'Log-Level' }).getByRole('button', { name: level }),
  ).toHaveAttribute('aria-pressed', 'true');
});

When('ich das Protokoll nach {string} durchsuche', async ({ page }, text: string) => {
  await page.getByLabel('Protokoll durchsuchen').fill(text);
});

Then('sehe ich die Fehlermeldung {string}', async ({ page }, message: string) => {
  await expect(page.getByRole('alert').filter({ hasText: message })).toBeVisible();
});

Then('sehe ich die Meldung {string}', async ({ page }, message: string) => {
  await expect(page.getByRole('status').filter({ hasText: message })).toBeVisible();
});
