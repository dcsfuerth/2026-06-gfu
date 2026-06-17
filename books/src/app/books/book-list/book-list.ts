import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../book';
import { BookFilterPipe } from "../book-filter-pipe";


@Component({
  selector: 'book-list',
  imports: [FormsModule, CurrencyPipe, BookFilterPipe],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
  // encapsulation: ViewEncapsulation.None
})
export class BookList implements OnInit, OnDestroy {

  protected books: Book[] = [
    { isbn: '123-456-789', title: 'Angular 21', price: 19.99, coverUrl: 'https://m.media-amazon.com/images/I/71Wv+d6oP6L._AC_UY218_.jpg' },
    { isbn: '987-654-321', title: 'Angular 22', price: 29.9, coverUrl: 'https://m.media-amazon.com/images/I/71xR-hhRjmL._AC_UY218_.jpg' }
  ];

  userName: string = 'Peter';
  coverVisible: boolean = true;
  suchBegriff: string = '';

  constructor() {
    console.log('BookList.constructor()');
  }

  ngOnInit() {
    console.log('BookList.ngOnInit()');
  }

  ngOnDestroy() {
    console.log('BookList.ngOnDestroy()');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('BookList.ngOnChanges()', changes);
  }

  deleteBook(isbn: string) {
    // const booksJson = JSON.stringify(this.books);
    console.log(`Lösche Buch mit ISBN ${isbn}`);
  }

  toggleCover() {
    this.coverVisible = !this.coverVisible;
  }

}
