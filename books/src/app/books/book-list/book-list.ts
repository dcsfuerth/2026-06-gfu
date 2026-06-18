import { CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Rating, RatingEvent } from "../../shared/rating/rating";
import { Book } from '../book';
import { BookFilterPipe } from "../book-filter-pipe";
import { BookData } from '../bookdata/book-data';


@Component({
  selector: 'book-list',
  imports: [FormsModule, CurrencyPipe, BookFilterPipe, Rating],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
  // encapsulation: ViewEncapsulation.None
})
export class BookList implements OnInit, OnDestroy {

  protected books: Book[] = [];
  userName: string = 'Peter';
  coverVisible: boolean = true;
  suchBegriff: string = '';

  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private bookDataService: BookData = inject(BookData);

  async ngOnInit() {
    this.books = await this.bookDataService.getBooks();
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    console.log('BookList.ngOnDestroy()');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('BookList.ngOnChanges()', changes);
  }

  upvote(isbn: string) {
    console.log(`BookList - Upvote für Buch mit ISBN ${isbn}`);
    const book = this.books.find(book => book.isbn === isbn);
    if (book) {
      book.stars = +Math.min(5, book.stars + 0.1).toFixed(1);
    }
  }

  downvote(isbn: string) {
    console.log(`BookList - Downvote für Buch mit ISBN ${isbn}`);
    const book = this.books.find(book => book.isbn === isbn);
    if (book) {
      book.stars = +Math.max(1, book.stars - 0.1).toFixed(1);
    }
  }

  ratingChange(event: RatingEvent) {
    if (event.operation === 'upvote') {
      this.upvote(event.id);
    } else if (event.operation === 'downvote') {
      this.downvote(event.id);
    }
  }

  deleteBook(isbn: string) {
    // const booksJson = JSON.stringify(this.books);
    console.log(`Lösche Buch mit ISBN ${isbn}`);
  }

  toggleCover() {
    this.coverVisible = !this.coverVisible;
  }

}
