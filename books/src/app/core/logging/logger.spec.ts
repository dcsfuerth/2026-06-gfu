import { TestBed } from '@angular/core/testing';
import { LogEntry } from './log-level';
import { LOG_SINK, LogSink } from './log-sink';
import { Logger } from './logger';
import { MemorySink } from './memory-sink';

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

  it('writes entries at or above the active level to all sinks', () => {
    logger.setLevel('info');
    const log = logger.withContext('Test');

    log.debug('verworfen');
    log.info('behalten');
    log.error('auch behalten', { code: 42 });

    expect(sink.entries.map((e) => e.message)).toEqual(['behalten', 'auch behalten']);
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

describe('MemorySink', () => {
  it('keeps the newest entries up to its capacity', () => {
    const sink = new MemorySink();
    for (let i = 0; i < 250; i++) {
      sink.write({ timestamp: new Date(), level: 'info', context: 'T', message: `m${i}` });
    }
    expect(sink.count()).toBe(200);
    expect(sink.entries()[0].message).toBe('m50');
    expect(sink.entries().at(-1)?.message).toBe('m249');

    sink.clear();
    expect(sink.count()).toBe(0);
  });
});
