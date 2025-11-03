import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: { username: string, password: string }[] = [
    { username: 'admin', password: 'admin123' },
    { username: 'penis67', password: 'penis67' },
  ];

  register(username: string, password: string): boolean {
    if (this.users.find(u => u.username === username)) {
      return false;
    }
    this.users.push({ username, password });
    return true;
  }

  login(username: string, password: string): boolean {
    return this.users.some(u => u.username === username && u.password === password);
  }
}