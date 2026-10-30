import { HttpClient, HttpResourceRef, httpResource } from '@angular/common/http';
import { Injectable, Signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book } from '../book.model';

/**
 * Datenzugriff auf das Buch-Backend.
 *
 * Lesende Zugriffe liefern `httpResource`-Instanzen: Sie laden automatisch,
 * reagieren auf Änderungen ihrer Signal-Parameter und stellen Lade- und
 * Fehlerzustand als Signals bereit. Da ein Resource an den Lebenszyklus
 * seines Erzeugers gebunden ist, müssen diese Methoden in einem
 * Injection-Kontext aufgerufen werden (z. B. als Feld-Initialisierer einer
 * Komponente).
 */
@Injectable({
  providedIn: 'root',
})
export class BookData {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.SERVER_URL;

  /** Alle Bücher als Resource. */
  getBooks(): HttpResourceRef<Book[] | undefined> {
    return httpResource<Book[]>(() => `${this.baseUrl}/books`);
  }

  /** Ein einzelnes Buch als Resource; lädt neu, sobald sich `isbn` ändert. */
  getBook(isbn: Signal<string>): HttpResourceRef<Book | undefined> {
    return httpResource<Book>(() => this.bookUrl(isbn()));
  }

  /** Speichert eine neue Bewertung und liefert das aktualisierte Buch. */
  updateStars(isbn: string, stars: number): Promise<Book> {
    return firstValueFrom(this.http.patch<Book>(this.bookUrl(isbn), { stars }));
  }

  /** Löscht ein Buch auf dem Server. */
  deleteBook(isbn: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(this.bookUrl(isbn)));
  }

  private bookUrl(isbn: string): string {
    return `${this.baseUrl}/books/${encodeURIComponent(isbn)}`;
  }
}
