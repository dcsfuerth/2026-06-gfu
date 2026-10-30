import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOG_SINK, MemorySink } from '../core/logging';
import { HealthCheck } from './health-check.component';

describe('HealthCheck', () => {
  let fixture: ComponentFixture<HealthCheck>;
  let httpMock: HttpTestingController;

  function text(): string {
    return fixture.nativeElement.textContent;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthCheck],
      providers: [
        { provide: LOG_SINK, useExisting: MemorySink, multi: true },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthCheck);
    httpMock = TestBed.inject(HttpTestingController);
    TestBed.tick();
  });

  afterEach(() => httpMock.verify());

  it('shows a loading state while the request is pending', () => {
    expect(text()).toContain('Prüfe');
    httpMock.expectOne((r) => r.url.endsWith('/books')).flush([]);
  });

  it('reports a reachable backend with status and duration', async () => {
    httpMock.expectOne((r) => r.url.endsWith('/books')).flush([]);
    await fixture.whenStable();

    const status = fixture.nativeElement.querySelector('[data-testid="health-status"]');
    expect(status.textContent).toContain('erreichbar');
    expect(status.textContent).toContain('HTTP 200');
    expect(status.textContent).toMatch(/\d+ ms/);
  });

  it('reports an unreachable backend with the error message', async () => {
    httpMock
      .expectOne((r) => r.url.endsWith('/books'))
      .flush(null, { status: 500, statusText: 'Error' });
    await fixture.whenStable();

    expect(text()).toContain('nicht erreichbar');
    expect(text()).toContain('Der Server hat einen Fehler gemeldet (HTTP 500).');
  });

  it('checks again on demand', async () => {
    httpMock.expectOne((r) => r.url.endsWith('/books')).flush([]);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    TestBed.tick();
    httpMock.expectOne((r) => r.url.endsWith('/books')).flush([]);
    await fixture.whenStable();
    expect(text()).toContain('erreichbar');
  });
});
