import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, switchMap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppointmentsComponent {
  url: string = environment.apiBaseUrl;
  appointments: any[] = [];
  patient: any;
  loading: boolean = true;
  userInfo: any;
  filterDoctor: string = '';
  filterDate: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.userInfo = this.authService.getUserInfo();
    this.getPatientAndAppointments();
  }

  getPatientAndAppointments() {
    this.http.get(this.url + "/Patients/email/" + this.userInfo.email).pipe(
      switchMap((patient: any) => {
        this.patient = patient;
        return this.http.get<any[]>(this.url + "/Appointments/patient/" + this.patient.patientId);
      })
    ).subscribe((appointments: any[]) => {
      this.appointments = appointments.sort((a, b) => {
        return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
      });
      for (let i = 0; i < this.appointments.length; i++) {
        this.getDoctorFullName(this.appointments[i].doctorId).subscribe(name => {
          this.appointments[i].doctorFullName = name;
        });
      }
      this.loading = false;
    });
  }

  getDoctorFullName(doctorId: number): Observable<string> {
    return this.http.get(this.url + '/Doctors/' + doctorId).pipe(
      map((data: any) => {
        const user = data.applicationUser;
        return `${user.lastName} ${user.name} ${user.middleName}`;
      })
    );
  }

  filteredAppointments(): any[] {
    return this.appointments.filter(appointment => {
      const doctorFullName = appointment.doctorFullName || '';
      const doctorMatch = doctorFullName.toLowerCase().includes(this.filterDoctor.toLowerCase());
      const dateMatch = !this.filterDate || appointment.appointmentDate.startsWith(this.filterDate);
      return doctorMatch && dateMatch;
    });
  }
}
