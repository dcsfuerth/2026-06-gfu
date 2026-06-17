import { Pipe, PipeTransform } from '@angular/core';
import { Book } from './book';

@Pipe({
  name: 'bookFilter',
})
export class BookFilterPipe implements PipeTransform {

  // (books | bookFilter : searchValue)

  transform(booklist: Book[] = [], suchbegriff: string = ''): Book[] {

    if (suchbegriff.trim() === '') {
      return booklist;
    }

    const searchValue = suchbegriff.toLowerCase().trim();

    const ergebnis = booklist.filter(book =>
      book.title.toLowerCase().includes(searchValue)
    );

    return ergebnis;
  }
}
