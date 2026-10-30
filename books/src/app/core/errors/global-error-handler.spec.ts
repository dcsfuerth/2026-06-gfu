import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LogEntry } from '../logging/log-level';
import { LOG_SINK, LogSink } from '../logging/log-sink';
import { Notifications } from '../notifications/notifications';
import { GlobalErrorHandler } from './global-error-handler';

class RecordingSink implements LogSink {
  readonly entries: LogEntry[] = [];
  write(entry: LogEntry): void {
    this.entries.push(entry);
  }
}

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let notifications: Notifications;
  let sink: RecordingSink;

  beforeEach(() => {
    sink = new RecordingSink();
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandler, { provide: LOG_SINK, useValue: sink, multi: true }],
    });
    handler = TestBed.inject(GlobalErrorHandler);
    notifications = TestBed.inject(Notifications);
  });

  it('logs the error and shows a notification', () => {
    handler.handleError(new Error('Autsch'));

    expect(sink.entries).toHaveLength(1);
    expect(sink.entries[0]).toMatchObject({ level: 'error', context: 'ErrorHandler' });
    expect(sink.entries[0].message).toContain('Autsch');
    expect(notifications.all()).toEqual([
      expect.objectContaining({ kind: 'error', message: 'Autsch' }),
    ]);
  });

  it('translates HTTP errors into user-facing messages', () => {
    handler.handleError(new HttpErrorResponse({ status: 404, url: '/x' }));
    expect(notifications.all()[0].message).toBe('Der angeforderte Datensatz wurde nicht gefunden.');
  });

  it('unwraps promise rejections', () => {
    handler.handleError({ rejection: new Error('aus Promise') });
    expect(notifications.all()[0].message).toBe('aus Promise');
  });

  it('suppresses duplicate notifications within a short window but keeps logging', () => {
    handler.handleError(new Error('gleich'));
    handler.handleError(new Error('gleich'));

    expect(sink.entries).toHaveLength(2);
    expect(notifications.all()).toHaveLength(1);
  });
});
