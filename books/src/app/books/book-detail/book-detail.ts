import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppError } from '../../core/errors';
import { Rating } from '../../shared/rating/rating';
import { isDiscounted } from '../book';
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

  /** Das Backend kennt die ISBN nicht; alle anderen Fehler sind technischer Natur. */
  protected readonly notFound = computed(() => {
    const error = this.bookResource.error();
    if (error instanceof AppError) {
      return error.kind === 'not-found';
    }
    return error instanceof HttpErrorResponse && error.status === HttpStatusCode.NotFound;
  });

  /** Verständliche Meldung für technische Fehler. */
  protected readonly loadErrorMessage = computed(() => {
    const error = this.bookResource.error();
    return error instanceof AppError ? error.message : '';
  });

  protected readonly isDiscounted = isDiscounted;
}
