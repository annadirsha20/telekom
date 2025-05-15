import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _currentUser: string | null = null;

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(user: string | null) {
    this._currentUser = user;
    if (user) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
    }
  }

  loadUserFromStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this._currentUser = user;
    }
  }

  logout() {
    this._currentUser = null;
    localStorage.removeItem('user');
  }
}