import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dnotifications',
  templateUrl: './dnotifications.component.html',
  styleUrls: ['./dnotifications.component.css']
})
export class DnotificationsComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  doctor: any;
  userInfo: any;
  loaded: boolean = false;
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchControl = new FormControl('');

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.userInfo = this.authService.getUserInfo();
  }

  ngOnInit() {
    this.getDoctorAndPatients();

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        const searchTerm = value?.toLowerCase() || '';
        this.filteredPatients = this.patients.filter(p =>
          p.name.toLowerCase().includes(searchTerm)
        );
      });
  }

  getDoctorAndPatients() {
    this.http.get(this.url + "/Doctors/email/" + this.userInfo.email).subscribe((doctor: any) => {
      this.doctor = doctor;

      this.http.get<any[]>(this.url + "/Patients").subscribe((data: any[]) => {
        this.patients = data.map(p => ({
          id: p.patientId,
          name: `${p.applicationUser.lastName} ${p.applicationUser.name} ${p.applicationUser.middleName}`
        }));
        this.filteredPatients = [...this.patients];
        this.loaded = true;
      });
    });
  }

  openChat(patientId: number) {
    this.router.navigate(['/dchat', patientId]);
  }
}
