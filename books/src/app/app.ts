import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookList } from './books/book-list/book-list';

@Component({
  selector: 'books-root',
  imports: [RouterOutlet, BookList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public title: string = 'Bücherverwaltung';
}

const antwort = 42;