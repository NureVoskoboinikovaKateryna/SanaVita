import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Notification } from './add-dnotification.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-dnotification',
  templateUrl: './add-dnotification.component.html',
  styleUrl: './add-dnotification.component.css'
})
export class AddDnotificationComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  notification: Notification = new Notification();
  patients: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.authService.getCurrentUser('doctor').subscribe(data => {
      this.notification.senderId = data.doctorId;
    });

    this.getPatients();
  }

  saveChanges() {
    if (!this.notification.content ||
      !this.notification.date ||
      !this.notification.patientId ||
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

  getBack() {
    this.router.navigate(['/dnotifications']);
  }

  getPatients() {
    this.http.get(this.url + "/Patients").subscribe(data => {
      this.patients = data;
      for (let i = 0; i < this.patients.length; i++) {
        this.patients[i].fullName = this.patients[i].applicationUser.lastName + ' ' +
          this.patients[i].applicationUser.name + ' ' +
          this.patients[i].applicationUser.middleName;
      }

      this.loaded = true;
    });
  }

}
