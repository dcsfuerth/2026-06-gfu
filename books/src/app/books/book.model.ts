export interface Book {
  readonly isbn: string;
  readonly title: string;
  readonly price: number;
  readonly coverUrl: string;
  readonly stars: number;
  readonly comment?: string;
}

/** Bücher unter diesem Preis (in Euro) werden als Angebot hervorgehoben. */
export const DISCOUNT_PRICE_LIMIT = 20;

/** Ob ein Buch als Angebot gilt. */
export function isDiscounted(book: Pick<Book, 'price'>): boolean {
  return book.price < DISCOUNT_PRICE_LIMIT;
}
