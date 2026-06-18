import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BookList } from './book-list';

describe('BookList', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // löst ngOnInit aus, das BookData.getBooks() aufruft
    fixture.detectChanges();

    // den HTTP-Aufruf aus ngOnInit abfangen und mit leerer Liste beantworten
    httpMock.expectOne((req) => req.url.endsWith('/books')).flush([]);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
