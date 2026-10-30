import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppError } from '../../core/errors';
import { Logger } from '../../core/logging';
import { Notifications } from '../../core/notifications/notifications';
import { Rating } from '../../shared/rating/rating';
import { Book, isDiscounted } from '../book';
import { BookData } from '../bookdata/book-data';

/** Spalten der Tabelle ohne die optionale Cover-Spalte. */
const BASE_COLUMN_COUNT = 5;

@Component({
  selector: 'books-book-list',
  imports: [CurrencyPipe, Rating, RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {
  private readonly bookData = inject(BookData);
  private readonly notifications = inject(Notifications);
  private readonly log = inject(Logger).withContext('BookList');

  /** Die Bücher vom Server, inkl. Lade- und Fehlerzustand. */
  protected readonly booksResource = this.bookData.getBooks();

  protected readonly searchTerm = signal('');
  protected readonly coverVisible = signal(true);
  /** Fehlermeldung der letzten Aktion (Bewerten oder Löschen). */
  protected readonly actionError = signal<string | null>(null);

  /** Das Buch, für das gerade die Lösch-Rückfrage offen ist. */
  protected readonly pendingDelete = signal<Book | null>(null);

  private readonly confirmDialog = viewChild<ElementRef<HTMLDialogElement>>('confirmDialog');

  /**
   * Im Fehlerzustand wirft `value()`; daher über `hasValue()` absichern,
   * damit das Template die Fehlermeldung rendern kann.
   */
  protected readonly books = computed(() =>
    this.booksResource.hasValue() ? this.booksResource.value() : [],
  );

  /** Nach dem Suchbegriff gefilterte Liste (Titel, Groß-/Kleinschreibung egal). */
  protected readonly filteredBooks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const books = this.books();
    return term ? books.filter((book) => book.title.toLowerCase().includes(term)) : books;
  });

  protected readonly resultCount = computed(() => this.filteredBooks().length);

  /** Verständliche Meldung, falls das Laden fehlschlägt. */
  protected readonly loadErrorMessage = computed(() => {
    const error = this.booksResource.error();
    return error instanceof AppError ? error.message : 'Unbekannter Fehler.';
  });

  /** Anzahl der sichtbaren Spalten, z. B. für `colspan` der Hinweiszeile. */
  protected readonly columnCount = computed(
    () => BASE_COLUMN_COUNT + (this.coverVisible() ? 1 : 0),
  );

  protected readonly isDiscounted = isDiscounted;

  constructor() {
    // Der Dialog folgt dem Signal: offen, solange eine Rückfrage aussteht.
    effect(() => {
      const dialog = this.confirmDialog()?.nativeElement;
      if (!dialog) {
        return;
      }
      if (this.pendingDelete()) {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else if (dialog.open) {
        dialog.close();
      }
    });
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  toggleCover(): void {
    this.coverVisible.update((visible) => !visible);
  }

  /**
   * Speichert eine geänderte Bewertung. Die Liste wird sofort aktualisiert
   * (optimistisch); schlägt das Speichern fehl, wird der alte Wert
   * wiederhergestellt.
   */
  async updateStars(book: Book, stars: number): Promise<void> {
    this.actionError.set(null);
    this.patchBook(book.isbn, { stars });
    try {
      await this.bookData.updateStars(book.isbn, stars);
      this.log.debug(`Bewertung für ${book.isbn} auf ${stars} gespeichert`);
    } catch (error) {
      this.log.error(`Bewertung für ${book.isbn} konnte nicht gespeichert werden`, error);
      this.patchBook(book.isbn, { stars: book.stars });
      this.actionError.set(`Die Bewertung von „${book.title}“ konnte nicht gespeichert werden.`);
    }
  }

  /** Öffnet die Rückfrage; gelöscht wird erst nach Bestätigung. */
  requestDelete(book: Book): void {
    this.pendingDelete.set(book);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): Promise<void> {
    const book = this.pendingDelete();
    this.pendingDelete.set(null);
    return book ? this.deleteBook(book) : Promise.resolve();
  }

  private async deleteBook(book: Book): Promise<void> {
    this.actionError.set(null);
    try {
      await this.bookData.deleteBook(book.isbn);
      this.booksResource.value.update((books) => books?.filter((b) => b.isbn !== book.isbn));
      this.log.info(`Buch ${book.isbn} gelöscht`);
      this.notifications.success(`„${book.title}“ wurde gelöscht.`);
    } catch (error) {
      this.log.error(`Löschen von ${book.isbn} fehlgeschlagen`, error);
      this.actionError.set(`„${book.title}“ konnte nicht gelöscht werden.`);
    }
  }

  /** Ändert ein Buch in der lokalen Liste. */
  private patchBook(isbn: string, changes: Partial<Book>): void {
    this.booksResource.value.update((books) =>
      books?.map((book) => (book.isbn === isbn ? { ...book, ...changes } : book)),
    );
  }
}
