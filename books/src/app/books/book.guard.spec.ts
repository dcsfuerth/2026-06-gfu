import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { bookGuard } from './book.guard';

function runGuard(isbn: string | null) {
  const route = {
    paramMap: convertToParamMap(isbn === null ? {} : { isbn }),
  } as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  return TestBed.runInInjectionContext(() => bookGuard(route, state));
}

describe('bookGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('allows well-formed ISBNs', () => {
    expect(runGuard('123-456-789')).toBe(true);
    expect(runGuard('9783864906466')).toBe(true);
  });

  it('redirects to the book list for malformed ISBNs', () => {
    const result = runGuard('abc') as UrlTree;
    expect(result).toBeInstanceOf(UrlTree);
    expect(result.toString()).toBe('/books');
  });

  it('redirects when the parameter is missing', () => {
    expect(runGuard(null)).toBeInstanceOf(UrlTree);
  });
});
