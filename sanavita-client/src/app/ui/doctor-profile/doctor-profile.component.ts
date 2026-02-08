import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { EditingProfileValues } from './edit-doctor-profile/edit-doctor-profile.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css'
})
export class DoctorProfileComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  user: any;
  userLoaded: boolean = false;
  statsLoaded: boolean = false;
  stats: any = {};
  doctorId: number = 0;
  userEmail: string = "";
  onlyView: boolean = false;
  editingProfile: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.doctorId = data['doctorId'];
      this.userEmail = this.authService.getUserInfo()?.email!;
      this.getUser();
    });
  }

  saveDoctor(data: EditingProfileValues) {
    this.http.put(this.url + "/Doctors/" + this.user.doctorId, data).subscribe(res => {
      this.getUser();
      this.editingProfile = false;
    });
  }

  cancelEditing() {
    this.editingProfile = false;
  }

  fillStats() {
    this.http.get(this.url + "/MedicalRecords/doctor/" + this.user.doctorId).subscribe((data: any) => {
      const currentDate = new Date();
      const lastMonthDate = new Date(currentDate);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

      this.stats.patientsPerLastMonth = data.filter((m: any) => {
        const vDate = new Date(m.visitDate);
        return vDate >= lastMonthDate && vDate <= currentDate;
      }).length;

      this.statsLoaded = true;
    });
  }

  getUser() {
    this.authService.getCurrentUserById("doctor", this.doctorId).subscribe(data => {
      this.user = data;
      let userRole = this.authService.getUserInfo()!.role;
      if (!(userRole == "Адміністратор" || this.user.applicationUser.email == this.userEmail)) {
        this.onlyView = true;
      }

      this.user.fullName = this.user.applicationUser.lastName
        + ' ' + this.user.applicationUser.name
        + ' ' + this.user.applicationUser.middleName;

      this.fillStats();
      this.userLoaded = true;
    });
  }

  logout() {
    this.authService.logout();
  }

}
