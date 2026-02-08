import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-put-patient',
  templateUrl: './put-patient.component.html',
  styleUrl: './put-patient.component.css'
})
export class PutPatientComponent {

  patientId: number = 0;
  url: string = environment.apiBaseUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.route.params.subscribe(data => {
      this.patientId = data['patientId'];
    });
  }

  savePatient(data: any) {
    this.http.put(this.url + "/Patients/" + this.patientId, data).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
