import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookList } from './books/book-list/book-list';
import { Calculator } from "./shared/calculator/calculator";

@Component({
  selector: 'books-root',
  imports: [RouterOutlet, BookList, Calculator],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public title: string = 'Bücherverwaltung';
}

const antwort = 42;