import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-companies',
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CompaniesComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  companies: any;
  companiesFiltered: any;
  companiesFilteredAndSorted: any;
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

    this.getCompanies();
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
      this.companiesFilteredAndSorted.sort((a: any, b: any) => a.companyId - b.companyId);
    } else if (this.sortBy.id.desc) {
      this.companiesFilteredAndSorted.sort((a: any, b: any) => b.companyId - a.companyId);
    } else if (this.sortBy.name.asc) {
      this.companiesFilteredAndSorted.sort((a: any, b: any) => a.companyName.localeCompare(b.companyName));
    } else if (this.sortBy.name.desc) {
      this.companiesFilteredAndSorted.sort((a: any, b: any) => b.companyName.localeCompare(a.companyName));
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

  searchCompany(event: string) {
    this.companiesFiltered = this.companies.filter((p: any) => p.companyName.toLowerCase().includes(event.toLowerCase()));
    this.companiesFilteredAndSorted = [...this.companiesFiltered];
  }

  getCompanies() {
    this.http.get(this.url + "/Companies").subscribe(data => {
      this.companies = data;
      this.companiesFilteredAndSorted = [...this.companies];
      this.loaded = true;
    });
  }

  deleteCompany(companyId: number) {
    this.http.delete(this.url + "/Companies/" + companyId).subscribe(res => {
      this.getCompanies();
    });
  }

}
