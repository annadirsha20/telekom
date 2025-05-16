import { Injectable } from '@angular/core';

type UserPriority = 'default' | 'vip';
type UserType = 'user' | 'admin' | null;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _currentUser: string | null = null;
  private _userType: UserType = null;
  private _userPriority: UserPriority = 'default'; // по умолчанию

  get currentUser(): string | null {
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

  get userType(): UserType {
    return this._userType;
  }

  set userType(type: UserType) {
    this._userType = type;
    if (type) {
      localStorage.setItem('userType', type);
    } else {
      localStorage.removeItem('userType');
    }
  }

  get userPriority(): UserPriority {
    return this._userPriority;
  }

  set userPriority(priority: UserPriority) {
    this._userPriority = priority;
    if (priority) {
      localStorage.setItem('userPriority', priority);
    } else {
      localStorage.removeItem('userPriority');
    }
  }

  loadUserFromStorage() {
    const user = localStorage.getItem('user');
    const type = localStorage.getItem('userType') as UserType;
    const priority = localStorage.getItem('userPriority') as UserPriority | null;

    if (user) {
      this._currentUser = user;
    }

    if (type) {
      this._userType = type;
    }

    if (priority) {
      this._userPriority = priority;
    }
  }

  logout() {
    this._currentUser = null;
    this._userType = null;
    this._userPriority = 'default';
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('userPriority');
  }
}