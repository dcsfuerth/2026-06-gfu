import { expect } from '@playwright/test';
import { Then } from './fixtures';

const mainNav = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: 'Hauptnavigation' });

Then(
  'zeigt der Header den Markennamen {string} mit Link zur Startseite',
  async ({ page }, name) => {
    const brand = page.getByRole('banner').getByRole('link', { name });
    await expect(brand).toBeVisible();
    await expect(brand).toHaveAttribute('href', '/');
  },
);

Then('enthält das Hauptmenü die Einträge:', async ({ page }, table) => {
  const expected = table.raw().flat();
  const links = mainNav(page).getByRole('link');
  await expect(links).toHaveText(expected);
});

Then('ist der Menüeintrag {string} als aktiv markiert', async ({ page }, name: string) => {
  const link = mainNav(page).getByRole('link', { name, exact: true });
  await expect(link).toHaveClass(/nav__link--active/);
  await expect(link).toHaveAttribute('aria-current', 'page');
});

Then('ist der Menüeintrag {string} nicht als aktiv markiert', async ({ page }, name: string) => {
  const link = mainNav(page).getByRole('link', { name, exact: true });
  await expect(link).not.toHaveClass(/nav__link--active/);
});

Then('zeigt der Footer die Angular-Version', async ({ page }) => {
  await expect(page.getByRole('contentinfo')).toContainText(/Angular \d+\.\d+\.\d+/);
});
