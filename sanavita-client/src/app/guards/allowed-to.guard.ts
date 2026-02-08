import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const allowedToGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedOut()) {
    return true;
  } else {
    const userRole = authService.getUserInfo()!.role;
    authService.getCurrentUser(userRole).subscribe(data => {
      switch (userRole) {
        case "Patient":
        case "Пацієнт":
          router.navigate(['/pprofile/' + data.patientId]);
          break;
        case "Doctor":
        case "Лікар":
          router.navigate(['/dprofile/' + data.doctorId]);
          break;
        case "Administrator":
        case "Адміністратор":
          router.navigate(['/admin-panel']);
          break;
      }
    });
    return false;
  }
};
