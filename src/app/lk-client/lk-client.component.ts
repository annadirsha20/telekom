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

interface Device {
  device: string;
}

interface DeviceCount {
  deviceName: string;
  count: number;
}

@Component({
  selector: 'app-lk',
  templateUrl: './lk-client.component.html',
  styleUrls: ['./lk-client.component.scss']
})
export class LkClientPage implements OnInit {
  title = '';
  description = '';
  currentIndex = 0;
  showModal = false;
  applications: Application[] = [];
  devices: Device[] = [];
  devicesCount: DeviceCount[] = [];

  constructor(
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
    this.loadDevices();
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

    this.http.post('http://localhost:5000/api/application', applicationData, { withCredentials: true })
      .subscribe({
        next: () => {
          alert('Заявка успешно отправлена!');
          this.title = '';
          this.description = '';
          this.loadApplications();
        },
        error: (err) => {
          console.error('Ошибка при отправке заявки:', err);
          alert('Не удалось отправить заявку. Попробуйте позже.');
        }
      });
  }

  reportDeviceProblem(device: DeviceCount) {
    const user = this.authService.currentUser;
    const isVip = this.authService.userPriority === 'vip';

    if (!user) {
      alert('Вы не авторизованы');
      return;
    }

    const title = `Обнаружена проблема с устройством ${device.deviceName}`;
    const text = `Здравствуйте. У меня возникла проблема с устройством ${device.deviceName}.\n\n`
      + `Я прошу помощи в решении следующего вопроса:\n`
      + `Количество таких устройств: ${device.count} шт.\n`
      + `С уважением,\n${user}`;

    const reportData = {
      title,
      text,
      owner: user,
      priority: isVip ? 'vip' : 'default'
    };

    this.http.post('http://localhost:5000/api/application', reportData, { withCredentials: true }).subscribe({
      next: (response: any) => {
        console.log('Заявка создана:', response);
        this.loadApplications(); // обновляем список
        alert(`Заявка на устройство ${device.deviceName} успешно отправлена`);
      },
      error: (err) => {
        console.error('Ошибка при создании заявки:', err);
        alert('Не удалось отправить заявку. Попробуйте позже.');
      }
    });
  }

  loadDevices() {
    const user = this.authService.currentUser;

    if (!user) return;

    this.http.get<Device[]>(`http://localhost:5000/api/devices?user=${user}`, { withCredentials: true }).subscribe({
      next: (devices) => {
        // Подсчёт количества каждого устройства
        const map = new Map<string, number>();
        devices.forEach(d => {
          const key = d.device;
          const current = map.get(key) || 0;
          map.set(key, current + 1);
        });

        // Преобразование в массив объектов с количеством
        this.devicesCount = Array.from(map.entries()).map(([deviceName, count]) => ({
          deviceName,
          count
        }));

        console.log('Устройства с количеством:', this.devicesCount);
      },
      error: (err) => {
        console.error('Ошибка при загрузке устройств:', err);
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  get visibleDevices(): DeviceCount[] {
    const result: DeviceCount[] = [];
    for (let i = 0; i < 3; i++) {
      const index = this.currentIndex + i;
      if (index < this.devicesCount.length) {
        result.push(this.devicesCount[index]);
      }
    }
    return result;
  }

  prevDevice() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextDevice() {
    if (this.currentIndex < this.devicesCount.length - 1) {
      this.currentIndex++;
    }
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