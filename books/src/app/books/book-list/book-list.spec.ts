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

  /** Lässt ausstehende Promise-Ketten (z. B. nach einem HTTP-Flush) durchlaufen. */
  async function settle(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  }

  function dialog(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog');
  }

  function dialogButton(label: string): HTMLButtonElement {
    return Array.from(dialog().querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === label,
    ) as HTMLButtonElement;
  }

  /** Klickt in der Zeile auf „Löschen“ und bestätigt die Rückfrage. */
  async function deleteViaDialog(title: string): Promise<void> {
    (
      fixture.nativeElement.querySelector(
        `button[aria-label="Buch „${title}“ löschen"]`,
      ) as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    expect(dialog().open).toBe(true);
    dialogButton('Löschen').click();
    await fixture.whenStable();
  }

  /** Beantwortet den initialen GET /books mit den angegebenen Büchern. */
  async function respondWithBooks(books: Book[]): Promise<void> {
    TestBed.tick();
    httpMock.expectOne((req) => req.url.endsWith('/books')).flush(books);
    await fixture.whenStable();
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
    await respondWithBooks([]);
  });

  it('shows the empty state when no books exist', async () => {
    await respondWithBooks([]);
    expect(fixture.nativeElement.textContent).toContain('Leider noch keine Bücher vorhanden.');
  });

  it('shows an error with a retry option when loading fails', async () => {
    TestBed.tick();
    httpMock
      .expectOne((req) => req.url.endsWith('/books'))
      .flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Die Bücher konnten nicht geladen werden.');
    expect(fixture.nativeElement.querySelector('[role="alert"] button')?.textContent).toContain(
      'Erneut versuchen',
    );
  });

  describe('with books', () => {
    beforeEach(async () => {
      await respondWithBooks(BOOKS);
    });

    it('renders a placeholder instead of an image for books without a cover', () => {
      expect(fixture.nativeElement.querySelectorAll('img')).toHaveLength(0);
      expect(
        fixture.nativeElement.querySelectorAll('.book-table__cover--placeholder'),
      ).toHaveLength(2);
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

    it('shows an empty-result hint spanning all visible columns when nothing matches', async () => {
      fixture.componentInstance.updateSearch('Vue');
      await fixture.whenStable();

      expect(fixture.nativeElement.textContent).toContain('Keine Treffer für „Vue“');
      expect(
        fixture.nativeElement.querySelector('.book-table__empty')?.getAttribute('colspan'),
      ).toBe('6');

      fixture.componentInstance.toggleCover();
      await fixture.whenStable();
      expect(
        fixture.nativeElement.querySelector('.book-table__empty')?.getAttribute('colspan'),
      ).toBe('5');
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

    it('asks for confirmation and keeps the book when cancelled', async () => {
      (
        fixture.nativeElement.querySelector(
          'button[aria-label="Buch „Angular Grundlagen“ löschen"]',
        ) as HTMLButtonElement
      ).click();
      await fixture.whenStable();

      expect(dialog().open).toBe(true);
      expect(dialog().textContent).toContain('„Angular Grundlagen“ wird dauerhaft');

      dialogButton('Abbrechen').click();
      await fixture.whenStable();

      expect(dialog().open).toBe(false);
      expect(rows()).toHaveLength(2);
      httpMock.expectNone((req) => req.method === 'DELETE');
    });

    it('removes a book after a confirmed, successful delete', async () => {
      await deleteViaDialog('Angular Grundlagen');
      httpMock
        .expectOne((req) => req.method === 'DELETE' && req.url.endsWith('/books/111'))
        .flush(null);
      await settle();

      expect(dialog().open).toBe(false);
      expect(rows()).toHaveLength(1);
      expect(rows()[0].textContent).toContain('RxJS kompakt');
    });

    it('keeps the book and shows an error when the delete fails', async () => {
      await deleteViaDialog('Angular Grundlagen');
      httpMock
        .expectOne((req) => req.method === 'DELETE')
        .flush(null, { status: 500, statusText: 'Server Error' });
      await settle();

      expect(rows()).toHaveLength(2);
      expect(fixture.nativeElement.textContent).toContain('konnte nicht gelöscht werden');
    });
  });
});
