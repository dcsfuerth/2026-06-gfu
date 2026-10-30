import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LogEntry } from '../logging/log-level';
import { LOG_SINK, LogSink } from '../logging/log-sink';
import { AppError } from './app-error';
import { REQUEST_TIMEOUT, RETRY_COUNT, httpErrorInterceptor } from './http-error.interceptor';
import { REQUEST_ID_HEADER, httpLoggingInterceptor } from './http-logging.interceptor';

class RecordingSink implements LogSink {
  readonly entries: LogEntry[] = [];
  write(entry: LogEntry): void {
    this.entries.push(entry);
  }
}

describe('HTTP interceptors', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let sink: RecordingSink;

  beforeEach(() => {
    localStorage.setItem('books.logLevel', 'debug');
    sink = new RecordingSink();
    TestBed.configureTestingModule({
      providers: [
        { provide: LOG_SINK, useValue: sink, multi: true },
        provideHttpClient(withInterceptors([httpLoggingInterceptor, httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('adds a request id header and logs the successful response', async () => {
    const pending = http.get('/api/books').toPromise();
    const req = httpMock.expectOne('/api/books');

    expect(req.request.headers.get(REQUEST_ID_HEADER)).toMatch(/^[0-9a-f-]{36}$/);
    req.flush([]);
    await pending;

    const messages = sink.entries.map((e) => `${e.level} ${e.message}`);
    expect(messages[0]).toMatch(/^debug → GET \/api\/books/);
    expect(messages[1]).toMatch(/^info ← GET \/api\/books 200 \(\d+ ms\)/);
  });

  it('translates a 404 into a not-found AppError without retrying', async () => {
    const pending = http.get('/api/books/x').toPromise();
    httpMock.expectOne('/api/books/x').flush(null, { status: 404, statusText: 'Not Found' });

    await expect(pending).rejects.toSatisfy(
      (error: unknown) => error instanceof AppError && error.kind === 'not-found',
    );
    expect(sink.entries.some((e) => e.level === 'warn' && e.message.includes('404'))).toBe(true);
  });

  it('retries GET requests on server errors with backoff and logs each retry', async () => {
    vi.useFakeTimers();
    try {
      const pending = http
        .get('/api/books', { context: new HttpContext().set(RETRY_COUNT, 2) })
        .toPromise();

      httpMock.expectOne('/api/books').flush(null, { status: 503, statusText: 'Unavailable' });
      await vi.advanceTimersByTimeAsync(300);
      httpMock.expectOne('/api/books').flush(null, { status: 503, statusText: 'Unavailable' });
      await vi.advanceTimersByTimeAsync(600);
      httpMock.expectOne('/api/books').flush(['ok']);

      await expect(pending).resolves.toEqual(['ok']);
      const retries = sink.entries.filter((e) => e.message.startsWith('Wiederhole GET'));
      expect(retries).toHaveLength(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not retry non-GET requests', async () => {
    const pending = http.delete('/api/books/1').toPromise();
    httpMock.expectOne('/api/books/1').flush(null, { status: 500, statusText: 'Error' });

    await expect(pending).rejects.toSatisfy(
      (error: unknown) => error instanceof AppError && error.kind === 'server',
    );
  });

  it('times out per attempt and reports a timeout AppError', async () => {
    const pending = http
      .get('/api/slow', {
        context: new HttpContext().set(REQUEST_TIMEOUT, 30).set(RETRY_COUNT, 0),
      })
      .toPromise();
    const request = httpMock.expectOne('/api/slow'); // wird nie beantwortet

    await expect(pending).rejects.toSatisfy(
      (error: unknown) => error instanceof AppError && error.kind === 'timeout',
    );
    expect(request.cancelled).toBe(true);
  });
});
