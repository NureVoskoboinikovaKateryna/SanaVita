import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditingProfileValues } from './edit-patient-profile.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-patient-profile',
  templateUrl: './edit-patient-profile.component.html',
  styleUrl: './edit-patient-profile.component.css'
})
export class EditPatientProfileComponent implements OnInit {

  @Input() user: any;
  @Input() patientId: any;
  @Output() onSaveEvent = new EventEmitter<any>();
  @Output() onCancelEvent = new EventEmitter<any>();

  url: string = environment.apiBaseUrl;
  bloodTypes: any;
  changes: EditingProfileValues = new EditingProfileValues();
  changesBefore: EditingProfileValues = new EditingProfileValues();
  loaded: boolean = false;

  constructor(private http: HttpClient) {
    this.getBloodTypes();
  }

  ngOnInit() {
    if (this.patientId) {
      this.getPatient();
    } else {
      this.setValues()
    }

    this.changesBefore = { ...this.changes };
  }

  setValues() {
    this.changes.address = this.user.address;
    this.changes.age = this.user.age;
    this.changes.bTypeId = this.user.bloodType.bloodTypeId;
    this.changes.email = this.user.applicationUser.email;
    this.changes.height = this.user.height;
    this.changes.lastName = this.user.applicationUser.lastName;
    this.changes.name = this.user.applicationUser.name;
    this.changes.middleName = this.user.applicationUser.middleName;
    this.changes.phoneNumber = this.user.applicationUser.phoneNumber;
  }

  compDicts(dict1: any, dict2: any): boolean {
    return JSON.stringify(dict1) == JSON.stringify(dict2);
  }

  saveChanges() {
    if (this.compDicts(this.changesBefore, this.changes)) {
      this.cancelChanges();
      return;
    }

    this.onSaveEvent.emit(this.changes);
  }

  getPatient() {
    this.http.get(this.url + "/Patients/" + this.patientId).subscribe(data => {
      this.user = data;
      this.setValues();
    });
  }

  cancelChanges() {
    this.onCancelEvent.emit();
  }

  getBloodTypes(): any {
    this.http.get(this.url + "/BloodTypes").subscribe(data => {
      this.bloodTypes = data;
      this.loaded = true;
    });
  }

}
