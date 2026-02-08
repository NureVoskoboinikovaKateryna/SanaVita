import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, switchMap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dpatients',
  templateUrl: './dpatients.component.html',
  styleUrl: './dpatients.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DpatientsComponent {

  url: string = environment.apiBaseUrl;
  patients: any;
  patientsFiltered: any;
  doctor: any;
  userInfo: any;
  loaded: boolean = false;
  search: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.userInfo = this.authService.getUserInfo();
    this.getDoctorAndPatients();
  }

  getDoctorAndPatients() {
    this.http.get(this.url + "/Doctors/email/" + this.userInfo.email).pipe(
      switchMap((doctor: any) => {
        this.doctor = doctor;
        return this.http.get(this.url + "/Patients/doctor/" + this.doctor.doctorId);
      })
    ).subscribe((patients: any) => {
      this.patients = patients;
      for (let i = 0; i < this.patients.length; i++) {
        this.getMedicalRecords(this.patients[i].patientId).subscribe(data => {
          this.patients[i].mRecords = data;

          let lastRecordDate;
          for (let record of data) {
            if (!lastRecordDate) {
              lastRecordDate = record.visitDate;
              continue;
            }

            if (lastRecordDate < record.visitDate) {
              lastRecordDate = record.visitDate;
            }
          }

          const inputDate: Date = new Date(lastRecordDate);
          const formattedDate: string = `${inputDate.getDate().toString().padStart(2, '0')}/${(inputDate.getMonth() + 1).toString().padStart(2, '0')}/${inputDate.getFullYear()} ${inputDate.getHours().toString().padStart(2, '0')}:${inputDate.getMinutes().toString().padStart(2, '0')}:${inputDate.getSeconds().toString().padStart(2, '0')}`;
          this.patients[i].lastRecordDate = formattedDate;
        });

        this.getPatientFullName(this.patients[i].patientId).subscribe(data => {
          this.patients[i].fullName = data;
        });
      }

      this.patientsFiltered = [ ...this.patients ];
      this.loaded = true;
    });
  }

  searchPatient(value: string): void {
    this.patientsFiltered = this.patients.filter((p: any) => p.fullName.toLowerCase().includes(value.toLowerCase()));
  }

  getPatientFullName(patientId: number): Observable<any> {
    return this.http.get(this.url + '/Patients/' + patientId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName
      })
    );
  }

  getMedicalRecords(patientId: number): Observable<any> {
    return this.http.get(this.url + "/MedicalRecords/patient/" + patientId + "/doctor/" + this.doctor.doctorId);
  }

}
