import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Book } from '../book';
import { BookData } from './book-data';

const BOOKS: Book[] = [{ isbn: '1-2', title: 'Test', price: 10, coverUrl: '', stars: 3 }];

describe('BookData', () => {
  let service: BookData;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BookData);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads all books via GET /books', async () => {
    const resource = TestBed.runInInjectionContext(() => service.getBooks());
    TestBed.tick();

    const req = httpMock.expectOne((r) => r.url.endsWith('/books'));
    expect(req.request.method).toBe('GET');
    req.flush(BOOKS);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(resource.value()).toEqual(BOOKS);
    expect(resource.status()).toBe('resolved');
  });

  it('loads a single book and refetches when the isbn changes', async () => {
    const isbn = signal('1-2');
    const resource = TestBed.runInInjectionContext(() => service.getBook(isbn));
    TestBed.tick();

    httpMock.expectOne((r) => r.url.endsWith('/books/1-2')).flush(BOOKS[0]);
    await TestBed.inject(ApplicationRef).whenStable();
    expect(resource.value()?.title).toBe('Test');

    isbn.set('3-4');
    TestBed.tick();
    httpMock.expectOne((r) => r.url.endsWith('/books/3-4')).flush({ ...BOOKS[0], isbn: '3-4' });
    await TestBed.inject(ApplicationRef).whenStable();
    expect(resource.value()?.isbn).toBe('3-4');
  });

  it('deletes a book via DELETE /books/:isbn', async () => {
    const pending = service.deleteBook('1-2');
    const req = httpMock.expectOne((r) => r.url.endsWith('/books/1-2'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await pending;
  });
});
