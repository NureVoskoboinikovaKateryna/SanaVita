import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MedicalDeviceTypeValues } from './create-medical-device-type.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-medical-device-type',
  templateUrl: './create-medical-device-type.component.html',
  styleUrl: './create-medical-device-type.component.css'
})
export class CreateMedicalDeviceTypeComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  medicalDeviceType: MedicalDeviceTypeValues = new MedicalDeviceTypeValues();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  saveChanges() {
    if (!this.medicalDeviceType.name) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/MedicalDeviceTypes", this.medicalDeviceType).subscribe(
      (response: any) => {
        if (!response.ok) {
          this.toastr.error(response.message, "Помилка");
        } else {
          this.getBack();
        }
      },
      error => {
        this.toastr.error("Проблема сервера, спробуйте пізніше", "Помилка");
      }
    );
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
