import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";

interface CartItem {
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  loggedUser: string | null = null;
  userMenuOpen = false;
  menuOpen = false;
  cartItems: CartItem[] = [];

  toastMessage = '';
  toastVisible = false;
  toastType: 'success' | 'error' = 'success';
  toastWithActions = false;
  private toastTimeout: any;

  loadingPopup = false;
  loadingDone = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loggedUser = this.auth.getLoggedUser();
    this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('cart');
    this.cartItems = saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  removeFromCart(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i !== item);
    this.saveCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + i.price, 0);
  }

  purchase() {
    this.loadingPopup = true;
    this.loadingDone = false;

    setTimeout(() => {
      this.loadingDone = true;

      setTimeout(() => {
        this.loadingPopup = false;
        this.cartItems = [];
        localStorage.removeItem('cart');

        this.showToast(
          `Sikeres vásárlás.`,
          "success",
          false
        );

        this.router.navigate(['/']);
      }, 900);
    }, 1800);
  }

  private showToast(
    message: string,
    type: 'success' | 'error' = 'success',
    withActions: boolean = false
  ) {
    this.toastMessage = message;
    this.toastType = type;
    this.toastWithActions = withActions;
    this.toastVisible = true;

    if (!withActions) {
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.toastVisible = false;
      }, 2200);
    }
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  refresh() { this.loadCart(); }
  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }
  closeUserMenu() { this.userMenuOpen = false; }
  logout() {
    this.auth.logout();
    this.loggedUser = null;
    this.closeMenu();
    this.router.navigate(['/']);
  }

startPurchase() {
  this.loadingPopup = true;
  this.loadingDone = false;
}

finishPurchase() {
  this.loadingDone = true;

  setTimeout(() => {
    this.loadingPopup = false;
    this.cartItems = [];
    localStorage.removeItem('cart');

    this.showToast(`Sikeres vásárlás.`, "success", false);
    this.router.navigate(['/']);
  }, 900);
}

}
