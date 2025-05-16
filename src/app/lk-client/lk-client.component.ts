// lk-client.component.ts

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
  isVip: boolean;
}

@Component({
  selector: 'app-lk',
  templateUrl: './lk-client.component.html',
  styleUrls: ['./lk-client.component.scss']
})
export class LkClientPage implements OnInit {
  title = '';
  description = '';
  applications: Application[] = [];

  constructor(
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  onSubmit() {
    if (!this.title.trim() || !this.description.trim()) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const applicationData = {
      title: this.title,
      text: this.description,
      owner: this.authService.currentUser,
      priority: this.authService.userPriority
    };

    console.log(this.authService.userPriority)

    this.http.post('http://localhost:5000/api/application', applicationData, { withCredentials: true })
      .subscribe({
        next: () => {
          alert('Заявка успешно отправлена!');
          this.title = '';
          this.description = '';
          this.loadApplications(); // обновляем список
        },
        error: (err) => {
          console.error('Ошибка при отправке заявки:', err);
          alert('Не удалось отправить заявку. Попробуйте позже.');
        }
      });
  }

  loadApplications() {
    const user = this.authService.currentUser

    if (!user) return;

    this.http.get<Application[]>(`http://localhost:5000/api/applications?user=${user}`, { withCredentials: true })
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
}