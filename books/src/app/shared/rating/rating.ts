import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** SVG-Pfad eines fünfzackigen Sterns im 24x24-Raster. */
const STAR_PATH =
  'M12 2l2.9 6.26 6.87.6-5.2 4.52 1.56 6.72L12 17.27 5.87 20.1l1.56-6.72-5.2-4.52 6.87-.6L12 2z';

/**
 * Sternebewertung mit Teilsternen.
 *
 * `stars` ist ein reiner Input; Änderungen werden über `starsChange`
 * gemeldet, der Aufrufer entscheidet, ob er sie übernimmt.
 */
@Component({
  selector: 'books-rating',
  templateUrl: './rating.html',
  styleUrl: './rating.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Rating {
  /** Aktuelle Bewertung, z. B. 3.5 */
  readonly stars = input.required<number>();

  /** Anzahl der Sterne. */
  readonly max = input(5);

  /** Schrittweite der Plus-/Minus-Buttons. */
  readonly step = input(0.1);

  /** Blendet die Buttons aus. */
  readonly readonly = input(false);

  readonly starsChange = output<number>();

  protected readonly starPath = STAR_PATH;

  /**
   * Füllgrad (0–100 %) je Stern, abgeleitet aus `stars`.
   * z. B. stars = 3.5 -> [100, 100, 100, 50, 0]
   */
  protected readonly starFills = computed(() =>
    Array.from({ length: this.max() }, (_, i) => Math.max(0, Math.min(1, this.stars() - i)) * 100),
  );

  protected readonly label = computed(() => `${this.stars()} von ${this.max()} Sternen`);

  protected readonly canIncrease = computed(() => this.stars() < this.max());
  protected readonly canDecrease = computed(() => this.stars() > 1);

  increase(): void {
    this.emitClamped(this.stars() + this.step());
  }

  decrease(): void {
    this.emitClamped(this.stars() - this.step());
  }

  private emitClamped(value: number): void {
    const clamped = Math.min(this.max(), Math.max(1, value));
    this.starsChange.emit(Math.round(clamped * 10) / 10);
  }
}
