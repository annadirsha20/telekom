import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenu {
  title = 'TeleKom';
  constructor(public authService: AuthService, private router: Router) {}
  
  appsForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    text: new FormControl(''),
    status: new FormControl(''),
  })

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
