import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound', () => {
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(NotFound);
    await fixture.whenStable();
  });

  it('renders a 404 message with a link home', () => {
    expect(fixture.nativeElement.textContent).toContain('Seite nicht gefunden');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe('/');
  });
});
