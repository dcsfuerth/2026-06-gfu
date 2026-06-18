import { Component } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'books-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private mysubscription: Subscription;
  public title: string = 'Bücherverwaltung';

  constructor(private router: Router) {

    const eventStream = this.router.events;
    const eventStream2 = eventStream.pipe(filter(event => event instanceof NavigationStart));
    const eventStream3 = eventStream2.pipe(map(event => event.url));

    this.mysubscription = eventStream3.subscribe(event => {
      console.log('Router Event:', event);
    });
  }


  stop() {
    this.mysubscription?.unsubscribe();
  }
}

