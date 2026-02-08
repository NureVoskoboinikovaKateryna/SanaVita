import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { EditingMedicalRecordValues } from './put-medical-record.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-put-medical-record',
  templateUrl: './put-medical-record.component.html',
  styleUrl: './put-medical-record.component.css'
})
export class PutMedicalRecordComponent implements OnInit {

  medicalRecordId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: EditingMedicalRecordValues = new EditingMedicalRecordValues();
  changesBefore: EditingMedicalRecordValues = new EditingMedicalRecordValues();
  medicalRecord: any;
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
      this.medicalRecordId = data['medicalRecordId'];
      this.getMedicalRecord();
      this.changesBefore = { ...this.changes };
    });

    this.getPatients();
    this.getDoctors();
  }

  getMedicalRecord() {
    this.http.get(this.url + "/MedicalRecords/" + this.medicalRecordId).subscribe((data: any) => {
      this.medicalRecord = data;

      this.changes.diagnosis = data.diagnosis;
      this.changes.doctorId = data.doctorId;
      this.changes.medicalRecordId = data.medicalRecordId;
      this.changes.medications = data.medications;
      this.changes.patientId = data.patientId;
      this.changes.visitDate = data.visitDate;
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

    this.http.put(this.url + "/MedicalRecords/" + this.medicalRecordId, this.changes).subscribe(res => {
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
