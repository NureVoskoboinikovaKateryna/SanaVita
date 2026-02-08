import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, switchMap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medical-records',
  templateUrl: './medical-records.component.html',
  styleUrl: './medical-records.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MedicalRecordsComponent {

  url: string = environment.apiBaseUrl;
  medicalRecords: any;
  patient: any;
  loading: boolean = true;
  userInfo: any;
  filterDoctor: string = '';
  filterDate: string = '';

  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {
    this.userInfo = this.authService.getUserInfo();
    this.getPatientAndMedicalRecords();
  }

  getPatientAndMedicalRecords() {
    this.http.get(this.url + "/Patients/email/" + this.userInfo.email).pipe(
      switchMap((patient: any) => {
        this.patient = patient;
        return this.http.get(this.url + "/MedicalRecords/patient/" + this.patient.patientId);
      })
    ).subscribe((medicalRecords: any) => {
      this.medicalRecords = medicalRecords.sort((a: any, b: any) => {
        return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
      });
      for (let i = 0; i < this.medicalRecords.length; i++) {
        this.getDoctorFullName(medicalRecords[i].doctorId).subscribe(name => {
          this.medicalRecords[i].doctorFullName = name;
        });
      }
      this.loading = false;
    });
  }

  getDoctorFullName(doctorId: number): Observable<any> {
    return this.http.get(this.url + '/Doctors/' + doctorId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName;
      })
    );
  }

  filteredRecords() {
    return this.medicalRecords.filter((record: any) => {
      const doctorMatch = record.doctorFullName
        .toLowerCase()
        .includes(this.filterDoctor.toLowerCase());
      const dateMatch = !this.filterDate || record.visitDate.startsWith(this.filterDate);
      return doctorMatch && dateMatch;
    });
  }

}
