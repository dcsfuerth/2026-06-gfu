import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LOG_SINK, MemorySink } from '../core/logging';
import { provideGermanLocale } from '../locale.providers';
import { Diagnostics } from './diagnostics.component';

describe('Diagnostics', () => {
  it('arranges all diagnostic panels on the page', async () => {
    await TestBed.configureTestingModule({
      imports: [Diagnostics],
      providers: [
        provideGermanLocale(),
        { provide: LOG_SINK, useExisting: MemorySink, multi: true },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(Diagnostics);
    TestBed.tick();
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne((r) => r.url.endsWith('/books')).flush([]);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('h1')?.textContent).toContain('Diagnose');
    for (const panel of [
      'books-environment-info',
      'books-log-level-switch',
      'books-health-check',
      'books-error-triggers',
      'books-profiling-toggle',
      'books-log-viewer',
    ]) {
      expect(host.querySelector(panel), panel).not.toBeNull();
    }
    httpMock.verify();
  });
});
