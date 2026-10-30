import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly exact?: boolean;
}

@Component({
  selector: 'books-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = 'Bücherverwaltung';
  protected readonly angularVersion = VERSION.full;

  protected readonly navItems: readonly NavItem[] = [
    { path: '/', label: 'Start', exact: true },
    { path: '/books', label: 'Bücher' },
    { path: '/calculator', label: 'Taschenrechner' },
    { path: '/spielwiese', label: 'Spielwiese' },
  ];
}
