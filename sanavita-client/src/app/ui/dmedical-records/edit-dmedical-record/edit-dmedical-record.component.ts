import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MRecord } from './edit-dmedical-record.model';

@Component({
  selector: 'app-edit-dmedical-record',
  templateUrl: './edit-dmedical-record.component.html',
  styleUrl: './edit-dmedical-record.component.css'
})
export class EditDmedicalRecordComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  medicalRecordEdit: MRecord = new MRecord();
  medicalRecordEditBefore: any;
  patients: any;
  medicalRecordId: number = 0;
  medicalRecord: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.medicalRecordId = data['medicalRecordId'];

      this.http.get(this.url + "/MedicalRecords/" + this.medicalRecordId).subscribe((data: any) => {
        this.medicalRecord = data;

        this.medicalRecordEdit.diagnosis = data.diagnosis;
        this.medicalRecordEdit.medications = data.medications;
        this.medicalRecordEdit.visitDate = data.visitDate;
        this.medicalRecordEdit.patientId = data.patientId;
        this.medicalRecordEdit.doctorId = data.doctorId;
        this.medicalRecordEdit.medicalRecordId = this.medicalRecordId;

        this.medicalRecordEditBefore = { ...this.medicalRecordEdit };
      });
    });

    this.getPatients();
  }

  compDicts(dict1: any, dict2: any): boolean {
    return JSON.stringify(dict1) == JSON.stringify(dict2);
  }

  saveChanges() {
    if (!this.medicalRecordEdit.diagnosis ||
      !this.medicalRecordEdit.medications ||
      !this.medicalRecordEdit.visitDate ||
      !this.medicalRecordEdit.patientId) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    if (this.compDicts(this.medicalRecordEditBefore, this.medicalRecordEdit)) {
      this.cancelChanges();
      return;
    }

    this.http.put(this.url + "/MedicalRecords/" + this.medicalRecordId, this.medicalRecordEdit).subscribe(
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

  cancelChanges() {
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
