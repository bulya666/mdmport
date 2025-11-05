import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (this.auth.register(this.username, this.password)) {
      alert('Sikeres regisztráció! Most már bejelentkezhetsz.');
      this.router.navigate(['/login']);
    } else {
      alert('Ez a felhasználónév már létezik!');
    }
  }
  goBack() {
    this.router.navigate(['/']);
  }
  switch() {
    this.router.navigate(['/login']);
  }
    menuOpen = false;

    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }

    closeMenu() {
      this.menuOpen = false;
    }
}