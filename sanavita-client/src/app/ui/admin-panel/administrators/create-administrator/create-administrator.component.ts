import { Component } from '@angular/core';
import { AdministratorValues } from './create-administrator.model';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-create-administrator',
  templateUrl: './create-administrator.component.html',
  styleUrl: './create-administrator.component.css'
})
export class CreateAdministratorComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  administrator: AdministratorValues = new AdministratorValues();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
  }

  saveChanges() {
    if (!this.administrator.email ||
      !this.administrator.lastName ||
      !this.administrator.middleName ||
      !this.administrator.name ||
      !this.administrator.phoneNumber) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.authService.registerAdmin(this.administrator);
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
