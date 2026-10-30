import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogEntry, LogLevel, MemorySink } from '../core/logging';
import { provideGermanLocale } from '../locale.providers';
import { LogViewer } from './log-viewer.component';

function entry(id: number, level: LogLevel, context: string, message: string): LogEntry {
  return { id, timestamp: new Date(2026, 0, 1, 12, 0, 0, id), level, context, message };
}

describe('LogViewer', () => {
  let fixture: ComponentFixture<LogViewer>;
  let sink: MemorySink;

  function rows(): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.log-row')).map((row) =>
      (row as HTMLElement).textContent!.replace(/\s+/g, ' ').trim(),
    );
  }

  async function setLevelFilter(level: string): Promise<void> {
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = level;
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
  }

  async function setTextFilter(text: string): Promise<void> {
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogViewer],
      providers: [provideGermanLocale()],
    }).compileComponents();

    sink = TestBed.inject(MemorySink);
    sink.write(entry(1, 'debug', 'Router', 'leise'));
    sink.write(entry(2, 'info', 'Http', 'mittel'));
    sink.write(entry(3, 'error', 'ErrorHandler', 'laut'));

    fixture = TestBed.createComponent(LogViewer);
    await fixture.whenStable();
  });

  it('lists all entries, newest first, with a count', () => {
    expect(rows()).toHaveLength(3);
    expect(rows()[0]).toContain('laut');
    expect(rows()[2]).toContain('leise');
    expect(fixture.nativeElement.textContent).toContain('3 von 3 Einträgen');
  });

  it('filters by minimum level', async () => {
    await setLevelFilter('warn');
    expect(rows()).toEqual([expect.stringContaining('laut')]);
    expect(fixture.nativeElement.textContent).toContain('1 von 3 Einträgen');
  });

  it('filters by context or message text, case-insensitive', async () => {
    await setTextFilter('HTTP');
    expect(rows()).toEqual([expect.stringContaining('mittel')]);

    await setTextFilter('LEISE');
    expect(rows()).toEqual([expect.stringContaining('leise')]);
  });

  it('clears the log and shows the empty state', async () => {
    const clearButton = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
      (b) => (b as HTMLButtonElement).textContent?.trim() === 'Leeren',
    ) as HTMLButtonElement;
    clearButton.click();
    await fixture.whenStable();

    expect(rows()).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('Keine Einträge.');
    expect(sink.count()).toBe(0);
  });

  it('downloads the log as JSON', () => {
    const createObjectURL = vi.fn(() => 'blob:log');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    try {
      fixture.componentInstance.download();

      expect(createObjectURL).toHaveBeenCalledOnce();
      expect(click).toHaveBeenCalledOnce();
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:log');
    } finally {
      vi.unstubAllGlobals();
      click.mockRestore();
    }
  });
});
