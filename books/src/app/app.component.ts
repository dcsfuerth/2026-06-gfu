import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Toasts } from './core/notifications/toasts.component';

interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly exact?: boolean;
}

@Component({
  selector: 'books-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Toasts],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
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
    { path: '/diagnose', label: 'Diagnose' },
  ];
}
