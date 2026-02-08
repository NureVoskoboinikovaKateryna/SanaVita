import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  patient: any;
  userInfo: any;
  loaded: boolean = false;
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  searchControl = new FormControl('');

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.userInfo = this.authService.getUserInfo();
  }

  ngOnInit() {
    this.getPatientAndDoctors();

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        const searchTerm = value?.toLowerCase() || '';
        this.filteredDoctors = this.doctors.filter(d =>
          d.name.toLowerCase().includes(searchTerm)
        );
      });
  }

  getPatientAndDoctors() {
    this.http.get(this.url + "/Patients/email/" + this.userInfo.email).subscribe((patient: any) => {
      this.patient = patient;

      this.http.get<any[]>(this.url + "/Doctors").subscribe((data: any[]) => {
        this.doctors = data.map(d => ({
          id: d.doctorId,
          name: `${d.applicationUser.lastName} ${d.applicationUser.name} ${d.applicationUser.middleName}`
        }));
        this.filteredDoctors = [...this.doctors];
        this.loaded = true;
      });
    });
  }

  openChat(doctorId: number) {
    this.router.navigate(['/pchat', doctorId]);
  }
}
