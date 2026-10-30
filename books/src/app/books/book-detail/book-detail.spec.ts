import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideGermanLocale } from '../../locale';
import { Book } from '../book';
import { BookDetail } from './book-detail';

const BOOK: Book = {
  isbn: '123-456-789',
  title: 'Angular 22',
  price: 29.9,
  coverUrl: 'https://example.test/cover.jpg',
  stars: 4.5,
  comment: 'Sehr empfehlenswert.',
};

describe('BookDetail', () => {
  let fixture: ComponentFixture<BookDetail>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetail],
      providers: [
        provideGermanLocale(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetail);
    fixture.componentRef.setInput('isbn', BOOK.isbn);
    httpMock = TestBed.inject(HttpTestingController);
    TestBed.tick();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests the book for the given isbn', () => {
    const req = httpMock.expectOne((r) => r.url.endsWith('/books/123-456-789'));
    expect(req.request.method).toBe('GET');
    req.flush(BOOK);
  });

  it('renders the book', async () => {
    httpMock.expectOne((r) => r.url.endsWith('/books/123-456-789')).flush(BOOK);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Angular 22');
    expect(text).toContain('29,90\u00a0€');
    expect(text).toContain('Sehr empfehlenswert.');
  });

  it('shows a not-found message when the request fails', async () => {
    httpMock
      .expectOne((r) => r.url.endsWith('/books/123-456-789'))
      .flush(null, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Buch nicht gefunden');
  });

  it('reloads when the isbn changes', async () => {
    httpMock.expectOne((r) => r.url.endsWith('/books/123-456-789')).flush(BOOK);
    await fixture.whenStable();

    fixture.componentRef.setInput('isbn', '987');
    TestBed.tick();

    httpMock
      .expectOne((r) => r.url.endsWith('/books/987'))
      .flush({ ...BOOK, title: 'Anderes Buch' });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Anderes Buch');
  });
});
