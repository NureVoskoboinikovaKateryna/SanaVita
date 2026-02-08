import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { EditingMedicalDeviceValues } from './put-medical-device.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-put-medical-device',
  templateUrl: './put-medical-device.component.html',
  styleUrl: './put-medical-device.component.css'
})
export class PutMedicalDeviceComponent implements OnInit {

  medicalDeviceId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: EditingMedicalDeviceValues = new EditingMedicalDeviceValues();
  changesBefore: EditingMedicalDeviceValues = new EditingMedicalDeviceValues();
  medicalDevice: any;
  loaded: boolean = false;
  manufacturers: any;
  medicalDeviceTypes: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.medicalDeviceId = data['mDeviceId'];
      this.getMedicalDevice();
      this.changesBefore = { ...this.changes };
    });

    this.getManufacturers();
    this.getMedicalDeviceTypes();
  }

  getMedicalDevice() {
    this.http.get(this.url + "/MedicalDevices/" + this.medicalDeviceId).subscribe((data: any) => {
      this.medicalDevice = data;

      this.changes.manufacturerId = data.manufacturerId;
      this.changes.medicalDeviceId = data.medicalDeviceId;
      this.changes.medicalDeviceTypeId = data.medicalDeviceTypeId;
      this.changes.productionYear = data.productionYear;

      this.loaded = true;
    });
  }

  getManufacturers() {
    this.http.get(this.url + "/Manufacturers").subscribe(data => {
      this.manufacturers = data;
    });
  }

  getMedicalDeviceTypes() {
    this.http.get(this.url + "/MedicalDeviceTypes").subscribe(data => {
      this.medicalDeviceTypes = data;
      this.loaded = true;
    });
  }

  saveChanges() {
    if (this.compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/MedicalDevices/" + this.medicalDeviceId, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  compDicts(dict1: any, dict2: any): boolean {
    return JSON.stringify(dict1) == JSON.stringify(dict2);
  }

  getCurrentYear(): number {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
