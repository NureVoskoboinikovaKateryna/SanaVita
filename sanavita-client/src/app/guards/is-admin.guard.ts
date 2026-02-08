import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedOut()) {
    router.navigate(['/home']);
    return false;
  } else {
    const userRole = authService.getUserInfo()!.role;
    return firstValueFrom(authService.getCurrentUser(userRole)).then((data) => {
      if (userRole === 'Administrator' || userRole === 'Адміністратор') {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    });
  }
};
