import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private bookDataService: BookData,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {

    const isbn = this.route.snapshot.paramMap.get('isbn');

    if (isbn) {
      this.book = await this.bookDataService.getBook(isbn);
    } else {
      this.book = undefined;
    }

    this.cd.detectChanges();

    // this.route.paramMap.subscribe(async params => {
    //   const isbn = params.get('isbn');
    //   if (isbn) {
    //     this.book = await this.bookDataService.getBook(isbn);
    //   } else {
    //     this.book = undefined;
    //   }
    //   this.cd.markForCheck();
    // }

  }

  goBack() {
    this.router.navigate(['/books']);
  }

}
