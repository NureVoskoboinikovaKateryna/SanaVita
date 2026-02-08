import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { NotificationValues } from './create-notification.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrl: './create-notification.component.css'
})
export class CreateNotificationComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  notification: NotificationValues = new NotificationValues();
  patients: any;
  doctors: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getPatients();
    this.getDoctors();
  }

  saveChanges() {
    if (!this.notification.content ||
      !this.notification.date ||
      !this.notification.patientId ||
      this.notification.senderId == -1 ||
      !this.notification.title) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/Notifications", this.notification).subscribe(
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

  getDoctors() {
    this.http.get(this.url + "/Doctors").subscribe(data => {
      this.doctors = data;
      this.loaded = true;
    });
  }

  getDoctorFullName(doctorId: number) {
    for (let doctor of this.doctors) {
      if (doctor.doctorId == doctorId) {
        return doctor.applicationUser.lastName + ' ' + doctor.applicationUser.name + ' ' + doctor.applicationUser.middleName;
      }
    }
    return '';
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
