import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  errorMessage = '';
  loggedUser: string | null = null;
  menuOpen = false;

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
      this.auth.loggedUser$.subscribe(user => this.loggedUser = user);
  }

  login(): void {
  this.http.post<any>('http://localhost:3000/api/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          console.log('Bejelentkezett felhasználó:', res.user);
          localStorage.setItem('loggedUser', res.user);
          this.router.navigate(['/']).then(() => {
          window.location.reload(); 
        });

        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Hibás felhasználónév vagy jelszó.';
      }
      
    });
  }
  logout() {
  this.auth.logout();
  this.closeMenu();
  this.router.navigate(['/'])
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