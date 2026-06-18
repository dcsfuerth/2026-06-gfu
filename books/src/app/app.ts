import { Component } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'books-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(private router: Router) {

    const eventStream = this.router.events;
    const eventStream2 = eventStream.pipe(filter(event => event instanceof NavigationStart));

    eventStream2.subscribe(event => {
      console.log('Router Event:', event, typeof event, event.constructor.name);
    });
  }

  public title: string = 'Bücherverwaltung';
}

const antwort = 42;