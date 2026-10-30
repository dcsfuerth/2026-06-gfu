import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Logger } from '../core/logging/logger';
import { MemorySink } from '../core/logging/memory-sink';
import { provideLogging } from '../core/logging/provide-logging';
import { Notifications } from '../core/notifications/notifications';
import { provideGermanLocale } from '../locale';
import { Diagnostics } from './diagnostics';

describe('Diagnostics', () => {
  let fixture: ComponentFixture<Diagnostics>;
  let httpMock: HttpTestingController;
  let memorySink: MemorySink;

  function text(): string {
    return fixture.nativeElement.textContent;
  }

  beforeEach(async () => {
    localStorage.clear();
    vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    vi.spyOn(console, 'info').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [Diagnostics],
      providers: [
        provideGermanLocale(),
        provideLogging(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Diagnostics);
    httpMock = TestBed.inject(HttpTestingController);
    memorySink = TestBed.inject(MemorySink);
    TestBed.tick();
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('checks the backend and shows status and duration', async () => {
    httpMock.expectOne((r) => r.url.endsWith('/books')).flush([]);
    await fixture.whenStable();

    expect(text()).toContain('erreichbar');
    expect(text()).toContain('HTTP 200');
  });

  it('reports an unreachable backend', async () => {
    httpMock
      .expectOne((r) => r.url.endsWith('/books'))
      .flush(null, { status: 500, statusText: 'Error' });
    await fixture.whenStable();

    expect(text()).toContain('nicht erreichbar');
  });

  it('changes the log level and lists the new entry', async () => {
    httpMock.expectOne((r) => r.url.endsWith('/books')).flush([]);
    await fixture.whenStable();

    fixture.componentInstance.setLevel('warn');
    await fixture.whenStable();

    expect(TestBed.inject(Logger).level()).toBe('warn');
    expect(text()).toContain('Log-Level auf „warn“ gesetzt');
  });

  it('filters the log by level and text', async () => {
    httpMock.expectOne((r) => r.url.endsWith('/books')).flush([]);
    await fixture.whenStable();

    memorySink.clear();
    memorySink.write({ timestamp: new Date(), level: 'debug', context: 'A', message: 'leise' });
    memorySink.write({ timestamp: new Date(), level: 'error', context: 'B', message: 'laut' });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.log-row')).toHaveLength(2);

    fixture.componentInstance['filterLevel'].set('warn');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.log-row')).toHaveLength(1);

    fixture.componentInstance['filterLevel'].set('debug');
    fixture.componentInstance['filterText'].set('leise');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.log-row')).toHaveLength(1);
    expect(text()).toContain('leise');
  });

  it('shows an info notification', async () => {
    httpMock.expectOne((r) => r.url.endsWith('/books')).flush([]);
    await fixture.whenStable();

    fixture.componentInstance.showInfo();
    expect(TestBed.inject(Notifications).all()[0].message).toBe('Das ist eine Info-Meldung.');
  });
});
