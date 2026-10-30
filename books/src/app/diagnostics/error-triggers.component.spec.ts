import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LOG_SINK, MemorySink } from '../core/logging';
import { Notifications } from '../core/notifications/notifications.service';
import { ErrorTriggers } from './error-triggers.component';

describe('ErrorTriggers', () => {
  let component: ErrorTriggers;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ErrorTriggers],
      providers: [
        { provide: LOG_SINK, useExisting: MemorySink, multi: true },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    component = TestBed.createComponent(ErrorTriggers).componentInstance;
  });

  it('throws synchronously so the error reaches the ErrorHandler via the event handler', () => {
    expect(() => component.throwInHandler()).toThrow('Demo: Fehler im Event-Handler');
  });

  it('shows an info notification and logs it', () => {
    component.showInfo();

    expect(TestBed.inject(Notifications).all()).toEqual([
      expect.objectContaining({ kind: 'info', message: 'Das ist eine Info-Meldung.' }),
    ]);
    expect(TestBed.inject(MemorySink).entries().at(-1)?.message).toBe('Demo: Info-Meldung');
  });
});
