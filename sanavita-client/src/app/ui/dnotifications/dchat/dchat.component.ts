import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Notification, UserType } from './dchat.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dchat',
  templateUrl: './dchat.component.html',
  styleUrls: ['./dchat.component.scss']
})
export class DchatComponent implements OnInit {
  url: string = environment.apiBaseUrl;
  doctor: any;
  patientId!: number;
  allDoctorMessages: any[] = [];
  messages: any[] = [];
  newMessage: string = '';
  @ViewChild('lastMessage') lastMessageRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.getCurrentUser("doctor").subscribe(doctor => {
      this.doctor = doctor;
      this.loadMessages();
    });
  }

  goBack() {
    this.router.navigate(['/dnotifications']);
  }

  ngAfterViewChecked(): void {
    this.scrollToLastMessage();
  }

  scrollToLastMessage() {
    if (this.lastMessageRef) {
      this.lastMessageRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  loadMessages() {
    this.http.get<Notification[]>(`${this.url}/Notifications`).subscribe((allNotifications: Notification[]) => {
      this.messages = allNotifications.filter(m =>
        (m.senderId === this.doctor.doctorId && Number(m.senderType) === UserType.Doctor &&
        m.receiverId === this.patientId && Number(m.receiverType) === UserType.Patient) ||
        (m.senderId === this.patientId && Number(m.senderType) === UserType.Patient &&
        m.receiverId === this.doctor.doctorId && Number(m.receiverType) === UserType.Doctor)
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message = new Notification();
    message.title = 'Повідомлення від лікаря';
    message.content = this.newMessage;
    message.senderId = this.doctor.doctorId;
    message.senderType = UserType.Doctor;
    message.receiverId = this.patientId;
    message.receiverType = UserType.Patient;
    message.date = new Date().toISOString();

    this.http.post(`${this.url}/Notifications`, message).subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }
}
