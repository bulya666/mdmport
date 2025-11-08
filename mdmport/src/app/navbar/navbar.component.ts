import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class NavbarComponent implements OnInit {
  loggedUser: string | null = null;
  menuOpen = false;
  userMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // 🔹 Figyeljük a route váltásokat, és mindig újraolvassuk a localStorage-ot
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loggedUser = localStorage.getItem('loggedUser');
      }
    });

    // 🔹 Első betöltéskor is
    this.loggedUser = localStorage.getItem('loggedUser');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  refresh() {
    window.location.reload();
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.loggedUser = null;
    this.router.navigate(['/']);
  }
}
