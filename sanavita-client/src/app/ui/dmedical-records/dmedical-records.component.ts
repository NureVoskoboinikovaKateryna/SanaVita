import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, switchMap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dmedical-records',
  templateUrl: './dmedical-records.component.html',
  styleUrl: './dmedical-records.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DmedicalRecordsComponent {

  url: string = environment.apiBaseUrl;
  medicalRecords: any;
  doctor: any;
  loading: boolean = true;
  userInfo: any;

  filterPatient: string = '';
  filterDate: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.userInfo = this.authService.getUserInfo();
    this.getDoctorAndMedicalRecords();
  }

  getDoctorAndMedicalRecords() {
    this.http.get(this.url + "/Doctors/email/" + this.userInfo.email).pipe(
      switchMap((doctor: any) => {
        this.doctor = doctor;
        return this.http.get(this.url + "/MedicalRecords/doctor/" + this.doctor.doctorId);
      })
    ).subscribe((medicalRecords: any) => {
      this.medicalRecords = medicalRecords.sort((a: any, b: any) => {
        return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
      });
      for (let i = 0; i < this.medicalRecords.length; i++) {
        this.getPatientFullName(medicalRecords[i].patientId).subscribe(name => {
          this.medicalRecords[i].patientFullName = name;
        });
      }

      this.loading = false;
    });
  }

  deleteMRecord(medicalRecordId: number): void {
    this.http.delete(this.url + "/MedicalRecords/" + medicalRecordId).subscribe(res => {
      for (let i = 0; i < this.medicalRecords.length; i++) {
        if (this.medicalRecords[i].medicalRecordId == medicalRecordId) {
          this.medicalRecords.splice(i, 1);
          break;
        }
      }
    });
  }

  editMRecord(medicalRecordId: number): void {
    this.router.navigate(['/edit-record', medicalRecordId]);
  }

  getPatientFullName(patientId: number): Observable<any> {
    return this.http.get(this.url + '/Patients/' + patientId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName;
      })
    );
  }

  filteredRecords() {
    return this.medicalRecords.filter((record: any) => {
      const patientMatch = record.patientFullName
        .toLowerCase()
        .includes(this.filterPatient.toLowerCase());
      const dateMatch = !this.filterDate || record.visitDate.startsWith(this.filterDate);
      return patientMatch && dateMatch;
    });
  }

}
