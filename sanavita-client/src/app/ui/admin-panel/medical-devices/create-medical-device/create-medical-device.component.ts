import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MedicalDeviceValues } from './create-medical-device.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-medical-device',
  templateUrl: './create-medical-device.component.html',
  styleUrl: './create-medical-device.component.css'
})
export class CreateMedicalDeviceComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  medicalDevice: MedicalDeviceValues = new MedicalDeviceValues();
  manufacturers: any;
  medicalDeviceTypes: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getManufacturers();
    this.getMedicalDeviceTypes();
  }

  saveChanges() {
    if (!this.medicalDevice.manufacturerId ||
      !this.medicalDevice.medicalDeviceTypeId ||
      !this.medicalDevice.productionYear) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/MedicalDevices", this.medicalDevice).subscribe(
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

  getManufacturers() {
    this.http.get(this.url + "/Manufacturers").subscribe(data => {
      this.manufacturers = data;
    });
  }

  getMedicalDeviceTypes() {
    this.http.get(this.url + "/MedicalDeviceTypes").subscribe(data => {
      this.medicalDeviceTypes = data;
      this.loaded = true;
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
