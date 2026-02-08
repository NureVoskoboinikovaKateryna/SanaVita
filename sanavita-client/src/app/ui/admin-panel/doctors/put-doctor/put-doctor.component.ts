import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-put-doctor',
  templateUrl: './put-doctor.component.html',
  styleUrl: './put-doctor.component.css'
})
export class PutDoctorComponent {

  doctorId: number = 0;
  url: string = environment.apiBaseUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.route.params.subscribe(data => {
      this.doctorId = data['doctorId'];
    });
  }

  saveDoctor(data: any) {
    this.http.put(this.url + "/Doctors/" + this.doctorId, data).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
