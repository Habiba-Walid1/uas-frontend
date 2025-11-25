import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // get current logged-in user
  const sessionUser = sessionStorage.getItem('activeUser');
  const localUser = localStorage.getItem('currentUser');
  const user = sessionUser
    ? JSON.parse(sessionUser)
    : localUser
    ? JSON.parse(localUser)
    : null;

  if (!user) {
    // Not logged in → redirect to login
    router.navigate(['/login']);
    return false;
  }

  // Check allowed roles from the route data
  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // user exists but not allowed
    router.navigate(['/']);
    return false;
  }

  return true;
};
