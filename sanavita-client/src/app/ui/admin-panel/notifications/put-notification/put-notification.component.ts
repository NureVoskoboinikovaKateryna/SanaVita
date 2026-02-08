import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { EditingNotificationValues } from './put-notification.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-put-notification',
  templateUrl: './put-notification.component.html',
  styleUrl: './put-notification.component.css'
})
export class PutNotificationComponent {

  notificationId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: EditingNotificationValues = new EditingNotificationValues();
  changesBefore: EditingNotificationValues = new EditingNotificationValues();
  notification: any;
  loaded: boolean = false;
  patients: any;
  doctors: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.notificationId = data['notificationId'];
      this.getNotification();
      this.changesBefore = { ...this.changes };
    });

    this.getPatients();
    this.getDoctors();
  }

  getNotification() {
    this.http.get(this.url + "/Notifications/" + this.notificationId).subscribe((data: any) => {
      this.notification = data;

      this.changes.content = data.content;
      this.changes.date = data.date;
      this.changes.notificationId = data.notificationId;
      this.changes.patientId = data.patientId;
      this.changes.senderId = data.senderId;
      this.changes.title = data.title;
    });
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

  saveChanges() {
    if (this.compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/Notifications/" + this.notificationId, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  compDicts(dict1: any, dict2: any): boolean {
    return JSON.stringify(dict1) == JSON.stringify(dict2);
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
