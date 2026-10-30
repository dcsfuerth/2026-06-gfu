import { TestBed } from '@angular/core/testing';
import { LogEntry } from './log-level.model';
import { LOG_SINK, LogSink } from './log-sink.model';
import { Logger } from './logger.service';
import { LOGGING_CONFIG } from './logging.config';
import { provideLogging } from './logging.providers';
import { MemorySink } from './memory.sink';

class RecordingSink implements LogSink {
  readonly entries: LogEntry[] = [];
  write(entry: LogEntry): void {
    this.entries.push(entry);
  }
}

describe('Logger', () => {
  let logger: Logger;
  let sink: RecordingSink;

  beforeEach(() => {
    localStorage.clear();
    sink = new RecordingSink();
    TestBed.configureTestingModule({
      providers: [{ provide: LOG_SINK, useValue: sink, multi: true }],
    });
    logger = TestBed.inject(Logger);
  });

  it('starts at the info level unless configured otherwise', () => {
    expect(logger.level()).toBe('info');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: LOGGING_CONFIG, useValue: { level: 'error' } }],
    });
    expect(TestBed.inject(Logger).level()).toBe('error');
  });

  it('writes entries at or above the active level to all sinks with increasing ids', () => {
    logger.setLevel('info');
    const log = logger.withContext('Test');

    log.debug('verworfen');
    log.info('behalten');
    log.error('auch behalten', { code: 42 });

    expect(sink.entries.map((e) => e.message)).toEqual(['behalten', 'auch behalten']);
    expect(sink.entries.map((e) => e.id)).toEqual([1, 2]);
    expect(sink.entries[0]).toMatchObject({ level: 'info', context: 'Test' });
    expect(sink.entries[1].data).toEqual({ code: 42 });
  });

  it('persists the level and restores it on the next instance', () => {
    logger.setLevel('error');
    expect(localStorage.getItem('books.logLevel')).toBe('error');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    expect(TestBed.inject(Logger).level()).toBe('error');
  });

  it('reports whether a level is enabled', () => {
    logger.setLevel('warn');
    expect(logger.isEnabled('debug')).toBe(false);
    expect(logger.isEnabled('warn')).toBe(true);
    expect(logger.isEnabled('error')).toBe(true);
  });
});

describe('provideLogging', () => {
  beforeEach(() => localStorage.clear());

  it('sets the start level and registers console and memory sinks', () => {
    TestBed.configureTestingModule({ providers: [provideLogging({ level: 'warn' })] });
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const logger = TestBed.inject(Logger);
    expect(logger.level()).toBe('warn');

    logger.withContext('Test').warn('hallo');
    expect(
      TestBed.inject(MemorySink)
        .entries()
        .map((e) => e.message),
    ).toEqual(['hallo']);
    expect(consoleWarn).toHaveBeenCalledOnce();
  });
});

describe('MemorySink', () => {
  it('keeps the newest entries up to its capacity', () => {
    const sink = new MemorySink();
    for (let i = 0; i < 250; i++) {
      sink.write({ id: i, timestamp: new Date(), level: 'info', context: 'T', message: `m${i}` });
    }
    expect(sink.count()).toBe(200);
    expect(sink.entries()[0].message).toBe('m50');
    expect(sink.entries().at(-1)?.message).toBe('m249');

    sink.clear();
    expect(sink.count()).toBe(0);
  });
});
