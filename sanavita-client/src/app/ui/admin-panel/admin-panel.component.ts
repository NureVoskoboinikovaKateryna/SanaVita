import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  activated: any = {}

  constructor() {
    this.activated = {
      patients: false,
      administrators: false,
      bloodTypes: false,
      companies: false,
      doctors: false,
      manufacturers: false,
      measurements: false,
      medicalDevices: false,
      medicalDeviceTypes: false,
      medicalRecords: false,
      notifications: false,
      specializations: false,
      appointments: false
    }
  }

  ngOnInit() {
    const savedSection = localStorage.getItem('activeAdminSection');
    this.deactivate();
    if (savedSection && this.activated.hasOwnProperty(savedSection)) {
      this.activated[savedSection] = true;
    } else {
      this.activated.patients = true;
    }
  }

  deactivate() {
    for (let key in this.activated) {
      if (this.activated[key]) {
        this.activated[key] = false;
      }
    }
  }

  activatePatients() {
    this.deactivate();
    this.activated.patients = true;
    localStorage.setItem('activeAdminSection', 'patients');
  }

  activateDoctors() {
    this.deactivate();
    this.activated.doctors = true;
    localStorage.setItem('activeAdminSection', 'doctors');
  }

  activateSpecializations() {
    this.deactivate();
    this.activated.specializations = true;
    localStorage.setItem('activeAdminSection', 'specializations');
  }

  activateAdministrators() {
    this.deactivate();
    this.activated.administrators = true;
    localStorage.setItem('activeAdminSection', 'administrators');
  }

  activateCompanies() {
    this.deactivate();
    this.activated.companies = true;
    localStorage.setItem('activeAdminSection', 'companies');
  }

  activateMedicalRecords() {
    this.deactivate();
    this.activated.medicalRecords = true;
    localStorage.setItem('activeAdminSection', 'medicalRecords');
  }

  activateNotifications() {
    this.deactivate();
    this.activated.notifications = true;
    localStorage.setItem('activeAdminSection', 'notifications');
  }

  activateMeasurements() {
    this.deactivate();
    this.activated.measurements = true;
    localStorage.setItem('activeAdminSection', 'measurements');
  }

  activateMedicalDevices() {
    this.deactivate();
    this.activated.medicalDevices = true;
    localStorage.setItem('activeAdminSection', 'medicalDevices');
  }

  activateMedicalDeviceTypes() {
    this.deactivate();
    this.activated.medicalDeviceTypes = true;
    localStorage.setItem('activeAdminSection', 'medicalDeviceTypes');
  }

  activateBloodTypes() {
    this.deactivate();
    this.activated.bloodTypes = true;
    localStorage.setItem('activeAdminSection', 'bloodTypes');
  }

  activateAppointments() {
    this.deactivate();
    this.activated.appointments = true;
    localStorage.setItem('activeAdminSection', 'appointments');
  }

  activateManufacturers() {
    this.deactivate();
    this.activated.manufacturers = true;
    localStorage.setItem('activeAdminSection', 'manufacturers');
  }
}
