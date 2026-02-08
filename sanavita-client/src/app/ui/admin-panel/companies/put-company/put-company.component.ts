import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { EditingCompanyValues } from './put-company.model';

@Component({
  selector: 'app-put-company',
  templateUrl: './put-company.component.html',
  styleUrl: './put-company.component.css'
})
export class PutCompanyComponent implements OnInit {

  companyId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: EditingCompanyValues = new EditingCompanyValues();
  changesBefore: EditingCompanyValues = new EditingCompanyValues();
  company: any;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.route.params.subscribe(data => {
      this.companyId = data['companyId'];
    });
  }

  ngOnInit() {
    this.getCompany();
    this.changesBefore = { ...this.changes };
  }

  getCompany() {
    this.http.get(this.url + "/Companies/" + this.companyId).subscribe((data: any) => {
      this.company = data;

      this.changes.address = data.address;
      this.changes.companyName = data.companyName;
      this.changes.companyId = data.companyId;

      this.loaded = true;
    });
  }

  saveChanges() {
    if (this.compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/Companies/" + this.companyId, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  compDicts(dict1: any, dict2: any): boolean {
    return JSON.stringify(dict1) == JSON.stringify(dict2);
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
