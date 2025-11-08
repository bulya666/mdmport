import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  username = "";
  password = "";

  constructor(private auth: AuthService, private router: Router) {}

  async register() {
    const success = await this.auth.register(this.username, this.password);
    if (success) {
      alert("Sikeres regisztráció!");
      this.router.navigate(["/login"]);
    } else {
      alert("Ez a felhasználónév már létezik vagy hiba történt!");
    }
  }

  goToShop() {
    this.router.navigate(["/"]);
  }
  goToCommunity() {
    this.router.navigate(["/community"]);
  }

  switch() {
    this.router.navigate(["/login"]);
  }

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
