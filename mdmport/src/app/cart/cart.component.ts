import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

interface CartItem {
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  loggedUser: string | null = null;
  userMenuOpen = false;
  menuOpen = false;
  cartItems: CartItem[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loggedUser = this.auth.getLoggedUser();
    this.loadCart();
  }

loadCart() {
  const saved = localStorage.getItem('cart');
  this.cartItems = saved ? JSON.parse(saved) : [];
  console.log("Betöltött kosár:", this.cartItems);
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
    this.cartItems = [];
    localStorage.removeItem('cart');
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu() {
    this.menuOpen = false;
  }
  refresh() {
    this.loadCart();
  }
  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }
  closeUserMenu() {
    this.userMenuOpen = false;
  }
  logout() {
    this.auth.logout();
    this.loggedUser = null;
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
