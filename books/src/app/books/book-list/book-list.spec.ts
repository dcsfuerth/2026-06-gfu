import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideGermanLocale } from '../../locale';
import { Book } from '../book';
import { BookList } from './book-list';

const BOOKS: Book[] = [
  { isbn: '111', title: 'Angular Grundlagen', price: 19.99, coverUrl: '', stars: 3.5 },
  { isbn: '222', title: 'RxJS kompakt', price: 29.9, coverUrl: '', stars: 4.5 },
];

describe('BookList', () => {
  let fixture: ComponentFixture<BookList>;
  let httpMock: HttpTestingController;

  function rows(): HTMLTableRowElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('tbody tr'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [
        provideGermanLocale(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows a loading state before the response arrives', async () => {
    TestBed.tick();
    expect(fixture.nativeElement.textContent).toContain('Bücher werden geladen');
    httpMock.expectOne((req) => req.url.endsWith('/books')).flush([]);
    await fixture.whenStable();
  });

  it('shows the empty state when no books exist', async () => {
    TestBed.tick();
    httpMock.expectOne((req) => req.url.endsWith('/books')).flush([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Leider noch keine Bücher vorhanden.');
  });

  describe('with books', () => {
    beforeEach(async () => {
      TestBed.tick();
      httpMock.expectOne((req) => req.url.endsWith('/books')).flush(BOOKS);
      await fixture.whenStable();
    });

    it('renders one row per book', () => {
      expect(rows()).toHaveLength(2);
      expect(fixture.nativeElement.textContent).toContain('Angular Grundlagen');
      expect(fixture.nativeElement.textContent).toContain('19,99\u00a0€');
    });

    it('filters by title, case-insensitive', async () => {
      fixture.componentInstance.updateSearch('rxjs');
      await fixture.whenStable();

      expect(rows()).toHaveLength(1);
      expect(rows()[0].textContent).toContain('RxJS kompakt');
    });

    it('shows an empty-result hint when nothing matches', async () => {
      fixture.componentInstance.updateSearch('Vue');
      await fixture.whenStable();

      expect(fixture.nativeElement.textContent).toContain('Keine Treffer für „Vue“');
    });

    it('toggles the cover column', async () => {
      const coverHeader = () =>
        Array.from(fixture.nativeElement.querySelectorAll('th')).some((th) =>
          (th as HTMLElement).textContent?.includes('Cover'),
        );

      expect(coverHeader()).toBe(true);
      fixture.componentInstance.toggleCover();
      await fixture.whenStable();
      expect(coverHeader()).toBe(false);
    });

    it('updates the stars of a single book', async () => {
      fixture.componentInstance.updateStars('111', 3.6);
      await fixture.whenStable();

      const ratings = fixture.nativeElement.querySelectorAll('.rating__stars');
      expect(ratings[0].getAttribute('aria-label')).toBe('3.6 von 5 Sternen');
      expect(ratings[1].getAttribute('aria-label')).toBe('4.5 von 5 Sternen');
    });

    it('removes a book after a successful delete', async () => {
      const pending = fixture.componentInstance.deleteBook(BOOKS[0]);
      httpMock
        .expectOne((req) => req.method === 'DELETE' && req.url.endsWith('/books/111'))
        .flush(null);
      await pending;
      await fixture.whenStable();

      expect(rows()).toHaveLength(1);
      expect(rows()[0].textContent).toContain('RxJS kompakt');
    });

    it('keeps the book and shows an error when the delete fails', async () => {
      const pending = fixture.componentInstance.deleteBook(BOOKS[0]);
      httpMock
        .expectOne((req) => req.method === 'DELETE')
        .flush(null, { status: 500, statusText: 'Server Error' });
      await pending;
      await fixture.whenStable();

      expect(rows()).toHaveLength(2);
      expect(fixture.nativeElement.textContent).toContain('konnte nicht gelöscht werden');
    });
  });
});
