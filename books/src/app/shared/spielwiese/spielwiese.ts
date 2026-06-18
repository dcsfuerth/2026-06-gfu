import { Component } from '@angular/core';
import { map, Subject, timer } from 'rxjs';

@Component({
  selector: 'books-spielwiese',
  imports: [],
  templateUrl: './spielwiese.html',
  styleUrl: './spielwiese.css',
})
export class Spielwiese {

  private mySubject = new Subject<string>();

  constructor() {
    // const obs3$ = timer(0, 500); // läuft endlos
    // const obs4$ = obs3$.pipe(map(value => value * 2));
    // obs4$.subscribe(console.log);

    this.mySubject.next('Hallo');
    this.mySubject.subscribe(value => console.log('Subscriber 1:', value));
    this.mySubject.next('Welt');
    this.mySubject.subscribe(value => console.log('Subscriber 2:', value));
  }


}
