import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOG_SINK, Logger, MemorySink } from '../core/logging';
import { LogLevelSwitch } from './log-level-switch.component';

describe('LogLevelSwitch', () => {
  let fixture: ComponentFixture<LogLevelSwitch>;

  function button(level: string): HTMLButtonElement {
    return Array.from(fixture.nativeElement.querySelectorAll('button')).find(
      (b) => (b as HTMLButtonElement).textContent?.trim() === level,
    ) as HTMLButtonElement;
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LogLevelSwitch],
      providers: [{ provide: LOG_SINK, useExisting: MemorySink, multi: true }],
    }).compileComponents();
    fixture = TestBed.createComponent(LogLevelSwitch);
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it('offers one button per level and marks the active one', () => {
    expect(fixture.nativeElement.querySelectorAll('button')).toHaveLength(4);
    expect(button('info').getAttribute('aria-pressed')).toBe('true');
    expect(button('warn').getAttribute('aria-pressed')).toBe('false');
  });

  it('switches the logger level and records the change in the log', async () => {
    button('warn').click();
    await fixture.whenStable();

    expect(TestBed.inject(Logger).level()).toBe('warn');
    expect(button('warn').getAttribute('aria-pressed')).toBe('true');
    expect(TestBed.inject(MemorySink).entries().at(-1)?.message).toBe(
      'Log-Level auf „warn“ gesetzt',
    );
  });
});
