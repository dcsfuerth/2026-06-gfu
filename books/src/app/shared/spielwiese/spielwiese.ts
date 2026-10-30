import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReplaySubject, map, scan, timer } from 'rxjs';

/**
 * Spielwiese: RxJS-Streams und Signals nebeneinander.
 *
 * `toSignal()` übernimmt das Abonnieren und räumt beim Zerstören der
 * Komponente automatisch auf. Ein manuelles `unsubscribe()` entfällt.
 */
@Component({
  selector: 'books-spielwiese',
  templateUrl: './spielwiese.html',
  styleUrl: './spielwiese.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spielwiese {
  // --- RxJS: timer() -> Signal -------------------------------------------
  private readonly ticks$ = timer(0, 500);
  protected readonly ticks = toSignal(this.ticks$, { initialValue: 0 });

  // --- RxJS: ReplaySubject -> Signal ---------------------------------------
  private readonly messages$ = new ReplaySubject<string>(5);
  protected readonly lastMessage = toSignal(this.messages$);
  protected readonly messageHistory = toSignal(
    this.messages$.pipe(
      scan((history, message) => [...history, message].slice(-5), [] as string[]),
    ),
    { initialValue: [] as string[] },
  );
  protected readonly messageCount = toSignal(this.messages$.pipe(map((_, index) => index + 1)), {
    initialValue: 0,
  });

  protected readonly draft = signal('');
  protected readonly canSend = computed(() => this.draft().trim().length > 0);

  // --- Reine Signals ---------------------------------------------------------
  protected readonly counter = signal(0);
  protected readonly doubled = computed(() => this.counter() * 2);
  protected readonly parity = computed(() => (this.counter() % 2 === 0 ? 'gerade' : 'ungerade'));

  constructor() {
    this.messages$.next('Hallo Spielwiese');
  }

  updateDraft(value: string): void {
    this.draft.set(value);
  }

  send(): void {
    const message = this.draft().trim();
    if (!message) {
      return;
    }
    this.messages$.next(message);
    this.draft.set('');
  }

  increment(): void {
    this.counter.update((value) => value + 1);
  }

  decrement(): void {
    this.counter.update((value) => value - 1);
  }

  reset(): void {
    this.counter.set(0);
  }
}
