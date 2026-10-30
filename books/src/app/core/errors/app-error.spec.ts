import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { AppError } from './app-error';

describe('AppError', () => {
  it('maps HTTP status codes to kinds and messages', () => {
    const cases: [number, string][] = [
      [0, 'offline'],
      [404, 'not-found'],
      [422, 'client'],
      [503, 'server'],
    ];
    for (const [status, kind] of cases) {
      const error = AppError.from(new HttpErrorResponse({ status, url: '/x' }));
      expect(error.kind).toBe(kind);
      expect(error.details.status).toBe(status);
      expect(error.message.length).toBeGreaterThan(0);
    }
  });

  it('maps rxjs timeouts', () => {
    expect(AppError.from(new TimeoutError(), '/slow').kind).toBe('timeout');
  });

  it('keeps an existing AppError and wraps everything else as unknown', () => {
    const original = new AppError('client', 'nein');
    expect(AppError.from(original)).toBe(original);

    const wrapped = AppError.from(new Error('kaputt'));
    expect(wrapped.kind).toBe('unknown');
    expect(wrapped.message).toBe('kaputt');
    expect(wrapped.cause).toBeInstanceOf(Error);
  });
});
