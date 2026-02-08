import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Notification, UserType } from './pchat.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pchat',
  templateUrl: './pchat.component.html',
  styleUrls: ['./pchat.component.css']
})
export class PchatComponent implements OnInit {
  url: string = environment.apiBaseUrl;
  patient: any;
  doctorId!: number;
  allPatientMessages: any[] = [];
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
    this.doctorId = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.getCurrentUser("patient").subscribe(patient => {
      this.patient = patient;
      this.loadMessages();
    });
  }

  goBack() {
    this.router.navigate(['/notifications']);
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
        (m.senderId === this.patient.patientId && Number(m.senderType) === UserType.Patient &&
        m.receiverId === this.doctorId && Number(m.receiverType) === UserType.Doctor) ||
        (m.senderId === this.doctorId && Number(m.senderType) === UserType.Doctor &&
        m.receiverId === this.patient.patientId && Number(m.receiverType) === UserType.Patient)
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message = new Notification();
    message.title = 'Повідомлення від пацієнта';
    message.content = this.newMessage;
    message.senderId = this.patient.patientId;
    message.senderType = UserType.Patient;
    message.receiverId = this.doctorId;
    message.receiverType = UserType.Doctor;
    message.date = new Date().toISOString();

    this.http.post(`${this.url}/Notifications`, message).subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }

}
