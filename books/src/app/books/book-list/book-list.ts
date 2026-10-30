import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Rating } from '../../shared/rating/rating';
import { Book } from '../book';
import { BookData } from '../bookdata/book-data';

@Component({
  selector: 'books-book-list',
  imports: [CurrencyPipe, Rating, RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {
  private readonly bookData = inject(BookData);

  /** Die Bücher vom Server, inkl. Lade- und Fehlerzustand. */
  protected readonly booksResource = this.bookData.getBooks();

  protected readonly searchTerm = signal('');
  protected readonly coverVisible = signal(true);
  protected readonly deleteError = signal<string | null>(null);

  protected readonly books = computed(() => this.booksResource.value() ?? []);

  /** Nach dem Suchbegriff gefilterte Liste (Titel, Groß-/Kleinschreibung egal). */
  protected readonly filteredBooks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const books = this.books();
    return term ? books.filter((book) => book.title.toLowerCase().includes(term)) : books;
  });

  protected readonly resultCount = computed(() => this.filteredBooks().length);

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  toggleCover(): void {
    this.coverVisible.update((visible) => !visible);
  }

  /** Übernimmt eine geänderte Bewertung in die lokale Liste. */
  updateStars(isbn: string, stars: number): void {
    this.booksResource.value.update((books) =>
      books?.map((book) => (book.isbn === isbn ? { ...book, stars } : book)),
    );
  }

  async deleteBook(book: Book): Promise<void> {
    this.deleteError.set(null);
    try {
      await this.bookData.deleteBook(book.isbn);
      this.booksResource.value.update((books) => books?.filter((b) => b.isbn !== book.isbn));
    } catch {
      this.deleteError.set(`„${book.title}“ konnte nicht gelöscht werden.`);
    }
  }
}
