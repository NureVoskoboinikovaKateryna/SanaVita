import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EditingAdministratorValues } from './put-administrator.model';

@Component({
  selector: 'app-put-administrator',
  templateUrl: './put-administrator.component.html',
  styleUrl: './put-administrator.component.css'
})
export class PutAdministratorComponent {

  administratorId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: EditingAdministratorValues = new EditingAdministratorValues();
  changesBefore: EditingAdministratorValues = new EditingAdministratorValues();
  administrator: any;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.administratorId = data['administratorId'];
      this.getAdministrator();
      this.changesBefore = { ...this.changes };
    });
  }

  getAdministrator() {
    this.http.get(this.url + "/Administrators/" + this.administratorId).subscribe((data: any) => {
      this.administrator = data;

      this.changes.administratorId = data.administratorId;
      this.changes.email = data.applicationUser.email;
      this.changes.lastName = data.applicationUser.lastName;
      this.changes.middleName = data.applicationUser.middleName;
      this.changes.name = data.applicationUser.name;
      this.changes.phoneNumber = data.applicationUser.phoneNumber;

      this.loaded = true;
    });
  }

  saveChanges() {
    if (this.compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/Administrators/" + this.administratorId, this.changes).subscribe(res => {
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
