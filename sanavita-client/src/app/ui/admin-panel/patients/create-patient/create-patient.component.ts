import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css'
})
export class CreatePatientComponent {

  createView: boolean = true;

  constructor(
    private authService: AuthService
  ) { }

  registerPatient(event: any) {
    this.authService.registerPatientAdmin(event);
  }

}
