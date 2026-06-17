import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export class RatingEvent {
  constructor(public id: string, public operation: string) { }
}

@Component({
  selector: 'rating',
  imports: [DecimalPipe],
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class Rating implements OnChanges {

  @Input()
  stars: number = 3.2;

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
