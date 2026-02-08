import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { EditingProfileValues } from './edit-doctor-profile.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-doctor-profile',
  templateUrl: './edit-doctor-profile.component.html',
  styleUrl: './edit-doctor-profile.component.css'
})
export class EditDoctorProfileComponent implements OnInit {

  @Input() user: any;
  @Input() doctorId: any;
  @Output() onSaveEvent = new EventEmitter<any>();
  @Output() onCancelEvent = new EventEmitter<any>();

  url: string = environment.apiBaseUrl;
  specializations: any;
  changes: EditingProfileValues = new EditingProfileValues();
  changesBefore: EditingProfileValues = new EditingProfileValues();
  loaded: boolean = false;

  constructor(private http: HttpClient) {
    this.getSpecializations();
  }

  ngOnInit() {
    if (this.doctorId) {
      this.getDoctor();
    } else {
      this.setValues()
    }

    this.changesBefore = { ...this.changes };
  }

  setValues() {
    this.changes.specializationId = this.user.specialization.specializationId;
    this.changes.email = this.user.applicationUser.email;
    this.changes.lastName = this.user.applicationUser.lastName;
    this.changes.name = this.user.applicationUser.name;
    this.changes.middleName = this.user.applicationUser.middleName;
    this.changes.phoneNumber = this.user.applicationUser.phoneNumber;
  }

  getDoctor() {
    this.http.get(this.url + "/Doctors/" + this.doctorId).subscribe(data => {
      this.user = data;
      this.setValues();
    });
  }

  compDicts(dict1: any, dict2: any): boolean {
    return JSON.stringify(dict1) == JSON.stringify(dict2);
  }

  saveChanges() {
    if (this.compDicts(this.changes, this.changesBefore)) {
      this.cancelChanges();
      return;
    }

    this.onSaveEvent.emit(this.changes);
  }

  cancelChanges() {
    this.onCancelEvent.emit();
  }

  getSpecializations(): any {
    this.http.get(this.url + "/Specializations").subscribe(data => {
      this.specializations = data;
      this.loaded = true;
    });
  }

}
