import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authService.loadUserFromStorage();
  }

  isUnavailebleRoute(): boolean {
    return this.router.url === '/auth' || this.router.url === '/lk-client' || this.router.url === '/lk-manager-apps' || this.router.url === '/lk-manager-apps-all';
  }

}
