import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './reusable/header/header.component';
import { FooterComponent } from './reusable/footer/footer.component';
import { LoginComponent } from './ui/login/login.component';
import { RegisterComponent } from './ui/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './interceptors/auth-interceptor.interceptor';
import { HomeComponent } from './ui/home/home.component';
import { PatientRegisterFormComponent } from './ui/register/patient-register-form/patient-register-form.component';
import { DoctorRegisterFormComponent } from './ui/register/doctor-register-form/doctor-register-form.component';
import { NotificationsComponent } from './ui/notifications/notifications.component';
import { MedicalRecordsComponent } from './ui/medical-records/medical-records.component';
import { MeasurementsComponent } from './ui/measurements/measurements.component';
import { PatientProfileComponent } from './ui/patient-profile/patient-profile.component';
import { EditPatientProfileComponent } from './ui/patient-profile/edit-patient-profile/edit-patient-profile.component';
import { DoctorProfileComponent } from './ui/doctor-profile/doctor-profile.component';
import { EditDoctorProfileComponent } from './ui/doctor-profile/edit-doctor-profile/edit-doctor-profile.component';
import { DmedicalRecordsComponent } from './ui/dmedical-records/dmedical-records.component';
import { AddDmedicalRecordComponent } from './ui/dmedical-records/add-dmedical-record/add-dmedical-record.component';
import { EditDmedicalRecordComponent } from './ui/dmedical-records/edit-dmedical-record/edit-dmedical-record.component';
import { DnotificationsComponent } from './ui/dnotifications/dnotifications.component';
import { EditDnotificationComponent } from './ui/dnotifications/edit-dnotification/edit-dnotification.component';
import { AddDnotificationComponent } from './ui/dnotifications/add-dnotification/add-dnotification.component';
import { DpatientsComponent } from './ui/dpatients/dpatients.component';
import { AdminPanelComponent } from './ui/admin-panel/admin-panel.component';
import { PatientsComponent } from './ui/admin-panel/patients/patients.component';
import { AdministratorsComponent } from './ui/admin-panel/administrators/administrators.component';
import { DoctorsComponent } from './ui/admin-panel/doctors/doctors.component';
import { CompaniesComponent } from './ui/admin-panel/companies/companies.component';
import { MedicalDevicesComponent } from './ui/admin-panel/medical-devices/medical-devices.component';
import { MedicalDeviceTypesComponent } from './ui/admin-panel/medical-device-types/medical-device-types.component';
import { BloodTypesComponent } from './ui/admin-panel/blood-types/blood-types.component';
import { SpecializationsComponent } from './ui/admin-panel/specializations/specializations.component';
import { ManufacturersComponent } from './ui/admin-panel/manufacturers/manufacturers.component';
import { AdminMedicalRecordsComponent } from './ui/admin-panel/medical-records/medical-records.component';
import { AdminMeasurementsComponent } from './ui/admin-panel/measurements/measurements.component';
import { AdminNotificationsComponent } from './ui/admin-panel/notifications/notifications.component';
import { CreatePatientComponent } from './ui/admin-panel/patients/create-patient/create-patient.component';
import { PutPatientComponent } from './ui/admin-panel/patients/put-patient/put-patient.component';
import { CreateNotificationComponent } from './ui/admin-panel/notifications/create-notification/create-notification.component';
import { PutNotificationComponent } from './ui/admin-panel/notifications/put-notification/put-notification.component';
import { CreateManufacturerComponent } from './ui/admin-panel/manufacturers/create-manufacturer/create-manufacturer.component';
import { PutManufacturerComponent } from './ui/admin-panel/manufacturers/put-manufacturer/put-manufacturer.component';
import { CreateSpecializationComponent } from './ui/admin-panel/specializations/create-specialization/create-specialization.component';
import { PutSpecializationComponent } from './ui/admin-panel/specializations/put-specialization/put-specialization.component';
import { CreateCompanyComponent } from './ui/admin-panel/companies/create-company/create-company.component';
import { PutCompanyComponent } from './ui/admin-panel/companies/put-company/put-company.component';
import { CreateDoctorComponent } from './ui/admin-panel/doctors/create-doctor/create-doctor.component';
import { PutDoctorComponent } from './ui/admin-panel/doctors/put-doctor/put-doctor.component';
import { CreateAdministratorComponent } from './ui/admin-panel/administrators/create-administrator/create-administrator.component';
import { PutAdministratorComponent } from './ui/admin-panel/administrators/put-administrator/put-administrator.component';
import { CreateMedicalRecordComponent } from './ui/admin-panel/medical-records/create-medical-record/create-medical-record.component';
import { PutMedicalRecordComponent } from './ui/admin-panel/medical-records/put-medical-record/put-medical-record.component';
import { CreateMedicalDeviceTypeComponent } from './ui/admin-panel/medical-device-types/create-medical-device-type/create-medical-device-type.component';
import { PutMedicalDeviceTypeComponent } from './ui/admin-panel/medical-device-types/put-medical-device-type/put-medical-device-type.component';
import { CreateMedicalDeviceComponent } from './ui/admin-panel/medical-devices/create-medical-device/create-medical-device.component';
import { PutMedicalDeviceComponent } from './ui/admin-panel/medical-devices/put-medical-device/put-medical-device.component';
import { CreateMeasurementComponent } from './ui/admin-panel/measurements/create-measurement/create-measurement.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { DchatComponent } from './ui/dnotifications/dchat/dchat.component';
import { PchatComponent } from './ui/notifications/pchat/pchat.component';
import { AppointmentsComponent } from './ui/appointments/appointments.component';
import { DAppointmentsComponent } from './ui/dappointments/dappointments.component';
import { AddDappointmentComponent } from './ui/dappointments/add-dappointment/add-dappointment.component';
import { AdminAppointmentsComponent } from './ui/admin-panel/appointments/appointments.component';
import { CreateAppointmentComponent } from './ui/admin-panel/appointments/create-appointment/create-appointment.component';

export function HttpLoaderFactory(http: HttpClient) {  
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PatientRegisterFormComponent,
    DoctorRegisterFormComponent,
    NotificationsComponent,
    MedicalRecordsComponent,
    MeasurementsComponent,
    PatientProfileComponent,
    EditPatientProfileComponent,
    DoctorProfileComponent,
    EditDoctorProfileComponent,
    DmedicalRecordsComponent,
    AddDmedicalRecordComponent,
    EditDmedicalRecordComponent,
    DnotificationsComponent,
    EditDnotificationComponent,
    AddDnotificationComponent,
    DpatientsComponent,
    AdminPanelComponent,
    PatientsComponent,
    AdministratorsComponent,
    DoctorsComponent,
    CompaniesComponent,
    MedicalDevicesComponent,
    MedicalDeviceTypesComponent,
    BloodTypesComponent,
    SpecializationsComponent,
    ManufacturersComponent,
    AdminMedicalRecordsComponent,
    AdminMeasurementsComponent,
    AdminNotificationsComponent,
    CreatePatientComponent,
    PutPatientComponent,
    CreateNotificationComponent,
    PutNotificationComponent,
    CreateMedicalRecordComponent,
    PutMedicalRecordComponent,
    CreateManufacturerComponent,
    PutManufacturerComponent,
    CreateSpecializationComponent,
    PutSpecializationComponent,
    CreateMedicalDeviceTypeComponent,
    PutMedicalDeviceTypeComponent,
    CreateMedicalDeviceComponent,
    PutMedicalDeviceComponent,
    CreateCompanyComponent,
    PutCompanyComponent,
    CreateDoctorComponent,
    PutDoctorComponent,
    CreateAdministratorComponent,
    PutAdministratorComponent,
    CreateMeasurementComponent,
    DchatComponent,
    PchatComponent,
    AppointmentsComponent,
    DAppointmentsComponent,
    AddDappointmentComponent,
    AdminAppointmentsComponent,
    CreateAppointmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      maxOpened: 3
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [TranslateModule],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
