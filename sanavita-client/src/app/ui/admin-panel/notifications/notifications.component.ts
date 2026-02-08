import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdminNotificationsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  notificationsFiltered: any;
  notifications: any[] = [];
  notificationsFilteredAndSorted: any[] = [];
  loaded: boolean = false;
  sortBy: any = {};
  searchTerm: string = '';

  constructor(
    private http: HttpClient
  ) {
    this.sortBy = {
      id: {
        asc: true,
        desc: false
      },
      sender: {
        asc: false,
        desc: false
      },
      receiver: {
        asc: false,
        desc: false
      },
      date: {
        asc: false,
        desc: false
      }
    };

    this.getNotifications();
  }

  deactivate() {
    for (let key1 in this.sortBy) {
      for (let key2 in this.sortBy[key1]) {
        if (this.sortBy[key1][key2]) {
          this.sortBy[key1][key2] = false;
          return;
        }
      }
    }
  }

  sort() {
    if (this.sortBy.id.asc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => a.notificationId - b.notificationId);
    } else if (this.sortBy.id.desc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => b.notificationId - a.notificationId);
    } else if (this.sortBy.sender.asc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => a.senderFullName.localeCompare(b.senderFullName));
    } else if (this.sortBy.sender.desc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => b.senderFullName.localeCompare(a.senderFullName));
    } else if (this.sortBy.receiver.asc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => a.receiverFullName.localeCompare(b.receiverFullName));
    } else if (this.sortBy.receiver.desc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => b.receiverFullName.localeCompare(a.receiverFullName));
    } else if (this.sortBy.date.asc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => {
        const dateA: Date = new Date(a.date);
        const dateB: Date = new Date(b.date);
        return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
      });
    } else if (this.sortBy.date.desc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => {
        const dateA: Date = new Date(a.date);
        const dateB: Date = new Date(b.date);
        return (dateB < dateA) ? -1 : (dateB > dateA) ? 1 : 0;
      });
    }
  }

  sortById() {
    if (!this.sortBy.id.asc && !this.sortBy.id.desc) {
      this.deactivate();
      this.sortBy.id.asc = true
    } else if (this.sortBy.id.asc) {
      this.sortBy.id.asc = false;
      this.sortBy.id.desc = true;
    } else if (this.sortBy.id.desc) {
      this.sortBy.id.asc = true;
      this.sortBy.id.desc = false;
    }

    this.sort();
  }

  sortBySender() {
    if (!this.sortBy.sender.asc && !this.sortBy.sender.desc) {
      this.deactivate();
      this.sortBy.sender.asc = true;
    } else if (this.sortBy.sender.asc) {
      this.sortBy.sender.asc = false;
      this.sortBy.sender.desc = true;
    } else if (this.sortBy.sender.desc) {
      this.sortBy.sender.asc = true;
      this.sortBy.sender.desc = false;
    }

    this.sort();
  }

  sortByReceiver() {
    if (!this.sortBy.receiver.asc && !this.sortBy.receiver.desc) {
      this.deactivate();
      this.sortBy.receiver.asc = true;
    } else if (this.sortBy.receiver.asc) {
      this.sortBy.receiver.asc = false;
      this.sortBy.receiver.desc = true;
    } else if (this.sortBy.receiver.desc) {
      this.sortBy.receiver.asc = true;
      this.sortBy.receiver.desc = false;
    }

    this.sort();
  }

  sortByDate() {
    if (!this.sortBy.date.asc && !this.sortBy.date.desc) {
      this.deactivate();
      this.sortBy.date.asc = true
    } else if (this.sortBy.date.asc) {
      this.sortBy.date.asc = false;
      this.sortBy.date.desc = true;
    } else if (this.sortBy.date.desc) {
      this.sortBy.date.asc = true;
      this.sortBy.date.desc = false;
    }

    this.sort();
  }

  searchNotification() {
    const term = this.searchTerm.toLowerCase();
    this.notificationsFilteredAndSorted = this.notifications.filter(n =>
      (n.senderName?.toLowerCase().includes(term) || n.receiverName?.toLowerCase().includes(term))
    );
  }

  getNotifications() {
    this.http.get<any[]>(this.url + "/Notifications").subscribe((data: any[]) => {
      this.notifications = data;

      data.forEach((notif, i) => {
        // Відправник
        if (notif.senderType === 0) {
          this.http.get(this.url + "/Doctors/" + notif.senderId).subscribe((doctor: any) => {
            this.notifications[i].senderName = `${doctor.applicationUser.lastName} ${doctor.applicationUser.name} ${doctor.applicationUser.middleName}`;
          });
        } else {
          this.http.get(this.url + "/Patients/" + notif.senderId).subscribe((patient: any) => {
            this.notifications[i].senderName = `${patient.applicationUser.lastName} ${patient.applicationUser.name} ${patient.applicationUser.middleName}`;
          });
        }

        // Отримувач
        if (notif.receiverType === 0) {
          this.http.get(this.url + "/Doctors/" + notif.receiverId).subscribe((doctor: any) => {
            this.notifications[i].receiverName = `${doctor.applicationUser.lastName} ${doctor.applicationUser.name} ${doctor.applicationUser.middleName}`;
          });
        } else {
          this.http.get(this.url + "/Patients/" + notif.receiverId).subscribe((patient: any) => {
            this.notifications[i].receiverName = `${patient.applicationUser.lastName} ${patient.applicationUser.name} ${patient.applicationUser.middleName}`;
          });
        }
      });

      this.notificationsFilteredAndSorted = [...this.notifications];
      this.loaded = true;
    });
  }

  deleteNotification(notificationId: number) {
    this.http.delete(this.url + "/Notifications/" + notificationId).subscribe(res => {
      this.getNotifications();
    });
  }

}
