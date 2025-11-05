import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (this.auth.login(this.username, this.password)) {
      localStorage.setItem('username', this.username);
      this.router.navigate(['/'], { state: { user: this.username } });
    } else {
      alert('Hibás adatok!');
    }
  }
  goBackshop() {
    this.router.navigate(['/']);
  }
  goBackcommunity() {
    this.router.navigate(['/community']);
  }
  switch() {
    this.router.navigate(['/register']);
  }
    menuOpen = false;

    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }

    closeMenu() {
      this.menuOpen = false;
    }
}