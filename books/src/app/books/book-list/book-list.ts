import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'book-list',
  imports: [JsonPipe],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {

  protected books: Array<any> | null = [
    { isbn: '123-456-789', title: 'Angular 21', price: 19.99, coverUrl: 'https://angular.io/assets/images/logos/angular/angular.png' },
    { isbn: '987-654-321', title: 'Angular 22', price: 29.99, coverUrl: 'https://angular.io/assets/images/logos/angular/angular.png' }
  ];

  userName: string = 'Peter';

  deleteBook(isbn: string) {
    // const booksJson = JSON.stringify(this.books);
    console.log(`Lösche Buch mit ISBN ${isbn}`);
  }


}
