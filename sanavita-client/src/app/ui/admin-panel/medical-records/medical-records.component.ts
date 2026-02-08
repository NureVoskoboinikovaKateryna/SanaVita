import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-medical-records',
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
export class AdminMedicalRecordsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  medicalRecords: any;
  medicalRecordsFiltered: any;
  medicalRecordsFilteredAndSorted: any;
  loaded: boolean = false;
  sortBy: any = {};

  constructor(
    private http: HttpClient
  ) {
    this.sortBy = {
      id: {
        asc: true,
        desc: false
      },
      date: {
        asc: false,
        desc: false
      },
      doctor: {
        asc: false,
        desc: false
      },
      patient: {
        asc: false,
        desc: false
      }
    };

    this.getMedicalRecords();
  }

  deactivate() {
    for (let key1 in this.sortBy) {
      for (let key2 in this.sortBy[key1]) {
        if (this.sortBy[key1][key2]) {
          this.sortBy[key1][key2] = false;
          return;
        }
      }
    }
  }

  sort() {
    if (this.sortBy.id.asc) {
      this.medicalRecordsFilteredAndSorted.sort((a: any, b: any) => a.medicalRecordId - b.medicalRecordId);
    } else if (this.sortBy.id.desc) {
      this.medicalRecordsFilteredAndSorted.sort((a: any, b: any) => b.medicalRecordId - a.medicalRecordId);
    } else if (this.sortBy.date.asc) {
      this.medicalRecordsFilteredAndSorted.sort((a: any, b: any) => {
        const dateA: Date = new Date(a.visitDate);
        const dateB: Date = new Date(b.visitDate);
        return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
      });
    } else if (this.sortBy.date.desc) {
      this.medicalRecordsFilteredAndSorted.sort((a: any, b: any) => {
        const dateA: Date = new Date(a.visitDate);
        const dateB: Date = new Date(b.visitDate);
        return (dateB < dateA) ? -1 : (dateB > dateA) ? 1 : 0;
      });
    } else if (this.sortBy.doctor.asc) {
      this.medicalRecordsFilteredAndSorted.sort((a: any, b: any) => a.doctorFullName.localeCompare(b.doctorFullName));
    } else if (this.sortBy.doctor.desc) {
      this.medicalRecordsFilteredAndSorted.sort((a: any, b: any) => b.doctorFullName.localeCompare(a.doctorFullName));
    } else if (this.sortBy.patient.asc) {
      this.medicalRecordsFilteredAndSorted.sort((a: any, b: any) => a.patientFullName.localeCompare(b.patientFullName));
    } else if (this.sortBy.patient.desc) {
      this.medicalRecordsFilteredAndSorted.sort((a: any, b: any) => b.patientFullName.localeCompare(a.patientFullName));
    }
  }

  sortById() {
    if (!this.sortBy.id.asc && !this.sortBy.id.desc) {
      this.deactivate();
      this.sortBy.id.asc = true
    } else if (this.sortBy.id.asc) {
      this.sortBy.id.asc = false;
      this.sortBy.id.desc = true;
    } else if (this.sortBy.id.desc) {
      this.sortBy.id.asc = true;
      this.sortBy.id.desc = false;
    }

    this.sort();
  }

  sortByDate() {
    if (!this.sortBy.date.asc && !this.sortBy.date.desc) {
      this.deactivate();
      this.sortBy.date.asc = true
    } else if (this.sortBy.date.asc) {
      this.sortBy.date.asc = false;
      this.sortBy.date.desc = true;
    } else if (this.sortBy.date.desc) {
      this.sortBy.date.asc = true;
      this.sortBy.date.desc = false;
    }

    this.sort();
  }

  sortByDoctor() {
    if (!this.sortBy.doctor.asc && !this.sortBy.doctor.desc) {
      this.deactivate();
      this.sortBy.doctor.asc = true
    } else if (this.sortBy.doctor.asc) {
      this.sortBy.doctor.asc = false;
      this.sortBy.doctor.desc = true;
    } else if (this.sortBy.doctor.desc) {
      this.sortBy.doctor.asc = true;
      this.sortBy.doctor.desc = false;
    }

    this.sort();
  }

  sortByPatient() {
    if (!this.sortBy.patient.asc && !this.sortBy.patient.desc) {
      this.deactivate();
      this.sortBy.patient.asc = true
    } else if (this.sortBy.patient.asc) {
      this.sortBy.patient.asc = false;
      this.sortBy.patient.desc = true;
    } else if (this.sortBy.patient.desc) {
      this.sortBy.patient.asc = true;
      this.sortBy.patient.desc = false;
    }

    this.sort();
  }

  searchMedicalRecord(event: string) {
    this.medicalRecordsFiltered = this.medicalRecords.filter((p: any) => p.patientFullName.toLowerCase().includes(event.toLowerCase()));
    this.medicalRecordsFilteredAndSorted = [...this.medicalRecordsFiltered];
  }

  getMedicalRecords() {
    this.http.get(this.url + "/MedicalRecords").subscribe((data: any) => {
      this.medicalRecords = data;

      for (let i = 0; i < data.length; i++) {
        this.http.get(this.url + "/Patients/" + data[i].patientId).subscribe((data: any) => {
          this.medicalRecords[i].patientFullName = data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName;
        });
        this.http.get(this.url + "/Doctors/" + data[i].doctorId).subscribe((data: any) => {
          this.medicalRecords[i].doctorFullName = data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName;
        });
      }

      this.medicalRecordsFilteredAndSorted = [...this.medicalRecords];
      this.loaded = true;
    });
  }

  deleteMedicalRecord(medicalRecordId: number) {
    this.http.delete(this.url + "/MedicalRecords/" + medicalRecordId).subscribe(res => {
      this.getMedicalRecords();
    });
  }

}
