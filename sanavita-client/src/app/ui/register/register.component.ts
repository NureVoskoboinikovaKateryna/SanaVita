import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  url: string = environment.apiBaseUrl;
  userType: string = "Patient";
  createView: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService, private authService: AuthService, private router: Router) { }

  registerDoctor(event: any) {
    this.authService.registerDoctor(event);
  }

  registerPatient(event: any) {
    this.authService.registerPatient(event);
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
}
