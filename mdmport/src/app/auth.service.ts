import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Itt legyen az éles HTTPS API-d URL-je:
  private apiUrl = 'http://localhost:${PORT}/api/users';

  private http = inject(HttpClient);

  /**
   * Bejelentkezés a backendhez
   * @returns Promise<boolean> sikeresség
   */
  async login(username: string, password: string): Promise<boolean> {
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/login`, { username, password })
      );

      if (res && res.success) {
        localStorage.setItem('username', username);
        localStorage.setItem('token', res.token || '');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async register(username: string, password: string): Promise<boolean> {
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/register`, { username, password })
      );
      return !!res?.success;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }

  getLoggedUser(): string | null {
    return localStorage.getItem('username');
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }
}
