import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Rating } from './rating';

describe('Rating', () => {
  let fixture: ComponentFixture<Rating>;
  let component: Rating;

  function button(label: string): HTMLButtonElement {
    return fixture.nativeElement.querySelector(`button[aria-label="${label}"]`);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Rating] }).compileComponents();
    fixture = TestBed.createComponent(Rating);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('stars', 3.5);
    await fixture.whenStable();
  });

  it('renders partially filled stars', () => {
    const fills = Array.from(
      fixture.nativeElement.querySelectorAll('.rating__star-fill') as NodeListOf<HTMLElement>,
    ).map((el) => el.style.width);

    expect(fills).toEqual(['100%', '100%', '100%', '50%', '0%']);
    expect(fixture.nativeElement.querySelector('.rating__stars').getAttribute('aria-label')).toBe(
      '3.5 von 5 Sternen',
    );
  });

  it('emits the increased value, rounded to one decimal', () => {
    const emitted: number[] = [];
    component.starsChange.subscribe((value) => emitted.push(value));

    button('Bewertung erhöhen').click();
    expect(emitted).toEqual([3.6]);
  });

  it('emits the decreased value', () => {
    const emitted: number[] = [];
    component.starsChange.subscribe((value) => emitted.push(value));

    button('Bewertung verringern').click();
    expect(emitted).toEqual([3.4]);
  });

  it('disables the buttons at the boundaries', async () => {
    fixture.componentRef.setInput('stars', 5);
    await fixture.whenStable();
    expect(button('Bewertung erhöhen').disabled).toBe(true);
    expect(button('Bewertung verringern').disabled).toBe(false);

    fixture.componentRef.setInput('stars', 1);
    await fixture.whenStable();
    expect(button('Bewertung verringern').disabled).toBe(true);
  });

  it('hides the buttons in readonly mode', async () => {
    fixture.componentRef.setInput('readonly', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('button')).toHaveLength(0);
  });
});
