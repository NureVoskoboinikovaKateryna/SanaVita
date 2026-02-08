import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-specializations',
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SpecializationsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  specializations: any;
  specializationsFiltered: any;
  specializationsFilteredAndSorted: any;
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
      name: {
        asc: false,
        desc: false
      }
    };

    this.getSpecializations();
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
      this.specializationsFilteredAndSorted.sort((a: any, b: any) => a.specializationId - b.specializationId);
    } else if (this.sortBy.id.desc) {
      this.specializationsFilteredAndSorted.sort((a: any, b: any) => b.specializationId - a.specializationId);
    } else if (this.sortBy.name.asc) {
      this.specializationsFilteredAndSorted.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (this.sortBy.name.desc) {
      this.specializationsFilteredAndSorted.sort((a: any, b: any) => b.name.localeCompare(a.name));
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

  sortByName() {
    if (!this.sortBy.name.asc && !this.sortBy.name.desc) {
      this.deactivate();
      this.sortBy.name.asc = true
    } else if (this.sortBy.name.asc) {
      this.sortBy.name.asc = false;
      this.sortBy.name.desc = true;
    } else if (this.sortBy.name.desc) {
      this.sortBy.name.asc = true;
      this.sortBy.name.desc = false;
    }

    this.sort();
  }

  searchSpecialization(event: string) {
    this.specializationsFiltered = this.specializations.filter((p: any) => p.name.toLowerCase().includes(event.toLowerCase()));
    this.specializationsFilteredAndSorted = [...this.specializationsFiltered];
  }

  getSpecializations() {
    this.http.get(this.url + "/Specializations").subscribe(data => {
      this.specializations = data;
      this.specializationsFilteredAndSorted = [...this.specializations];
      this.loaded = true;
    });
  }

  deleteSpecialization(specializationsId: number) {
    this.http.delete(this.url + "/Specializations/" + specializationsId).subscribe(res => {
      this.getSpecializations();
    });
  }

}
