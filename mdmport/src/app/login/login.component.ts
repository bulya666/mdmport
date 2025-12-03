import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../services/toast.service';

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, MatSnackBarModule, MatButtonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  errorMessage = '';
  loggedUser: string | null = null;
  menuOpen = false;

  constructor(private auth: AuthService, private http: HttpClient, private router: Router, private toast: ToastService) {}

  ngOnInit() {
      this.auth.loggedUser$.subscribe(user => this.loggedUser = user);
  }

  login(): void {
  this.http.post<any>('http://localhost:3000/api/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res?.success) {
          this.toast.show('Sikeres bejelentkezés!', 'success');
          localStorage.setItem('loggedUser', res.user);
            setTimeout(() => {
                this.router.navigate(['/']).then(() => {
                  window.location.reload();
                });
              }, 500);
        }
      },
      error: () => {
        this.toast.show('Hibás felhasználónév vagy jelszó.', 'error');
      }
    });
  }
  goToShop() {
    this.router.navigate(["/"]);
  }

  goToCommunity() {
    this.router.navigate(["/community"]);
  }

  switch() {
    this.router.navigate(["/register"]);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
  
}