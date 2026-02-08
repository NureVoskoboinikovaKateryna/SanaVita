import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-admin-medical-devices',
  templateUrl: './medical-devices.component.html',
  styleUrl: './medical-devices.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MedicalDevicesComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  medicalDevices: any;
  medicalDevicesFiltered: any;
  medicalDevicesFilteredAndSorted: any;
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
      type: {
        asc: false,
        desc: false
      },
      manufacturer: {
        asc: false,
        desc: false
      },
      year: {
        asc: false,
        desc: false
      }
    };

    this.getMedicalDevices();
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
      this.medicalDevicesFilteredAndSorted.sort((a: any, b: any) => a.medicalDeviceId - b.medicalDeviceId);
    } else if (this.sortBy.id.desc) {
      this.medicalDevicesFilteredAndSorted.sort((a: any, b: any) => b.medicalDeviceId - a.medicalDeviceId);
    } else if (this.sortBy.type.asc) {
      this.medicalDevicesFilteredAndSorted.sort((a: any, b: any) => a.medicalDeviceTypeId - b.medicalDeviceTypeId);
    } else if (this.sortBy.type.desc) {
      this.medicalDevicesFilteredAndSorted.sort((a: any, b: any) => b.medicalDeviceTypeId - a.medicalDeviceTypeId);
    } else if (this.sortBy.manufacturer.asc) {
      this.medicalDevicesFilteredAndSorted.sort((a: any, b: any) => a.manufacturerId - b.manufacturerId);
    } else if (this.sortBy.manufacturer.desc) {
      this.medicalDevicesFilteredAndSorted.sort((a: any, b: any) => b.manufacturerId - a.manufacturerId);
    } else if (this.sortBy.year.asc) {
      this.medicalDevicesFilteredAndSorted.sort((a: any, b: any) => a.productionYear - b.productionYear);
    } else if (this.sortBy.year.desc) {
      this.medicalDevicesFilteredAndSorted.sort((a: any, b: any) => b.productionYear - a.productionYear);
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

  sortByType() {
    if (!this.sortBy.type.asc && !this.sortBy.type.desc) {
      this.deactivate();
      this.sortBy.type.asc = true
    } else if (this.sortBy.type.asc) {
      this.sortBy.type.asc = false;
      this.sortBy.type.desc = true;
    } else if (this.sortBy.type.desc) {
      this.sortBy.type.asc = true;
      this.sortBy.type.desc = false;
    }

    this.sort();
  }

  sortByManufacturer() {
    if (!this.sortBy.manufacturer.asc && !this.sortBy.manufacturer.desc) {
      this.deactivate();
      this.sortBy.manufacturer.asc = true
    } else if (this.sortBy.manufacturer.asc) {
      this.sortBy.manufacturer.asc = false;
      this.sortBy.manufacturer.desc = true;
    } else if (this.sortBy.manufacturer.desc) {
      this.sortBy.manufacturer.asc = true;
      this.sortBy.manufacturer.desc = false;
    }

    this.sort();
  }

  sortByYear() {
    if (!this.sortBy.year.asc && !this.sortBy.year.desc) {
      this.deactivate();
      this.sortBy.year.asc = true
    } else if (this.sortBy.year.asc) {
      this.sortBy.year.asc = false;
      this.sortBy.year.desc = true;
    } else if (this.sortBy.year.desc) {
      this.sortBy.year.asc = true;
      this.sortBy.year.desc = false;
    }

    this.sort();
  }

  searchMedicalDevice(event: string) {
    this.medicalDevicesFiltered = this.medicalDevices.filter((p: any) => p.medicalDeviceType.name.toLowerCase().includes(event.toLowerCase()));
    this.medicalDevicesFilteredAndSorted = [...this.medicalDevicesFiltered];
  }

  getMedicalDevices() {
    this.http.get(this.url + "/MedicalDevices").subscribe(data => {
      this.medicalDevices = data;
      this.medicalDevicesFilteredAndSorted = [...this.medicalDevices];
      this.loaded = true;
    });
  }

  deleteMedicalDevice(medicalDeviceId: number) {
    this.http.delete(this.url + "/MedicalDevices/" + medicalDeviceId).subscribe(res => {
      this.getMedicalDevices();
    });
  }

}
