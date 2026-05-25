import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { IAuthService } from './auth-service.interface';

const STORAGE_KEY = 'local_user';

@Injectable()
export class LocalAuthService implements IAuthService {
  login(credentials: { username: string; password: string }): Observable<User> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const full = JSON.parse(stored);
      if (full.username === credentials.username && full.password === credentials.password) {
        const { password, ...user } = full;
        return of(user as User);
      }
    }
    return throwError(() => new Error('Неверный логин или пароль'));
  }

  register(userData: {
    username: string;
    email: string;
    password: string;
    isAdmin?: boolean;
  }): Observable<User> {
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      roles: userData.isAdmin ? ['admin'] : ['user'],
      accessToken: 'fake-jwt-token',
    };
    const toStore = { ...newUser, password: userData.password };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    return of(newUser);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { password, ...user } = JSON.parse(raw);
    return user as User;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
