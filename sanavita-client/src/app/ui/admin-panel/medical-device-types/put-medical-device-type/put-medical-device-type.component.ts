import { Component } from '@angular/core';
import { EditingMedicalDeviceTypeValues } from './put-medical-device-type.model';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-put-medical-device-type',
  templateUrl: './put-medical-device-type.component.html',
  styleUrl: './put-medical-device-type.component.css'
})
export class PutMedicalDeviceTypeComponent {

  medicalDeviceTypeId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: EditingMedicalDeviceTypeValues = new EditingMedicalDeviceTypeValues();
  changesBefore: EditingMedicalDeviceTypeValues = new EditingMedicalDeviceTypeValues();
  medicalDeviceType: any;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.medicalDeviceTypeId = data['mDeviceTypeId'];
      this.getMedicalDeviceType();
      this.changesBefore = { ...this.changes };
    });
  }

  getMedicalDeviceType() {
    this.http.get(this.url + "/MedicalDeviceTypes/" + this.medicalDeviceTypeId).subscribe((data: any) => {
      this.medicalDeviceType = data;

      this.changes.medicalDeviceTypeId = data.medicalDeviceTypeId;
      this.changes.name = data.name;

      this.loaded = true;
    });
  }

  saveChanges() {
    if (this.compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/MedicalDeviceTypes/" + this.medicalDeviceTypeId, this.changes).subscribe(res => {
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
