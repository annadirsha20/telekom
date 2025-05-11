import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthPage {
  title = 'TeleKom';

  test(): void {
    console.log('test')
  }
}
