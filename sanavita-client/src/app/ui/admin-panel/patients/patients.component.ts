import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-patients',
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PatientsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  patients: any;
  patientsFiltered: any;
  patientsFilteredAndSorted: any;
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
      fullName: {
        asc: false,
        desc: false
      },
      companyName: {
        asc: false,
        desc: false
      },
      age: {
        asc: false,
        desc: false
      },
      bloodType: {
        asc: false,
        desc: false
      },
      heigt: {
        asc: false,
        desc: false
      },
      gender: {
        asc: false,
        desc: false
      }
    };

    this.getPatients();
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
      this.patientsFilteredAndSorted.sort((a: any, b: any) => a.patientId - b.patientId);
    } else if (this.sortBy.id.desc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => b.patientId - a.patientId);
    } else if (this.sortBy.fullName.asc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => a.fullName.localeCompare(b.fullName));
    } else if (this.sortBy.fullName.desc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => b.fullName.localeCompare(a.fullName));
    } else if (this.sortBy.companyName.asc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => a.company.companyName.localeCompare(b.company.companyName));
    } else if (this.sortBy.companyName.desc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => b.company.companyName.localeCompare(a.company.companyName));
    } else if (this.sortBy.age.asc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => a.age - b.age);
    } else if (this.sortBy.age.desc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => b.age - a.age);
    } else if (this.sortBy.bloodType.asc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => a.bloodType.typeName.localeCompare(b.bloodType.typeName));
    } else if (this.sortBy.bloodType.desc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => b.bloodType.typeName.localeCompare(a.bloodType.typeName));
    } else if (this.sortBy.heigt.asc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => a.height - b.height);
    } else if (this.sortBy.heigt.desc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => b.height - a.height);
    } else if (this.sortBy.gender.asc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => a.genderL.localeCompare(b.genderL));
    } else if (this.sortBy.gender.desc) {
      this.patientsFilteredAndSorted.sort((a: any, b: any) => b.genderL.localeCompare(a.genderL));
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

  sortByFullName() {
    if (!this.sortBy.fullName.asc && !this.sortBy.fullName.desc) {
      this.deactivate();
      this.sortBy.fullName.asc = true
    } else if (this.sortBy.fullName.asc) {
      this.sortBy.fullName.asc = false;
      this.sortBy.fullName.desc = true;
    } else if (this.sortBy.fullName.desc) {
      this.sortBy.fullName.asc = true;
      this.sortBy.fullName.desc = false;
    }

    this.sort();
  }

  sortByCompanyName() {
    if (!this.sortBy.companyName.asc && !this.sortBy.companyName.desc) {
      this.deactivate();
      this.sortBy.companyName.asc = true
    } else if (this.sortBy.companyName.asc) {
      this.sortBy.companyName.asc = false;
      this.sortBy.companyName.desc = true;
    } else if (this.sortBy.companyName.desc) {
      this.sortBy.companyName.asc = true;
      this.sortBy.companyName.desc = false;
    }

    this.sort();
  }

  sortByAge() {
    if (!this.sortBy.age.asc && !this.sortBy.age.desc) {
      this.deactivate();
      this.sortBy.age.asc = true
    } else if (this.sortBy.age.asc) {
      this.sortBy.age.asc = false;
      this.sortBy.age.desc = true;
    } else if (this.sortBy.age.desc) {
      this.sortBy.age.asc = true;
      this.sortBy.age.desc = false;
    }

    this.sort();
  }

  sortByBloodType() {
    if (!this.sortBy.bloodType.asc && !this.sortBy.bloodType.desc) {
      this.deactivate();
      this.sortBy.bloodType.asc = true
    } else if (this.sortBy.bloodType.asc) {
      this.sortBy.bloodType.asc = false;
      this.sortBy.bloodType.desc = true;
    } else if (this.sortBy.bloodType.desc) {
      this.sortBy.bloodType.asc = true;
      this.sortBy.bloodType.desc = false;
    }

    this.sort();
  }

  sortByHeight() {
    if (!this.sortBy.heigt.asc && !this.sortBy.heigt.desc) {
      this.deactivate();
      this.sortBy.heigt.asc = true
    } else if (this.sortBy.heigt.asc) {
      this.sortBy.heigt.asc = false;
      this.sortBy.heigt.desc = true;
    } else if (this.sortBy.heigt.desc) {
      this.sortBy.heigt.asc = true;
      this.sortBy.heigt.desc = false;
    }

    this.sort();
  }

  sortByGender() {
    if (!this.sortBy.gender.asc && !this.sortBy.gender.desc) {
      this.deactivate();
      this.sortBy.gender.asc = true
    } else if (this.sortBy.gender.asc) {
      this.sortBy.gender.asc = false;
      this.sortBy.gender.desc = true;
    } else if (this.sortBy.gender.desc) {
      this.sortBy.gender.asc = true;
      this.sortBy.gender.desc = false;
    }

    this.sort();
  }

  searchPatient(event: string) {
    this.patientsFiltered = this.patients.filter((p: any) => p.fullName.toLowerCase().includes(event.toLowerCase()));
    this.patientsFilteredAndSorted = [ ...this.patientsFiltered ];
  }

  getPatients() {
    this.http.get(this.url + "/Patients").subscribe(data => {
      this.patients = data;
      for (let i = 0; i < this.patients.length; i++) {
        this.getPatientFullName(this.patients[i].patientId).subscribe(data => {
          this.patients[i].fullName = data;
          this.patients[i].genderL = this.patients[i].gender == 'F' ? 'F' : 'M'; 
        });
      }

      this.patientsFilteredAndSorted = [...this.patients];
      this.loaded = true;
    });
  }

  getPatientFullName(patientId: number): Observable<any> {
    return this.http.get(this.url + '/Patients/' + patientId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName
      })
    );
  }

  deletePatient(patientId: number) {
    this.http.delete(this.url + "/Patients/acc/" + patientId).subscribe(res => {
      this.getPatients();
    });
  }

}
