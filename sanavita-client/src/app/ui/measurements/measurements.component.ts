import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.css'
})
export class MeasurementsComponent {

  url: string = environment.apiBaseUrl;
  measurements: any[] = [];
  filteredMeasurements: any[] = [];
  patient: any;
  userInfo: any;

  deviceTypes: string[] = [];
  selectedDevice: string = '';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {
    this.userInfo = this.authService.getUserInfo();
    this.getPatientAndMeasurements();
  }

  getPatientAndMeasurements() {
    this.http.get<any>(this.url + "/Patients/email/" + this.userInfo.email).pipe(
      switchMap((patient: any) => {
        this.patient = patient;
        return this.http.get<any[]>(this.url + "/Measurements/patient/" + this.patient.patientId);
      })
    ).subscribe((measurements: any[]) => {
      const requests = measurements.map(m => 
        this.getMedicalDeviceName(m.medicalDevice.medicalDeviceTypeId).pipe(
          map(name => ({ ...m, deviceName: name }))
        )
      );

      Promise.all(requests.map(r => r.toPromise())).then(meas => {
        this.measurements = meas;
        this.deviceTypes = [...new Set(meas.map(m => m.deviceName))];
        this.applyFilters();
      });
    });
  }

  getMedicalDeviceName(medicalDeviceTypeId: number): Observable<any> {
    return this.http.get(this.url + '/MedicalDeviceTypes/' + medicalDeviceTypeId).pipe(
      map((data: any) => data.name)
    );
  }

  applyFilters() {
    let result = [...this.measurements];

    if (this.selectedDevice) {
      result = result.filter(m => m.deviceName === this.selectedDevice);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.measurementDate).getTime();
      const dateB = new Date(b.measurementDate).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    this.filteredMeasurements = result;
  }

}
