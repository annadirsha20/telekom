import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthPage {
  title = 'TeleKom';

  loginData = {
    login: '',
    password: ''
  };

  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private router: Router, public authService: AuthService,) {}

  onLogin() {
    this.http.post(`${this.apiUrl}/login`, this.loginData, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          console.log("TEST")
          console.log(response)
          this.authService.currentUser = response.user;
          this.authService.userType = response.type;
          this.authService.userPriority = response.priority;

          if (this.authService.userType === 'admin') {
            this.router.navigate(['/lk-manager-apps']);
          } else {
            this.router.navigate(['/lk-client']);
          }
        },
        error: (error) => {
          console.error('Ошибка входа', error);
          alert('Неверные учетные данные');
        }
      });
  }
}