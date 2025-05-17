import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

interface Application {
  _id: string;
  title: string;
  text: string;
  status: 'new' | 'in progress' | 'closed';
  owner: string;
  createdAt: Date;
  appointed: string;
  isVip: boolean;
  previousStatus?: 'new' | 'in progress' | 'closed';
}

@Component({
  selector: 'app-lk-admin',
  templateUrl: './lk-manager-apps.component.html',
  styleUrls: ['./lk-manager-apps.component.scss']
})
export class LkManagerAppsPage implements OnInit {
  applications: Application[] = [];

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    const user = this.authService.currentUser

    if (!user) return;

    this.http.get<Application[]>(`http://localhost:5000/api/applicationsAdmin?user=${user}`, { withCredentials: true })
      .subscribe({
        next: (apps) => {
          this.applications = apps.map(app => ({
            ...app,
            createdAt: new Date(app.createdAt),
            previousStatus: app.status
          }));
        },
        error: (err) => {
          console.error('Ошибка при загрузке заявок:', err);
        }
      });
  }

  getStatusClass(status: string): string {
    return `status-indicator ${status.replace(/\s+/g, '-')}`;
  }

  onStatusChange(app: Application) {
    const previousStatus = app.previousStatus || app.status;

    this.http.patch(`http://localhost:5000/api/applications/${app._id}`, {
      status: app.status,
      prevStatus: previousStatus
    }, { withCredentials: true }).subscribe({
      next: () => {
        this.loadApplications();
      },
      error: (err) => {
        console.error('Ошибка при обновлении статуса', err);
        alert('Не удалось обновить статус заявки');
      }
    });
  }

  rejectApplication(app: Application) {
    const confirmReject = confirm('Вы уверены, что хотите отказаться от этой заявки?');
    if (!confirmReject) return;

    const isVip = app.isVip;
    const cost = isVip ? 5 : 1;

    this.http.patch(`http://localhost:5000/api/applications/set/${app._id}`, {
      appointedPrev: app.appointed,
      appointed: null,
      status: 'new',
      loadChange: -cost // передаём разницу нагрузки
    }, { withCredentials: true }).subscribe({
      next: () => {
        this.loadApplications(); // обновляем список
      },
      error: (err) => {
        console.error('Ошибка при отказе от заявки', err);
        alert('Не удалось отказаться от заявки');
      }
    });
  }
}