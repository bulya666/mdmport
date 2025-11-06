import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  async login(username: string, password: string): Promise<boolean> {
    const usersJson = localStorage.getItem("users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("username", username);
      return true;
    } else {
      return false;
    }
  }

  async register(username: string, password: string): Promise<boolean> {
    const usersJson = localStorage.getItem("users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    if (users.find((u: any) => u.username === username)) {
      return false;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }

  getLoggedUser(): string | null {
    return localStorage.getItem("username");
  }

  logout(): void {
    localStorage.removeItem("username");
  }
}
