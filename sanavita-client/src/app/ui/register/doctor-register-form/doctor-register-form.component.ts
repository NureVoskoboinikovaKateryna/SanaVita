import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterData } from './doctor-register-form.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-register-form',
  templateUrl: './doctor-register-form.component.html',
  styleUrl: './doctor-register-form.component.css'
})
export class DoctorRegisterFormComponent {

  @Output() onSubmitEvent = new EventEmitter<any>();
  @Input() createView: any;

  url: string = environment.apiBaseUrl;
  registrationData: RegisterData = new RegisterData();
  specializations: any;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.getSpecializations();
  }

  getSpecializations(): any {
    this.http.get(this.url + "/Specializations").subscribe(data => {
      this.specializations = data;
    });
  }

  onSubmit() {
    if (!this.registrationData.email ||
      !this.registrationData.lastName ||
      !this.registrationData.middleName ||
      !this.registrationData.name ||
      !this.registrationData.password ||
      !this.registrationData.confirmPassword ||
      !this.registrationData.phoneNumber ||
      !this.registrationData.spezId) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    if (this.registrationData.password != this.registrationData.confirmPassword) {
      this.toastr.error("Паролі не співпадають", "Помилка");
      return;
    }

    this.onSubmitEvent.emit(this.registrationData);
  }
}
