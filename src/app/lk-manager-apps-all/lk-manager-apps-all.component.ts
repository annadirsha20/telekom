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
}

@Component({
  selector: 'app-lk-admin-all',
  templateUrl: './lk-manager-apps-all.component.html',
  styleUrls: ['./lk-manager-apps-all.component.scss']
})
export class LkManagerAppsAllPage implements OnInit {
  applications: Application[] = [];

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.http.get<Application[]>('http://localhost:5000/api/applicationsAll', { withCredentials: true })
      .subscribe({
        next: (apps) => {
          this.applications = apps.map(app => ({
            ...app,
            createdAt: new Date(app.createdAt)
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
    this.http.patch(`http://localhost:5000/api/applications/${app._id}`, {
      status: app.status
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

  assignToMe(app: Application) {
    const confirmAssign = confirm('Вы действительно хотите взять эту заявку?');
    if (!confirmAssign) return;

    const isVip = app.isVip;
    const cost = isVip ? 5 : 1;

    this.http.patch(`http://localhost:5000/api/applications/set/${app._id}`, {
      appointed: this.authService.currentUser,
      loadChange: cost,
      appointedPrev: null
    }, { withCredentials: true }).subscribe({
      next: () => {
        console.log('Заявка назначена вам');
        this.loadApplications(); // обновляем список
      },
      error: (err) => {
        console.error('Ошибка при назначении заявки', err);
        alert('Не удалось назначить заявку');
      }
    });
  }
}