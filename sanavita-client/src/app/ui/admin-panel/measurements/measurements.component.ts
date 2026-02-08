import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-measurements',
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdminMeasurementsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  measurements: any;
  measurementsFiltered: any;
  measurementsFilteredAndSorted: any;
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
      patient: {
        asc: false,
        desc: false
      },
      deviceType: {
        asc: false,
        desc: false
      }
    };

    this.getMeasurements();
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
      this.measurementsFilteredAndSorted.sort((a: any, b: any) => a.measurementId - b.measurementId);
    } else if (this.sortBy.id.desc) {
      this.measurementsFilteredAndSorted.sort((a: any, b: any) => b.measurementId - a.measurementId);
    } else if (this.sortBy.date.asc) {
      this.measurementsFilteredAndSorted.sort((a: any, b: any) => {
        const dateA: Date = new Date(a.measurementDate);
        const dateB: Date = new Date(b.measurementDate);
        return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
      });
    } else if (this.sortBy.date.desc) {
      this.measurementsFilteredAndSorted.sort((a: any, b: any) => {
        const dateA: Date = new Date(a.measurementDate);
        const dateB: Date = new Date(b.measurementDate);
        return (dateB < dateA) ? -1 : (dateB > dateA) ? 1 : 0;
      });
    } else if (this.sortBy.deviceType.asc) {
      this.measurementsFilteredAndSorted.sort((a: any, b: any) => a.medicalDevice.medicalDeviceType.medicalDeviceTypeId - b.medicalDevice.medicalDeviceType.medicalDeviceTypeId);
    } else if (this.sortBy.deviceType.desc) {
      this.measurementsFilteredAndSorted.sort((a: any, b: any) => b.medicalDevice.medicalDeviceType.medicalDeviceTypeId - a.medicalDevice.medicalDeviceType.medicalDeviceTypeId);
    } else if (this.sortBy.patient.asc) {
      this.measurementsFilteredAndSorted.sort((a: any, b: any) => a.patientFullName.localeCompare(b.patientFullName));
    } else if (this.sortBy.patient.desc) {
      this.measurementsFilteredAndSorted.sort((a: any, b: any) => b.patientFullName.localeCompare(a.patientFullName));
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

  sortByDeviceType() {
    if (!this.sortBy.deviceType.asc && !this.sortBy.deviceType.desc) {
      this.deactivate();
      this.sortBy.deviceType.asc = true
    } else if (this.sortBy.deviceType.asc) {
      this.sortBy.deviceType.asc = false;
      this.sortBy.deviceType.desc = true;
    } else if (this.sortBy.deviceType.desc) {
      this.sortBy.deviceType.asc = true;
      this.sortBy.deviceType.desc = false;
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

  searchMeasurement(event: string) {
    this.measurementsFiltered = this.measurements.filter((p: any) => p.patientFullName.toLowerCase().includes(event.toLowerCase()));
    this.measurementsFilteredAndSorted = [...this.measurementsFiltered];
  }

  getMeasurements() {
    this.http.get(this.url + "/Measurements").subscribe((data: any) => {
      this.measurements = data;

      for (let i = 0; i < data.length; i++) {
        this.http.get(this.url + "/Patients/" + data[i].patientId).subscribe((data: any) => {
          this.measurements[i].patientFullName = data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName;
        });
      }

      this.measurementsFilteredAndSorted = [...this.measurements];
      this.loaded = true;
    });
  }

  deleteMeasurement(measurementId: number) {
    this.http.delete(this.url + "/Measurements/" + measurementId).subscribe(res => {
      this.getMeasurements();
    });
  }

}
