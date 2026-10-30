import { expect } from '@playwright/test';
import { Then, When } from './fixtures';

Then('steigt der Zählerwert des Timers innerhalb von {int} Sekunden', async ({ page }, seconds) => {
  const value = page.getByTestId('timer-value');
  const first = Number(await value.innerText());
  await expect
    .poll(async () => Number(await value.innerText()), { timeout: seconds * 1000 })
    .toBeGreaterThan(first);
});

When('ich die Nachricht {string} eingebe', async ({ page }, message: string) => {
  await page.getByLabel('Nachricht', { exact: true }).fill(message);
});

Then('ist der Button {string} deaktiviert', async ({ page }, name: string) => {
  await expect(page.getByRole('button', { name, exact: true })).toBeDisabled();
});

Then('ist der Button {string} aktiviert', async ({ page }, name: string) => {
  await expect(page.getByRole('button', { name, exact: true })).toBeEnabled();
});

Then('ist das Nachrichtenfeld leer', async ({ page }) => {
  await expect(page.getByLabel('Nachricht', { exact: true })).toHaveValue('');
});

Then('enthält die Liste der letzten Nachrichten {int} Einträge', async ({ page }, count) => {
  await expect(
    page.getByRole('list', { name: 'Letzte Nachrichten' }).getByRole('listitem'),
  ).toHaveCount(count);
});

When('ich {int} Mal auf {string} klicke', async ({ page }, times: number, name: string) => {
  for (let i = 0; i < times; i++) {
    await page.getByRole('button', { name, exact: true }).click();
  }
});

Then('steht der Signal-Zähler auf {string}', async ({ page }, value: string) => {
  await expect(page.getByTestId('counter-value')).toHaveText(value);
});

Then('lautet die Parität {string}', async ({ page }, parity: string) => {
  await expect(page.getByText(parity, { exact: true })).toBeVisible();
});
