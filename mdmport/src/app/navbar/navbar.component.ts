import { CommonModule } from '@angular/common';
import { Component, OnInit, ApplicationRef, createComponent, inject, HostListener} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LogoutOverlayComponent } from '../logout-overlay/logout-overlay.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule]
})
export class NavbarComponent implements OnInit {
  private appRef = inject(ApplicationRef);
  private router = inject(Router);
  private auth = inject(AuthService);
  loggedUser: string | null = null;
  menuOpen = false;
  userMenuOpen = false;

  constructor() {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loggedUser = localStorage.getItem('loggedUser');
      }
    });
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

toStore() {
  if (this.router.url === '/') {
    window.location.reload();
  } else {
    this.router.navigate(['/']);
  }
}

  logout() {
    const overlayRef = createComponent(LogoutOverlayComponent, { environmentInjector: this.appRef.injector });
    this.appRef.attachView(overlayRef.hostView);
    document.body.appendChild(overlayRef.location.nativeElement);

    setTimeout(() => {
      this.auth.logout();
      this.closeMenu();
      localStorage.removeItem('loggedUser');
      this.loggedUser = null;

      this.appRef.detachView(overlayRef.hostView);
      overlayRef.destroy();

      this.router.navigate(['/']).then(() => window.location.reload());
    }, 1500);
  }
    @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.userMenuOpen = false;
    }
  }
}
