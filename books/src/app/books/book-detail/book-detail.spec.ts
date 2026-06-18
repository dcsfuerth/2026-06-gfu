import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BookDetail } from './book-detail';

describe('BookDetail', () => {
  let component: BookDetail;
  let fixture: ComponentFixture<BookDetail>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDetail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetail);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // ohne isbn-Route-Param lädt ngOnInit kein Buch (kein HTTP-Aufruf)
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
