import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spielwiese } from './spielwiese.component';

describe('Spielwiese', () => {
  let fixture: ComponentFixture<Spielwiese>;
  let component: Spielwiese;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Spielwiese] }).compileComponents();
    fixture = TestBed.createComponent(Spielwiese);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('shows the initial message from the ReplaySubject', () => {
    expect(fixture.nativeElement.textContent).toContain('Aktueller Zustand: Hallo Spielwiese');
  });

  it('pushes a new message into the subject and clears the draft', async () => {
    component.updateDraft('Hallo Test');
    component.send();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Aktueller Zustand: Hallo Test');
    expect(fixture.nativeElement.querySelector('#message').value).toBe('');
    expect(fixture.nativeElement.querySelectorAll('.demo__history li')).toHaveLength(2);
  });

  it('ignores blank messages', async () => {
    component.updateDraft('   ');
    component.send();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.demo__history li')).toHaveLength(1);
  });

  it('derives doubled value and parity from the counter', async () => {
    component.increment();
    component.increment();
    component.increment();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(fixture.nativeElement.querySelector('[data-testid="counter-value"]').textContent).toBe(
      '3',
    );
    expect(text).toContain('6');
    expect(text).toContain('ungerade');

    component.reset();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('gerade');
  });
});
