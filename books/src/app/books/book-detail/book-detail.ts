import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Rating } from '../../shared/rating/rating';
import { BookData } from '../bookdata/book-data';

@Component({
  selector: 'books-book-detail',
  imports: [CurrencyPipe, RouterLink, Rating],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetail {
  private readonly bookData = inject(BookData);

  /** Wird vom Router aus dem Routen-Parameter `:isbn` gesetzt. */
  readonly isbn = input.required<string>();

  /** Lädt das Buch und lädt automatisch neu, wenn sich die ISBN ändert. */
  protected readonly bookResource = this.bookData.getBook(this.isbn);
}
