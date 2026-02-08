import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RegisterData } from './patient-register-form.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-register-form',
  templateUrl: './patient-register-form.component.html',
  styleUrl: './patient-register-form.component.css'
})
export class PatientRegisterFormComponent {
  @Output() onSubmitEvent = new EventEmitter<any>();
  @Input() createView: any;
 
  url: string = environment.apiBaseUrl;
  registrationData: RegisterData = new RegisterData();
  companies: any;
  bloodTypes: any;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.getCompanies();
    this.getBloodTypes();
  }

  getCompanies(): any {
    this.http.get(this.url + "/Companies").subscribe(data => {
      this.companies = data;
    });
  }

  getBloodTypes(): any {
    this.http.get(this.url + "/BloodTypes").subscribe(data => {
      this.bloodTypes = data;
    });
  }

  onSubmit() {
    if (!this.registrationData.email ||
      !this.registrationData.lastName ||
      !this.registrationData.name ||
      !this.registrationData.password ||
      !this.registrationData.confirmPassword ||
      !this.registrationData.companyId ||
      !this.registrationData.bTypeId ||
      !this.registrationData.age ||
      !this.registrationData.height ||
      !this.registrationData.gender) {
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
