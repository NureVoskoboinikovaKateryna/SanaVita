import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-medical-device-types',
  templateUrl: './medical-device-types.component.html',
  styleUrl: './medical-device-types.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MedicalDeviceTypesComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  medicalDeviceTypes: any;
  medicalDeviceTypesFiltered: any;
  medicalDeviceTypesFilteredAndSorted: any;
  loaded: boolean = false;
  sortBy: any = {};
  countPerType: any = {};

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
      },
      count: {
        asc: false,
        desc: false
      }
    };

    this.getMedicalDeviceTypes();
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
      this.medicalDeviceTypesFilteredAndSorted.sort((a: any, b: any) => a.medicalDeviceTypeId - b.medicalDeviceTypeId);
    } else if (this.sortBy.id.desc) {
      this.medicalDeviceTypesFilteredAndSorted.sort((a: any, b: any) => b.medicalDeviceTypeId - a.medicalDeviceTypeId);
    } else if (this.sortBy.typeName.asc) {
      this.medicalDeviceTypesFilteredAndSorted.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (this.sortBy.typeName.desc) {
      this.medicalDeviceTypesFilteredAndSorted.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (this.sortBy.count.asc) {
      this.medicalDeviceTypesFilteredAndSorted.sort((a: any, b: any) => {
        let c1 = this.countPerType[a.medicalDeviceTypeId] ? this.countPerType[a.medicalDeviceTypeId] : 0;
        let c2 = this.countPerType[b.medicalDeviceTypeId] ? this.countPerType[b.medicalDeviceTypeId] : 0;
        return c1 - c2;
      });
    } else if (this.sortBy.count.desc) {
      this.medicalDeviceTypesFilteredAndSorted.sort((a: any, b: any) => {
        let c1 = this.countPerType[a.medicalDeviceTypeId] ? this.countPerType[a.medicalDeviceTypeId] : 0;
        let c2 = this.countPerType[b.medicalDeviceTypeId] ? this.countPerType[b.medicalDeviceTypeId] : 0;
        return c2 - c1;
      });
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

  sortByCount() {
    if (!this.sortBy.count.asc && !this.sortBy.count.desc) {
      this.deactivate();
      this.sortBy.count.asc = true
    } else if (this.sortBy.count.asc) {
      this.sortBy.count.asc = false;
      this.sortBy.count.desc = true;
    } else if (this.sortBy.count.desc) {
      this.sortBy.count.asc = true;
      this.sortBy.count.desc = false;
    }

    this.sort();
  }

  searchMedicalDeviceType(event: string) {
    this.medicalDeviceTypesFiltered = this.medicalDeviceTypes.filter((p: any) => p.name.toLowerCase().includes(event.toLowerCase()));
    this.medicalDeviceTypesFilteredAndSorted = [...this.medicalDeviceTypesFiltered];
  }

  getMedicalDeviceTypes() {
    this.http.get(this.url + "/MedicalDeviceTypes").subscribe(data => {
      this.medicalDeviceTypes = data;

      this.http.get(this.url + "/MedicalDevices").subscribe((data: any) => {
        data.forEach((item: any) => {
          const medicalDeviceTypeId = item.medicalDeviceTypeId;
          if (medicalDeviceTypeId in this.countPerType) {
            this.countPerType[medicalDeviceTypeId] = this.countPerType[medicalDeviceTypeId] + 1;
          } else {
            this.countPerType[medicalDeviceTypeId] = 1;
          }
        });

        this.medicalDeviceTypesFilteredAndSorted = [...this.medicalDeviceTypes];
        this.loaded = true;
      });
    });
  }

  deleteMedicalDeviceType(medicalDeviceTypeId: number) {
    this.http.delete(this.url + "/MedicalDeviceTypes/" + medicalDeviceTypeId).subscribe(res => {
      this.getMedicalDeviceTypes();
    });
  }

  getCount(medicalDeviceTypeId: number) {
    return this.countPerType[medicalDeviceTypeId] ? this.countPerType[medicalDeviceTypeId] : 0;
  }

}
