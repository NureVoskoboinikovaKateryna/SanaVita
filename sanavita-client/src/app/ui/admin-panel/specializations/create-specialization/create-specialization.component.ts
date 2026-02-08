import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { SpecializationValues } from './create-specialization.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-specialization',
  templateUrl: './create-specialization.component.html',
  styleUrl: './create-specialization.component.css'
})
export class CreateSpecializationComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  specialization: SpecializationValues = new SpecializationValues();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  saveChanges() {
    if (!this.specialization.name) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/Specializations", this.specialization).subscribe(
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
