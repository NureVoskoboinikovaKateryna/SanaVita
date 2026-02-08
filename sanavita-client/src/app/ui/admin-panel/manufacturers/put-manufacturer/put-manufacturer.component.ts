import { Component } from '@angular/core';
import { EditingManufacturerValues } from './put-manufacturer.model';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-put-manufacturer',
  templateUrl: './put-manufacturer.component.html',
  styleUrl: './put-manufacturer.component.css'
})
export class PutManufacturerComponent {

  manufacturerId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: EditingManufacturerValues = new EditingManufacturerValues();
  changesBefore: EditingManufacturerValues = new EditingManufacturerValues();
  manufacturer: any;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.manufacturerId = data['manfId'];
      this.getManufacturer();
      this.changesBefore = { ...this.changes };
    });
  }

  getManufacturer() {
    this.http.get(this.url + "/Manufacturers/" + this.manufacturerId).subscribe((data: any) => {
      this.manufacturer = data;

      this.changes.manufacturerId = data.manufacturerId;
      this.changes.name = data.name;

      this.loaded = true;
    });
  }

  saveChanges() {
    if (this.compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/Manufacturers/" + this.manufacturerId, this.changes).subscribe(res => {
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
