import { Routes } from '@angular/router';
import { bookGuard } from './books/book-guard';

/**
 * Alle Feature-Routen werden lazy geladen. Der Router lädt die jeweilige
 * Komponente erst, wenn die Route zum ersten Mal aktiviert wird.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Start · Bücherverwaltung',
    loadComponent: () => import('./books/welcome/welcome').then((m) => m.Welcome),
  },
  {
    path: 'books',
    title: 'Bücher · Bücherverwaltung',
    loadComponent: () => import('./books/book-list/book-list').then((m) => m.BookList),
  },
  {
    path: 'book/:isbn',
    title: 'Buchdetails · Bücherverwaltung',
    canActivate: [bookGuard],
    loadComponent: () => import('./books/book-detail/book-detail').then((m) => m.BookDetail),
  },
  {
    path: 'calculator',
    title: 'Taschenrechner · Bücherverwaltung',
    loadComponent: () => import('./shared/calculator/calculator').then((m) => m.Calculator),
  },
  {
    path: 'spielwiese',
    title: 'Spielwiese · Bücherverwaltung',
    loadComponent: () => import('./shared/spielwiese/spielwiese').then((m) => m.Spielwiese),
  },
  {
    path: '**',
    title: 'Seite nicht gefunden · Bücherverwaltung',
    loadComponent: () => import('./shared/not-found/not-found').then((m) => m.NotFound),
  },
];
