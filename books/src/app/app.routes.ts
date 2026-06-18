import { Routes } from '@angular/router';
import { BookDetail } from './books/book-detail/book-detail';
import { BookList } from './books/book-list/book-list';
import { Welcome } from './books/welcome/welcome';
import { NotFound } from './shared/not-found/not-found';
import { bookGuard } from './books/book-guard';
import { Calculator } from './shared/calculator/calculator';
import { Spielwiese } from './shared/spielwiese/spielwiese';

export const routes: Routes = [
    { path: '', component: Welcome, pathMatch: 'full' },
    { path: 'books', component: BookList },
    { path: 'book/:isbn', component: BookDetail, canActivate: [bookGuard] },
    { path: 'calculator', component: Calculator },
    { path: 'spielwiese', component: Spielwiese },
    { path: '**', component: NotFound }
];
