import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, switchMap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dappointments',
  templateUrl: './dappointments.component.html',
  styleUrls: ['./dappointments.component.css'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DAppointmentsComponent {

  url: string = environment.apiBaseUrl;
  appointments: any[] = [];
  doctor: any;
  loading: boolean = true;
  userInfo: any;
  filterPatient: string = '';
  filterDate: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.userInfo = this.authService.getUserInfo();
    this.getDoctorAndAppointments();
  }

  getDoctorAndAppointments() {
    this.http.get(this.url + "/Doctors/email/" + this.userInfo.email).pipe(
      switchMap((doctor: any) => {
        this.doctor = doctor;
        return this.http.get<any[]>(this.url + "/Appointments/doctor/" + this.doctor.doctorId);
      })
    ).subscribe((appointments: any[]) => {
      this.appointments = appointments.sort((a, b) => {
        return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
      });
      for (let i = 0; i < this.appointments.length; i++) {
        this.getPatientFullName(this.appointments[i].patientId).subscribe(name => {
          this.appointments[i].patientFullName = name;
        });
      }
      this.loading = false;
    });
  }

  getPatientFullName(patientId: number): Observable<string> {
    return this.http.get(this.url + '/Patients/' + patientId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName;
      })
    );
  }

  filteredAppointments(): any[] {
    console.log(this.appointments.map(a => a.id));
    return this.appointments.filter(appointment => {
      const patientMatch = appointment.patientFullName
        .toLowerCase()
        .includes(this.filterPatient.toLowerCase());
      const dateMatch = !this.filterDate || appointment.appointmentDate.startsWith(this.filterDate);
      return patientMatch && dateMatch;
    });
  }

  deleteAppo(appointmentId: number): void {
    this.http.delete(this.url + "/Appointments/" + appointmentId).subscribe(res => {
      this.getDoctorAndAppointments();
    });
  }

}
