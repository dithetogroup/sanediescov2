import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { DataSharingService } from '../data-sharing/data-sharing.service';


export const rolesGuard: CanActivateFn = (route, state) => {
  const dataSharingService = inject(DataSharingService);
  const router = inject(Router);

  // ✅ Get current user
  const user = dataSharingService.getUserData();

  if (!user) {
    // ❌ Not logged in
    return router.parseUrl('/authentication/login');
  }

  // ✅ Get allowed roles from route data
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // No specific role restriction
  }

  // ✅ Check if user role matches allowed roles
  if (allowedRoles.includes(user.role)) {
    return true; // ✅ Allowed
  }

  // ❌ User has no permission → redirect to unauthorized page
  return router.parseUrl('/pages/unauthorized'); // create an UnauthorizedComponent to show "Access Denied"
};
