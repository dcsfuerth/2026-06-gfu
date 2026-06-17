import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'book-list',
  imports: [FormsModule, NgClass],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
  // encapsulation: ViewEncapsulation.None
})
export class BookList {

  protected books: Array<any> | null = [
    { isbn: '123-456-789', title: 'Angular 21', price: 19.99, coverUrl: 'https://m.media-amazon.com/images/I/71Wv+d6oP6L._AC_UY218_.jpg' },
    { isbn: '987-654-321', title: 'Angular 22', price: 29.99, coverUrl: 'https://m.media-amazon.com/images/I/71xR-hhRjmL._AC_UY218_.jpg' }
  ];

  userName: string = 'Peter';

  coverVisible: boolean = true;
  suchBegriff: string = '';

  deleteBook(isbn: string) {
    // const booksJson = JSON.stringify(this.books);
    console.log(`Lösche Buch mit ISBN ${isbn}`);
  }

  toggleCover() {
    this.coverVisible = !this.coverVisible;
  }

}
