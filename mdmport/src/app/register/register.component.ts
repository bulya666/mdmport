import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service'; 
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone : true,
  imports: [FormsModule]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  register(): void {
    if (!this.username || !this.password) {
      this.toast.show('Tölts ki minden mezőt!', 'error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toast.show('A jelszavak nem egyeznek.', 'error');
      return;
    }

    this.http.post<any>('http://localhost:3000/api/register', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res?.success) {
          this.toast.show('Sikeres regisztráció! 🎉', 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        } else {
          this.toast.show(res.message || 'Ismeretlen hiba történt.', 'error');
        }
      },
      error: (err) => {
        console.error(err);
        this.toast.show('A felhasználónév már létezik vagy hiba történt.', 'error');
      }
    });
  }
}
