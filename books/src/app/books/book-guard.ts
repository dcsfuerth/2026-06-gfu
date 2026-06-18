import { CanActivateFn } from '@angular/router';

export const bookGuard: CanActivateFn = (route, state) => {
  const isbn = route.paramMap.get('isbn');
  console.log('bookGuard', isbn);
  //return true;
  return isbn === '123-456-789';
};
