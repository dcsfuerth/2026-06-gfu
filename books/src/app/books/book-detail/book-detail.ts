import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookData } from '../bookdata/book-data';
import { Book } from '../book';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'books-book-detail',
  imports: [CurrencyPipe],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail implements OnInit {

  protected book: Book | undefined;
  protected readonly maxStars = Array.from({ length: 5 });

  constructor(private router: Router, private bookDataService: BookData, private cd: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    this.book = await this.bookDataService.getBook('123-456-789');
    this.cd.detectChanges();
  }

  goBack() {
    this.router.navigate(['/books']);
  }

}
