import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private apiUrl = "http://localhost:3000/api";
  private loggedUserSubject = new BehaviorSubject<string | null>(null);
  loggedUser$ = this.loggedUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkSession();
  }

  login(username: string, password: string) {
    return this.http
      .post<{
        username: string;
      }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response) => {
          if (response?.username) {
            this.loggedUserSubject.next(response.username);
            sessionStorage.setItem("user", response.username);
          }
        })
      );
  }

  register(username: string, password: string) {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/register`, {
      username,
      password,
    });
  }

  logout() {
    this.loggedUserSubject.next(null);
    sessionStorage.removeItem("user");
  }

  checkSession() {
    const user = sessionStorage.getItem("user");
    if (user) this.loggedUserSubject.next(user);
  }

  getLoggedUser() {
    return this.loggedUserSubject.value;
  }
}
