import { Component } from '@angular/core';
import { ManufacturerValues } from './create-manufacturer.model';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-manufacturer',
  templateUrl: './create-manufacturer.component.html',
  styleUrl: './create-manufacturer.component.css'
})
export class CreateManufacturerComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  manufacturer: ManufacturerValues = new ManufacturerValues();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  saveChanges() {
    if (!this.manufacturer.name) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/Manufacturers", this.manufacturer).subscribe(
      (response: any) => {
        if (!response.ok) {
          this.toastr.error(response.message, "Помилка");
        } else {
          this.getBack();
        }
      },
      error => {
        this.toastr.error("Проблема сервера, спробуйте пізніше", "Помилка");
      }
    );
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
