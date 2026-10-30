import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

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

  return inject(Router).createUrlTree(['/books']);
};
