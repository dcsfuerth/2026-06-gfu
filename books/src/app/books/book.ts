export interface Book {
  readonly isbn: string;
  readonly title: string;
  readonly price: number;
  readonly coverUrl: string;
  readonly stars: number;
  readonly comment?: string;
}
