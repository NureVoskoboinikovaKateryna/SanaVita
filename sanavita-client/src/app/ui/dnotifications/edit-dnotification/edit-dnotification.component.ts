import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Notification } from './edit-dnotification.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';

@Component({
  selector: 'app-edit-dnotification',
  templateUrl: './edit-dnotification.component.html',
  styleUrl: './edit-dnotification.component.css'
})
export class EditDnotificationComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  notificationEdit: Notification = new Notification();
  notificationEditBefore: any;
  patients: any;
  notificationId: number = 0;
  notification: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.notificationId = data['notificationId'];

      this.http.get(this.url + "/Notifications/" + this.notificationId).subscribe((data: any) => {
        this.notification = data;

        this.notificationEdit.content = data.content;
        this.notificationEdit.date = data.date;
        this.notificationEdit.notificationId = this.notificationId;
        this.notificationEdit.patientId = data.patientId;
        this.notificationEdit.senderId = data.senderId;
        this.notificationEdit.title = data.title;

        this.notificationEditBefore = { ...this.notificationEdit };
      });
    });

    this.getPatients();
  }

  compDicts(dict1: any, dict2: any): boolean {
    return JSON.stringify(dict1) == JSON.stringify(dict2);
  }

  saveChanges() {
    if (!this.notificationEdit.content ||
      !this.notificationEdit.date ||
      !this.notificationEdit.patientId ||
      !this.notificationEdit.title) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    if (this.compDicts(this.notificationEditBefore, this.notificationEdit)) {
      this.cancelChanges();
      return;
    }

    this.http.put(this.url + "/Notifications/" + this.notificationId, this.notificationEdit).subscribe(
      (response: any) => {
        if (!response.ok) {
          this.toastr.error(response.message, "Помилка");
        } else {
          this.cancelChanges();
        }
      },
      error => {
        this.toastr.error("Проблема сервера, спробуйте пізніше", "Помилка");
      }
    );
  }

  updateDate(value: string): void {
    const parsedDate = new Date(value);
    const formattedDate = moment(parsedDate).format();
    this.notificationEdit.date = formattedDate;
  }

  cancelChanges() {
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
