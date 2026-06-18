import { Routes } from '@angular/router';
import { BookDetail } from './books/book-detail/book-detail';
import { BookList } from './books/book-list/book-list';
import { Welcome } from './books/welcome/welcome';
import { NotFound } from './shared/not-found/not-found';

export const routes: Routes = [
    { path: '', component: Welcome, pathMatch: 'full' },
    { path: 'books', component: BookList },
    { path: 'book/:isbn', component: BookDetail },
    { path: '**', component: NotFound }
];
