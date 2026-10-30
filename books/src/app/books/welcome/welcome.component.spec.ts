import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Welcome } from './welcome.component';

describe('Welcome', () => {
  let fixture: ComponentFixture<Welcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Welcome],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Welcome);
    await fixture.whenStable();
  });

  it('renders the welcome title', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title?.textContent).toContain('Willkommen in der Bücherverwaltung!');
  });

  it('links to all feature pages', () => {
    const hrefs = Array.from(fixture.nativeElement.querySelectorAll('a.feature')).map((a) =>
      (a as HTMLAnchorElement).getAttribute('href'),
    );
    expect(hrefs).toEqual(['/books', '/calculator', '/spielwiese']);
  });
});
