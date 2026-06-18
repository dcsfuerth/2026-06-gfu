import { Injectable } from '@angular/core';
import { Book } from '../book';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookData {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  public getBooks(): Promise<Book[]> {
    const obs = this.http.get<Book[]>(`${this.URL}/books`);
    const prom = firstValueFrom(obs);
    return prom;
  }

  public getBook(isbn: string): Promise<Book> {
    const obs = this.http.get<Book>(`${this.URL}/books/${isbn}`);
    const prom = firstValueFrom(obs);
    return prom;
  }

}
