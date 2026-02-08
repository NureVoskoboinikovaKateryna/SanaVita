import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { EditingSpecializationValues } from './put-specialization.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-put-specialization',
  templateUrl: './put-specialization.component.html',
  styleUrl: './put-specialization.component.css'
})
export class PutSpecializationComponent {

  specializationId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: EditingSpecializationValues = new EditingSpecializationValues();
  changesBefore: EditingSpecializationValues = new EditingSpecializationValues();
  specialization: any;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.specializationId = data['spezId'];
      this.getSpecialization();
      this.changesBefore = { ...this.changes };
    });
  }

  getSpecialization() {
    this.http.get(this.url + "/Specializations/" + this.specializationId).subscribe((data: any) => {
      this.specialization = data;

      this.changes.specializationId = data.specializationId;
      this.changes.name = data.name;

      this.loaded = true;
    });
  }

  saveChanges() {
    if (this.compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/Specializations/" + this.specializationId, this.changes).subscribe(res => {
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
