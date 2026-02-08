import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrl: './manufacturers.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ManufacturersComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  manufacturers: any;
  manufacturersFiltered: any;
  manufacturersFilteredAndSorted: any;
  loaded: boolean = false;
  sortBy: any = {};
  countPerManf: any = {};

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
      },
      count: {
        asc: false,
        desc: false
      }
    };

    this.getManufacturers();
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
      this.manufacturersFilteredAndSorted.sort((a: any, b: any) => a.manufacturerId - b.manufacturerId);
    } else if (this.sortBy.id.desc) {
      this.manufacturersFilteredAndSorted.sort((a: any, b: any) => b.manufacturerId - a.manufacturerId);
    } else if (this.sortBy.name.asc) {
      this.manufacturersFilteredAndSorted.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (this.sortBy.name.desc) {
      this.manufacturersFilteredAndSorted.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (this.sortBy.count.asc) {
      this.manufacturersFilteredAndSorted.sort((a: any, b: any) => {
        let c1 = this.countPerManf[a.manufacturerId] ? this.countPerManf[a.manufacturerId] : 0;
        let c2 = this.countPerManf[b.manufacturerId] ? this.countPerManf[b.manufacturerId] : 0;
        return c1 - c2;
      });
    } else if (this.sortBy.count.desc) {
      this.manufacturersFilteredAndSorted.sort((a: any, b: any) => {
        let c1 = this.countPerManf[a.manufacturerId] ? this.countPerManf[a.manufacturerId] : 0;
        let c2 = this.countPerManf[b.manufacturerId] ? this.countPerManf[b.manufacturerId] : 0;
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

  searchManufacturer(event: string) {
    this.manufacturersFiltered = this.manufacturers.filter((p: any) => p.name.toLowerCase().includes(event.toLowerCase()));
    this.manufacturersFilteredAndSorted = [...this.manufacturersFiltered];
  }

  getManufacturers() {
    this.http.get(this.url + "/Manufacturers").subscribe((data: any) => {
      this.manufacturers = data;

      this.http.get(this.url + "/MedicalDevices").subscribe((data: any) => {
        data.forEach((item: any) => {
          const manufacturerId = item.manufacturerId;
          if (manufacturerId in this.countPerManf) {
            this.countPerManf[manufacturerId] = this.countPerManf[manufacturerId] + 1;
          } else {
            this.countPerManf[manufacturerId] = 1;
          }
        });

        this.manufacturersFilteredAndSorted = [...this.manufacturers];
        this.loaded = true;
      });
    });
  }

  deleteManufacturer(manufacturerId: number) {
    this.http.delete(this.url + "/Manufacturers/" + manufacturerId).subscribe(res => {
      this.getManufacturers();
    });
  }

  getCount(manufacturerId: number) {
    return this.countPerManf[manufacturerId] ? this.countPerManf[manufacturerId] : 0;
  }

}
