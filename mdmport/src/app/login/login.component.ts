import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { FormsModule } from "@angular/forms";

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
  loggedUser: string | null = null;
  menuOpen = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loggedUser = this.auth.getLoggedUser();
  }

  async login() {
    const success = await this.auth.login(this.username, this.password);
    if (success) {
      this.loggedUser = this.auth.getLoggedUser();
      this.router.navigate(["/"]);
    } else {
      alert("Hibás adatok!");
    }
  }

  logout() {
    this.auth.logout();
    this.loggedUser = null;
    this.closeMenu();
    this.router.navigate(["/"]);
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
