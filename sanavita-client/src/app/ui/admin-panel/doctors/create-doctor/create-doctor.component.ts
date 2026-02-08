import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-create-doctor',
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.css'
})
export class CreateDoctorComponent {

  createView: boolean = true;

  constructor(
    private authService: AuthService
  ) { }

  registerDoctor(event: any) {
    this.authService.registerDoctorAdmin(event);
  }

}
