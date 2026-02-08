import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { DAppointment } from './add-dappointment.model';

@Component({
  selector: 'app-add-dappointment',
  templateUrl: './add-dappointment.component.html',
  styleUrls: ['./add-dappointment.component.css']
})
export class AddDappointmentComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  appointment: DAppointment = new DAppointment();
  patients: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser('doctor').subscribe(data => {
      this.appointment.doctorId = data.doctorId;
    });
    this.loadPatients();
  }

  loadPatients(): void {
    this.http.get<any[]>(this.url + '/Patients').subscribe((data: any[]) => {
      this.patients = data.map(p => ({
        ...p,
        fullName: `${p.applicationUser.lastName} ${p.applicationUser.name} ${p.applicationUser.middleName}`
      }));
      this.loaded = true;
    });
  }

  saveAppointment(): void {
    if (!this.appointment.patientId || !this.appointment.appointmentDate) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/Appointments", this.appointment).subscribe({
      next: () => this.router.navigate(['/dappointments']),
      error: () => this.toastr.error("Проблема сервера, спробуйте пізніше", "Помилка")
    });
  }

  cancel(): void {
    this.router.navigate(['/dappointments']);
  }
}
