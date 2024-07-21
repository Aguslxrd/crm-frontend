import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);


  if (storageService.getToken() != null) {

    if (state.url === '/login') {
      return router.createUrlTree(['/home']); 
    }
    return true;
  }

  if (state.url === '/login') {
    return true;
  }

  return router.createUrlTree(['/login']);
};