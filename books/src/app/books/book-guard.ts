import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Logger } from '../core/logging';

/** Erlaubt sind Ziffern, getrennt durch Bindestriche, z. B. 123-456-789. */
const ISBN_PATTERN = /^\d+(-\d+)*$/;

/**
 * Lässt die Detailroute nur für syntaktisch gültige ISBNs zu und leitet
 * andernfalls zur Buchliste um.
 */
export const bookGuard: CanActivateFn = (route) => {
  const isbn = route.paramMap.get('isbn') ?? '';

  if (ISBN_PATTERN.test(isbn)) {
    return true;
  }

  inject(Logger).withContext('bookGuard').warn(`Ungültige ISBN „${isbn}“, Umleitung nach /books`);
  return inject(Router).createUrlTree(['/books']);
};
