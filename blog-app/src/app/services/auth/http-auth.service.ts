import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { IAuthService } from './auth-service.interface';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpAuthService implements IAuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.http
      .post<{ access_token: string; user: User }>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        map((response) => {
          // Добавляем токен в объект пользователя (опционально)
          const userWithToken: User = {
            ...response.user,
            accessToken: response.access_token,
          };
          return userWithToken;
        }),
        tap((user) => {
          // Сохраняем токен отдельно для интерцептора
          localStorage.setItem('access_token', user.accessToken!);
          localStorage.setItem('user', JSON.stringify(user));
        }),
      );
  }

  register(userData: {
    username: string;
    email: string;
    password: string;
    isAdmin?: boolean;
  }): Observable<User> {
    return this.http
      .post<{ access_token: string; user: User }>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        map((response) => ({
          ...response.user,
          accessToken: response.access_token,
        })),
        tap((user) => {
          localStorage.setItem('access_token', user.accessToken!);
          localStorage.setItem('user', JSON.stringify(user));
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
