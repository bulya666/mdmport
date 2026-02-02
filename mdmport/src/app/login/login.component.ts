import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { ToastService } from "../services/toast.service";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    FormsModule,
    MatSnackBarModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  errorMessage = "";
  loggedUser: string | null = null;
  menuOpen = false;
  isLoading = false;
  showPassword = false;

  usernameError: string | null = null;
  passwordError: string | null = null;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  ngOnInit() {
    this.auth.loggedUser$.subscribe((user) => (this.loggedUser = user));
  }

  login(): void {
    this.usernameError = null;
    this.passwordError = null;

    const trimmedUsername = this.username.trim();

    if (!trimmedUsername || !this.password) {
      this.toast.show("Töltsd ki az összes mezőt!", "error");
      return;
    }

    this.isLoading = true;

    this.http
      .post<any>("http://localhost:3000/api/login", {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res?.success) {
            localStorage.setItem("loggedUser", res.user);
            this.toast.show("Sikeres bejelentkezés!", "success");
            setTimeout(() => {
              this.router.navigate(["/"]).then(() => {
                window.location.reload();
              });
            }, 800);
          }
        },
        error: (err) => {
          this.isLoading = false;
          const msg = err.error?.message || "Hibás felhasználónév vagy jelszó!";
          this.toast.show(msg, "error");

          if (err.status === 401) {
            this.passwordError = "Hibás jelszó";
          }
        },
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
