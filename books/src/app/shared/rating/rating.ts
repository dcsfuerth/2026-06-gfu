import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export class RatingEvent {
  constructor(public id: string, public operation: string) { }
}

@Component({
  selector: 'rating',
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class Rating implements OnChanges {

  /** Anzahl der anzuzeigenden Sterne. */
  readonly maxStars = 5;

  @Input()
  stars: number = 3.2;

  /**
   * Füllgrad (0–100 %) je Stern, abgeleitet aus `stars`.
   * z. B. stars = 3.5 -> [100, 100, 100, 50, 0]
   */
  get starFills(): number[] {
    return Array.from({ length: this.maxStars }, (_, i) =>
      Math.max(0, Math.min(1, this.stars - i)) * 100
    );
  }

  @Input()
  id: string = ``;

  @Output()
  up: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  down: EventEmitter<string> = new EventEmitter<string>();



  @Output()
  ratingChange: EventEmitter<RatingEvent> = new EventEmitter<RatingEvent>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Rating.ngOnChanges()', changes);
  }

  upvote() {
    console.log(`Upvote für ${this.id}`);
    this.up.emit(this.id);

    // this.ratingChange.emit(new RatingEvent(this.id, 'upvote'));
  }

  downvote() {
    console.log(`Downvote für ${this.id}`);
    this.down.emit(this.id);
  }



}
