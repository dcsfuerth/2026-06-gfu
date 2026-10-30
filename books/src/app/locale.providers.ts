import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, Provider } from '@angular/core';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

/** Deutsche Locale mit Euro als Standardwährung, für App und Tests. */
export function provideGermanLocale(): Provider[] {
  return [
    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
  ];
}
