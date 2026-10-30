import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Feature {
  readonly path: string;
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'books-welcome',
  imports: [RouterLink],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Welcome {
  protected readonly features: readonly Feature[] = [
    {
      path: '/books',
      title: 'Bücher',
      text: 'Sammlung durchsuchen, Bewertungen anpassen und Details ansehen.',
    },
    {
      path: '/calculator',
      title: 'Taschenrechner',
      text: 'Ein kleines Formular auf Basis von Signal Forms.',
    },
    {
      path: '/spielwiese',
      title: 'Spielwiese',
      text: 'RxJS-Streams und Signals im Zusammenspiel ausprobieren.',
    },
  ];
}
