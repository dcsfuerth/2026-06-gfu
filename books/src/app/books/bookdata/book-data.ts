import { Injectable } from '@angular/core';
import { Book } from '../book';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookData {

  private URL = 'http://localhost:3000/books';

  constructor(private http: HttpClient) { }

  public getBooks(): Promise<Book[]> {
    const obs = this.http.get<Book[]>(this.URL);
    const prom = firstValueFrom(obs);
    return prom;
  }

  public getBooksOld(): Book[] {
    return [
      { isbn: '123-456-789', title: 'Angular 21', price: 19.99, coverUrl: 'https://m.media-amazon.com/images/I/71Wv+d6oP6L._AC_UY218_.jpg', stars: 3.5 },
      { isbn: '987-654-321', title: 'Angular 22', price: 29.9, coverUrl: 'https://m.media-amazon.com/images/I/71xR-hhRjmL._AC_UY218_.jpg', stars: 4.5 }
    ];
  }

  // public getBook(isbn: string): Book | undefined {
  //   return this.getBooks().find(book => book.isbn === isbn);
  // }
}
