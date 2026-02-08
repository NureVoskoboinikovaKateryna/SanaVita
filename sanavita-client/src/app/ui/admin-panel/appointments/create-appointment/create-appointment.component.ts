import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Appointment } from './create-appointment.model';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css']
})
export class CreateAppointmentComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  appointment: Appointment = new Appointment();
  patients: any;
  doctors: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getPatients();
    this.getDoctors();
  }

  saveChanges() {
    if (!this.appointment.doctorId ||
      !this.appointment.patientId ||
      !this.appointment.appointmentDate ||
      !this.appointment.notes) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/Appointments", this.appointment).subscribe(
      (response: any) => {
        this.toastr.success(response.message, "Успішно");
        this.getBack();
      },
      error => {
        this.toastr.error("Проблема сервера, спробуйте пізніше", "Помилка");
      }
    );
  }

  getPatients() {
    this.http.get<any[]>(this.url + "/Patients").subscribe((data) => {
      this.patients = data.map(p => ({
        ...p,
        fullName: `${p.applicationUser.lastName} ${p.applicationUser.name} ${p.applicationUser.middleName}`
      }));
    });
  }

  getDoctors() {
    this.http.get<any[]>(this.url + "/Doctors").subscribe((data) => {
      this.doctors = data.map(d => ({
        ...d,
        fullName: `${d.applicationUser.lastName} ${d.applicationUser.name} ${d.applicationUser.middleName}`
      }));
      this.loaded = true;
    });
  }

  getDoctorFullName(doctorId: number) {
    for (let doctor of this.doctors) {
      if (doctor.doctorId == doctorId) {
        return doctor.applicationUser.lastName + ' ' + doctor.applicationUser.name + ' ' + doctor.applicationUser.middleName;
      }
    }
    return '';
  }

  getPatientFullName(patientId: number) {
    for (let patient of this.patients) {
      if (patient.patientId == patientId) {
        return patient.applicationUser.lastName + ' ' + patient.applicationUser.name + ' ' + patient.applicationUser.middleName;
      }
    }
    return '';
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }
}
