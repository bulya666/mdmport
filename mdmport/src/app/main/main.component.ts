import { Component, AfterViewInit, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { NgIf } from "@angular/common";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-main",
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.css",
})
export class MainComponent implements AfterViewInit, OnInit {
  menuOpen = false;
  loggedUser: string | null = null;
  userMenuOpen = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loggedUser = this.auth.getLoggedUser();
  }

  ngAfterViewInit(): void {
    if ((window as any).initGameCatalog) {
      (window as any).initGameCatalog();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  refresh() {
    window.location.reload();
  }

  logout() {
    this.auth.logout();
    this.loggedUser = null;
    this.closeMenu();
    this.router.navigate(["/"]);
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }
}
