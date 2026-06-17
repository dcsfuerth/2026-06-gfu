import { TestBed } from '@angular/core/testing';

import { BookData } from './book-data';

describe('BookData', () => {
  let service: BookData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
