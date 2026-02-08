import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MRecord } from './add-dmedical-record.model';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-dmedical-record',
  templateUrl: './add-dmedical-record.component.html',
  styleUrl: './add-dmedical-record.component.css'
})
export class AddDmedicalRecordComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  mrecord: MRecord = new MRecord();
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
      this.mrecord.doctorId = data.doctorId;
    });

    this.getPatients();
  }

  saveChanges() {
    if (!this.mrecord.diagnosis ||
      !this.mrecord.medications ||
      !this.mrecord.visitDate ||
      !this.mrecord.patientId) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/MedicalRecords", this.mrecord).subscribe(
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
    this.router.navigate(['/dmedical-records']);
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
