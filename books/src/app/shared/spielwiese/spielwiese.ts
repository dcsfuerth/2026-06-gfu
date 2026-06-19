import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
@Component({
  selector: 'books-spielwiese',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './spielwiese.html',
  styleUrl: './spielwiese.css',
})
export class Spielwiese {

  protected mySubject$ = new ReplaySubject(5);
  nachrichtentext: string = '';

  constructor() {
    // const obs3$ = timer(0, 500); // läuft endlos
    // const obs4$ = obs3$.pipe(map(value => value * 2));
    // obs4$.subscribe(console.log);

    // this.mySubject.next('Hallo');
    // this.mySubject.subscribe(value => console.log('Subscriber 1:', value));
    // this.mySubject.next('Welt');
    // this.mySubject.subscribe(value => console.log('Subscriber 2:', value));

    // // Startwert muß angegeben werden
    // this.mySubject$.subscribe(e => console.log(1, e));
    // // next() überschreibt den Startwert
    // this.mySubject$.next('ich glaube schon');
    // this.mySubject$.subscribe(e => console.log(2, e));
    // this.mySubject$.next('na klar');

    this.mySubject$.next('ich glaube schon');
    this.mySubject$.next('na klar1');
    this.mySubject$.next('na klar2');
    this.mySubject$.next('na klar3');
    this.mySubject$.subscribe(e => console.log(e));


  }

  nachricht(message: string) {
    this.mySubject$.next(message);
  }


}
