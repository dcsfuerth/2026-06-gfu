import { expect } from '@playwright/test';
import { Then, When } from './fixtures';

When('ich in das Feld {string} den Wert {string} eingebe', async ({ page }, label, value) => {
  await page.getByLabel(label).fill(value);
});

When('ich im Feld {string} Enter drücke', async ({ page }, label: string) => {
  await page.getByLabel(label).press('Enter');
});

When('ich das Feld {string} fokussiere', async ({ page }, label: string) => {
  await page.getByLabel(label).focus();
});

Then('zeigt der Rechner das Ergebnis {string}', async ({ page }, result: string) => {
  await expect(page.locator('.calculator__result-value')).toHaveText(result);
});

Then('ist das Feld {string} leer', async ({ page }, label: string) => {
  await expect(page.getByLabel(label)).toHaveValue('');
});

Then('ist das Feld {string} als ungültig markiert', async ({ page }, label: string) => {
  await expect(page.getByLabel(label)).toHaveClass(/input--invalid/);
});
