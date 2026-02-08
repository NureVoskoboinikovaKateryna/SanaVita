import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isLoggedIn: boolean = this.authService.isLoggedIn();
  userInfo: User = new User();
  userId: number = 0;

  constructor(public authService: AuthService, private translate: TranslateService, private router: Router) {
    const savedLanguage = localStorage.getItem('language') || 'ua';
    this.translate.setDefaultLang('ua');
    this.translate.use(savedLanguage);

    if (this.isLoggedIn) {
      this.userInfo = this.authService.getUserInfo()!;

      this.authService.getCurrentUser(this.userInfo.role).subscribe(data => {
        if ("patientId" in data) {
          this.userId = data.patientId;
        } else if ("doctorId" in data) {
          this.userId = data.doctorId;
        }
      });
    }
  }

  scrollToSection(fragment: string) {
    if (this.router.url.startsWith('/home')) {
      document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => {
          document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    }
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('language', language);
  }

  logout() {
    this.authService.logout();
  }

}
