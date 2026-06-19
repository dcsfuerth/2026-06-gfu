import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReplaySubject, Subscription, timer } from 'rxjs';
@Component({
  selector: 'books-spielwiese',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './spielwiese.html',
  styleUrl: './spielwiese.css',
})
export class Spielwiese implements OnDestroy {

  protected mySubject$ = new ReplaySubject(5);
  protected obs3$ = timer(0, 500); // läuft endlos
  nachrichtentext: string = '';
  protected mySubscriptions: Subscription[] = [];

  constructor() {
    // this.obs3$.subscribe(console.log);
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
    // this.mySubject$.subscribe(e => console.log(e));


  }
  ngOnDestroy(): void {
    // this.mySubscriptions.forEach((s) => s.unsubscribe());
  }

  nachricht(message: string) {
    this.mySubject$.next(message);
  }


}
