import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

export interface IAuthService {
  login(credentials: { username: string; password: string }): Observable<User>;
  register(userData: {
    username: string;
    email: string;
    password: string;
    isAdmin?: boolean;
  }): Observable<User>;
  logout(): void;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
}
