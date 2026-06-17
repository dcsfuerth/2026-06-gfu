import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'book-list',
  imports: [JsonPipe],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {

  books = [
    { isbn: '123-456-789', title: 'Angular 21', price: 19.99 },
    { isbn: '987-654-321', title: 'Angular 22', price: 29.99 }
  ];

  userName = 'Peter';

  deleteBook(isbn: string) {
    console.log(`Lösche Buch mit ISBN ${isbn}`);
  }


}
