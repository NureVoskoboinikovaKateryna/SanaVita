import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-admin-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DoctorsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  doctors: any;
  doctorsFiltered: any;
  doctorsFilteredAndSorted: any;
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
      specialization: {
        asc: false,
        desc: false
      }
    };

    this.getDoctors();
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
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => a.doctorId - b.doctorId);
    } else if (this.sortBy.id.desc) {
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => b.doctorId - a.doctorId);
    } else if (this.sortBy.fullName.asc) {
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => a.fullName.localeCompare(b.fullName));
    } else if (this.sortBy.fullName.desc) {
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => b.fullName.localeCompare(a.fullName));
    } else if (this.sortBy.specialization.asc) {
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => a.specialization.name.localeCompare(b.specialization.name));
    } else if (this.sortBy.specialization.desc) {
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => b.specialization.name.localeCompare(a.specialization.name));
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

  sortBySpecialization() {
    if (!this.sortBy.specialization.asc && !this.sortBy.specialization.desc) {
      this.deactivate();
      this.sortBy.specialization.asc = true
    } else if (this.sortBy.specialization.asc) {
      this.sortBy.specialization.asc = false;
      this.sortBy.specialization.desc = true;
    } else if (this.sortBy.specialization.desc) {
      this.sortBy.specialization.asc = true;
      this.sortBy.specialization.desc = false;
    }

    this.sort();
  }
  
  searchDoctor(event: string) {
    this.doctorsFiltered = this.doctors.filter((p: any) => p.fullName.toLowerCase().includes(event.toLowerCase()));
    this.doctorsFilteredAndSorted = [...this.doctorsFiltered];
  }

  getDoctors() {
    this.http.get(this.url + "/Doctors").subscribe(data => {
      this.doctors = data;
      for (let i = 0; i < this.doctors.length; i++) {
        this.getDoctorFullName(this.doctors[i].doctorId).subscribe(data => {
          this.doctors[i].fullName = data;
        });
      }

      this.doctorsFilteredAndSorted = [...this.doctors];
      this.loaded = true;
    });
  }

  getDoctorFullName(doctorId: number): Observable<any> {
    return this.http.get(this.url + '/Doctors/' + doctorId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName
      })
    );
  }

  deleteDoctor(doctorId: number) {
    this.http.delete(this.url + "/Doctors/acc/" + doctorId).subscribe(res => {
      this.getDoctors();
    });
  }

}
