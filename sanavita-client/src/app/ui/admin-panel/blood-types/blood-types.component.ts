import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-blood-types',
  templateUrl: './blood-types.component.html',
  styleUrl: './blood-types.component.css'
})
export class BloodTypesComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  bloodTypes: any;
  bloodTypesFiltered: any;
  bloodTypesFilteredAndSorted: any;
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
      typeName: {
        asc: false,
        desc: false
      }
    };

    this.getBloodTypes();
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
      this.bloodTypesFilteredAndSorted.sort((a: any, b: any) => a.bloodTypeId - b.bloodTypeId);
    } else if (this.sortBy.id.desc) {
      this.bloodTypesFilteredAndSorted.sort((a: any, b: any) => b.bloodTypeId - a.bloodTypeId);
    } else if (this.sortBy.typeName.asc) {
      this.bloodTypesFilteredAndSorted.sort((a: any, b: any) => a.typeName.localeCompare(b.typeName));
    } else if (this.sortBy.typeName.desc) {
      this.bloodTypesFilteredAndSorted.sort((a: any, b: any) => b.typeName.localeCompare(a.typeName));
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

  sortByTypeName() {
    if (!this.sortBy.typeName.asc && !this.sortBy.typeName.desc) {
      this.deactivate();
      this.sortBy.typeName.asc = true
    } else if (this.sortBy.typeName.asc) {
      this.sortBy.typeName.asc = false;
      this.sortBy.typeName.desc = true;
    } else if (this.sortBy.typeName.desc) {
      this.sortBy.typeName.asc = true;
      this.sortBy.typeName.desc = false;
    }

    this.sort();
  }

  searchBloodType(event: string) {
    this.bloodTypesFiltered = this.bloodTypes.filter((p: any) => p.typeName.toLowerCase().includes(event.toLowerCase()));
    this.bloodTypesFilteredAndSorted = [...this.bloodTypesFiltered];
  }

  getBloodTypes() {
    this.http.get(this.url + "/BloodTypes").subscribe((data: any) => {
      this.bloodTypes = data;
      this.bloodTypesFilteredAndSorted = [...this.bloodTypes];
      this.loaded = true;
    });
  }

  deleteBloodType(bloodTypeId: number) {
    this.http.delete(this.url + "/BloodTypes/" + bloodTypeId).subscribe((res: any) => {
      this.getBloodTypes();
    });
  }

}
