import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { User } from '../../models/user.model';
import { AUTH_SERVICE } from './auth.token';
import { IAuthService } from './auth-service.interface';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private authService = inject(AUTH_SERVICE);
  private _user: WritableSignal<User | null> = signal(null);

  readonly user = this._user.asReadonly();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = this.authService.getCurrentUser();
    this._user.set(user);
  }

  setUser(user: User | null): void {
    this._user.set(user);
  }

  isAdmin(): boolean {
    const user = this._user();
    return user?.roles?.includes('admin') ?? false;
  }
}
