import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './ui/login/login.component';
import { RegisterComponent } from './ui/register/register.component';
import { HomeComponent } from './ui/home/home.component';
import { NotificationsComponent } from './ui/notifications/notifications.component';
import { MedicalRecordsComponent } from './ui/medical-records/medical-records.component';
import { MeasurementsComponent } from './ui/measurements/measurements.component';
import { authorizedGuard } from './guards/authorized.guard';
import { PatientProfileComponent } from './ui/patient-profile/patient-profile.component';
import { allowedToGuard } from './guards/allowed-to.guard';
import { DoctorProfileComponent } from './ui/doctor-profile/doctor-profile.component';
import { DmedicalRecordsComponent } from './ui/dmedical-records/dmedical-records.component';
import { AddDmedicalRecordComponent } from './ui/dmedical-records/add-dmedical-record/add-dmedical-record.component';
import { EditDmedicalRecordComponent } from './ui/dmedical-records/edit-dmedical-record/edit-dmedical-record.component';
import { DnotificationsComponent } from './ui/dnotifications/dnotifications.component';
import { EditDnotificationComponent } from './ui/dnotifications/edit-dnotification/edit-dnotification.component';
import { AddDnotificationComponent } from './ui/dnotifications/add-dnotification/add-dnotification.component';
import { DpatientsComponent } from './ui/dpatients/dpatients.component';
import { AdminPanelComponent } from './ui/admin-panel/admin-panel.component';
import { isAdminGuard } from './guards/is-admin.guard';
import { CreatePatientComponent } from './ui/admin-panel/patients/create-patient/create-patient.component';
import { PutPatientComponent } from './ui/admin-panel/patients/put-patient/put-patient.component';
import { CreateSpecializationComponent } from './ui/admin-panel/specializations/create-specialization/create-specialization.component';
import { PutSpecializationComponent } from './ui/admin-panel/specializations/put-specialization/put-specialization.component';
import { CreateNotificationComponent } from './ui/admin-panel/notifications/create-notification/create-notification.component';
import { PutNotificationComponent } from './ui/admin-panel/notifications/put-notification/put-notification.component';
import { CreateMedicalRecordComponent } from './ui/admin-panel/medical-records/create-medical-record/create-medical-record.component';
import { PutMedicalRecordComponent } from './ui/admin-panel/medical-records/put-medical-record/put-medical-record.component';
import { CreateMedicalDeviceTypeComponent } from './ui/admin-panel/medical-device-types/create-medical-device-type/create-medical-device-type.component';
import { PutMedicalDeviceTypeComponent } from './ui/admin-panel/medical-device-types/put-medical-device-type/put-medical-device-type.component';
import { CreateMedicalDeviceComponent } from './ui/admin-panel/medical-devices/create-medical-device/create-medical-device.component';
import { PutMedicalDeviceComponent } from './ui/admin-panel/medical-devices/put-medical-device/put-medical-device.component';
import { CreateManufacturerComponent } from './ui/admin-panel/manufacturers/create-manufacturer/create-manufacturer.component';
import { PutManufacturerComponent } from './ui/admin-panel/manufacturers/put-manufacturer/put-manufacturer.component';
import { CreateDoctorComponent } from './ui/admin-panel/doctors/create-doctor/create-doctor.component';
import { PutDoctorComponent } from './ui/admin-panel/doctors/put-doctor/put-doctor.component';
import { CreateCompanyComponent } from './ui/admin-panel/companies/create-company/create-company.component';
import { PutCompanyComponent } from './ui/admin-panel/companies/put-company/put-company.component';
import { CreateAdministratorComponent } from './ui/admin-panel/administrators/create-administrator/create-administrator.component';
import { PutAdministratorComponent } from './ui/admin-panel/administrators/put-administrator/put-administrator.component';
import { CreateMeasurementComponent } from './ui/admin-panel/measurements/create-measurement/create-measurement.component';
import { DchatComponent } from './ui/dnotifications/dchat/dchat.component';
import { PchatComponent } from './ui/notifications/pchat/pchat.component';
import { AppointmentsComponent } from './ui/appointments/appointments.component';
import { DAppointmentsComponent } from './ui/dappointments/dappointments.component';
import { AddDappointmentComponent } from './ui/dappointments/add-dappointment/add-dappointment.component';
import { CreateAppointmentComponent } from './ui/admin-panel/appointments/create-appointment/create-appointment.component';

const routes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [allowedToGuard] },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [allowedToGuard] },
  { path: "register", component: RegisterComponent, canActivate: [allowedToGuard] },

  { path: "notifications", component: NotificationsComponent, canActivate: [authorizedGuard] },
  { path: "medical-records", component: MedicalRecordsComponent, canActivate: [authorizedGuard] },
  { path: "dmedical-records", component: DmedicalRecordsComponent, canActivate: [authorizedGuard] },
  { path: "measurements", component: MeasurementsComponent, canActivate: [authorizedGuard] },
  { path: "pprofile/:patientId", component: PatientProfileComponent, canActivate: [authorizedGuard] },
  { path: "dprofile/:doctorId", component: DoctorProfileComponent, canActivate: [authorizedGuard] },
  { path: "add-mrecord", component: AddDmedicalRecordComponent, canActivate: [authorizedGuard] },
  { path: "edit-record/:medicalRecordId", component: EditDmedicalRecordComponent, canActivate: [authorizedGuard] },
  { path: "dnotifications", component: DnotificationsComponent, canActivate: [authorizedGuard] },
  { path: "edit-dnotification/:notificationId", component: EditDnotificationComponent, canActivate: [authorizedGuard] },
  { path: "add-dnotification", component: AddDnotificationComponent, canActivate: [authorizedGuard] },
  { path: "dpatients", component: DpatientsComponent, canActivate: [authorizedGuard] },
  { path: "dchat/:id", component: DchatComponent, canActivate: [authorizedGuard] },
  { path: "pchat/:id", component: PchatComponent, canActivate: [authorizedGuard] },
  { path: "appointments", component: AppointmentsComponent, canActivate: [authorizedGuard] },
  { path: "dappointments", component: DAppointmentsComponent, canActivate: [authorizedGuard] },
  { path: "add-dappointment", component: AddDappointmentComponent, canActivate: [authorizedGuard] },

  { path: "admin-panel", component: AdminPanelComponent, canActivate: [isAdminGuard] },
  { path: "create-patient", component: CreatePatientComponent, canActivate: [isAdminGuard] },
  { path: "put-patient/:patientId", component: PutPatientComponent, canActivate: [isAdminGuard] },
  { path: "create-specialization", component: CreateSpecializationComponent, canActivate: [isAdminGuard] },
  { path: "put-specialization/:spezId", component: PutSpecializationComponent, canActivate: [isAdminGuard] },
  { path: "create-notification", component: CreateNotificationComponent, canActivate: [isAdminGuard] },
  { path: "put-notification/:notificationId", component: PutNotificationComponent, canActivate: [isAdminGuard] },
  { path: "create-medical-record", component: CreateMedicalRecordComponent, canActivate: [isAdminGuard] },
  { path: "put-medical-record/:medicalRecordId", component: PutMedicalRecordComponent, canActivate: [isAdminGuard] },
  { path: "create-medical-device-type", component: CreateMedicalDeviceTypeComponent, canActivate: [isAdminGuard] },
  { path: "put-medical-device-type/:mDeviceTypeId", component: PutMedicalDeviceTypeComponent, canActivate: [isAdminGuard] },
  { path: "create-medical-device", component: CreateMedicalDeviceComponent, canActivate: [isAdminGuard] },
  { path: "put-medical-device/:mDeviceId", component: PutMedicalDeviceComponent, canActivate: [isAdminGuard] },
  { path: "create-manufacturer", component: CreateManufacturerComponent, canActivate: [isAdminGuard] },
  { path: "put-manufacturer/:manfId", component: PutManufacturerComponent, canActivate: [isAdminGuard] },
  { path: "create-doctor", component: CreateDoctorComponent, canActivate: [isAdminGuard] },
  { path: "put-doctor/:doctorId", component: PutDoctorComponent, canActivate: [isAdminGuard] },
  { path: "create-company", component: CreateCompanyComponent, canActivate: [isAdminGuard] },
  { path: "put-company/:companyId", component: PutCompanyComponent, canActivate: [isAdminGuard] },
  { path: "create-administrator", component: CreateAdministratorComponent, canActivate: [isAdminGuard] },
  { path: "put-administrator/:administratorId", component: PutAdministratorComponent, canActivate: [isAdminGuard] },
  { path: "create-measurement", component: CreateMeasurementComponent, canActivate: [isAdminGuard] },
  { path: "create-appointment", component: CreateAppointmentComponent, canActivate: [isAdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

RouterModule.forRoot(routes, {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled'
})

