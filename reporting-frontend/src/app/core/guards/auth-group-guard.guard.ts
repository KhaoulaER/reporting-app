import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { inject } from '@angular/core';

export const authGroupGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const authenticatedUser = authService.getAuthenticatedUser();

  if (!authenticatedUser) {
    router.navigate(['/']);
    return false;
  }

  const userGroup = authenticatedUser.groups; // Check what role this returns
  const expectedGroup = route.data['groups']; // Ensure this matches the expected group format

  if (!expectedGroup.includes(userGroup)) { 
    console.log('unauthorized')
    router.navigate(['/']); // Redirect if roles do not match
    return false;
  }
  console.log('authorized')
  return true;
};
