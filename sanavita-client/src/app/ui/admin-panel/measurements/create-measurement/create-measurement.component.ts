import { Component } from '@angular/core';
import { MeasurementValues } from './create-measurement.model';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-measurement',
  templateUrl: './create-measurement.component.html',
  styleUrl: './create-measurement.component.css'
})
export class CreateMeasurementComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  measurement: MeasurementValues = new MeasurementValues();
  patients: any;
  deviceTypes: any;
  deviceTypeId: number = 0;
  devices: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getPatients();
    this.getDevices();
    this.getDeviceTypes();
  }

  saveChanges() {
    if (!this.measurement.mDeviceId ||
      !this.measurement.measurementDate ||
      !this.measurement.measurementValue ||
      !this.measurement.patientId) {
      console.log(this.measurement);
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/Measurements", this.measurement).subscribe(
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

  getPatients() {
    this.http.get(this.url + "/Patients").subscribe(data => {
      this.patients = data;
    });
  }

  getDevices() {
    this.http.get(this.url + "/MedicalDevices").subscribe(data => {
      this.devices = data;
    });
  }

  getDeviceTypes() {
    this.http.get(this.url + "/MedicalDeviceTypes").subscribe(data => {
      this.deviceTypes = data;
      this.loaded = true;
    });
  }

  changeDevices(deviceTypeId: number) {
    this.http.get(this.url + "/MedicalDevices/type/" + deviceTypeId).subscribe(data => {
      this.devices = data;
    });
  }

  getPatientFullName(patientId: number) {
    for (let patient of this.patients) {
      if (patient.patientId == patientId) {
        return patient.applicationUser.lastName + ' ' + patient.applicationUser.name + ' ' + patient.applicationUser.middleName;
      }
    }
    return '';
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
