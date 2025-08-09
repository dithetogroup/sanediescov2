import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { DataSharingService } from '../data-sharing/data-sharing.service';


export const authGuard: CanActivateFn = (route, state) => {
  const dataSharingService = inject(DataSharingService);
  const router = inject(Router);

  const user = dataSharingService.getUserData();

  if (user) {
    // ✅ Token expiration check
    const currentTime = Math.floor(Date.now() / 1000);
    if ((user as any).exp && (user as any).exp < currentTime) {
      dataSharingService.logout();
      return router.parseUrl('/authentication'); // ❌ Redirect if expired
    }
    return true; // ✅ Allow navigation
  }

  // ❌ Not logged in → redirect to login
  return router.parseUrl('/authentication');
};
