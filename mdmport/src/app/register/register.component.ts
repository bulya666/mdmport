import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirm = false;
  isLoading = false;

  passwordStrength = 0;
  strengthText = '';
  strengthClass = '';

  usernameError: string | null = null;
  passwordError: string | null = null;
  confirmError: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  validateUsername() {
    this.usernameError = null;
    if (this.username.trim().length < 3) {
      this.usernameError = 'A felhasználónév legalább 3 karakter hosszú kell legyen!';
    }
  }

  checkPasswordStrength() {
    const p = this.password;
    let score = 0;

    if (!p) {
      this.passwordStrength = 0;
      this.strengthText = '';
      this.strengthClass = '';
      return;
    }

    // Hosszúság ellenőrzés
    if (p.length >= 8) score += 20;
    if (p.length >= 12) score += 15;

    // Karaktertípusok
    if (/[a-z]/.test(p)) score += 15;
    if (/[A-Z]/.test(p)) score += 20;
    if (/[0-9]/.test(p)) score += 15;
    if (/[^A-Za-z0-9]/.test(p)) score += 15;

    this.passwordStrength = Math.min(100, score);

    if (score < 40) {
      this.strengthText = 'Gyenge';
      this.strengthClass = 'weak';
    } else if (score < 70) {
      this.strengthText = 'Közepes';
      this.strengthClass = 'medium';
    } else if (score < 90) {
      this.strengthText = 'Erős';
      this.strengthClass = 'strong';
    } else {
      this.strengthText = 'Nagyon erős';
      this.strengthClass = 'very-strong';
    }

    this.passwordError = p.length < 8 ? 'A jelszónak legalább 8 karakternek kell lennie!' : null;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm() {
    this.showConfirm = !this.showConfirm;
  }

  register() {
    this.usernameError = null;
    this.passwordError = null;
    this.confirmError = null;

    const trimmedUsername = this.username.trim();

    if (!trimmedUsername || !this.password || !this.confirmPassword) {
      this.toast.show('Töltsd ki az összes mezőt!', 'error');
      return;
    }

    if (trimmedUsername.length < 3) {
      this.usernameError = 'A felhasználónév legalább 3 karakter hosszú kell legyen!';
      return;
    }

    if (this.password.length < 8) {
      this.passwordError = 'A jelszónak legalább 8 karakternek kell lennie!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.confirmError = 'A jelszavak nem egyeznek!';
      return;
    }

    this.isLoading = true;

    this.http
      .post<any>('http://localhost:3000/api/register', {
        username: trimmedUsername,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res?.success) {
            this.toast.show('Sikeres regisztráció! Átirányítás...', 'success');
            setTimeout(() => this.router.navigate(['/login']), 1200);
          } else {
            this.toast.show(res.message || 'Hiba történt', 'error');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.toast.show(
            err.error?.message || 'A felhasználónév már létezik vagy szerver hiba!',
            'error'
          );
        },
      });
  }
}