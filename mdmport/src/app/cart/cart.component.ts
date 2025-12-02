import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

export interface CartItem {
  id: number;  
  name: string;
  price: number;
  image: string;
}
interface Game {
  id: number;
  title: string;
}
interface User {
  id: number;
  username: string;
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
  loadingPopup = false;
  loadingDone = false;

  toastMessage = '';
  toastVisible = false;
  toastType: 'success' | 'error' = 'success';
  toastWithActions = false;
  private toastTimeout: any;


  constructor(private auth: AuthService, private router: Router, private _http: HttpClient) {}

  ngOnInit() {
    this.loggedUser = localStorage.getItem('loggedUser');
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
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

purchase() {
  this.loadingPopup = true;
  this.loadingDone = false;

  const username = localStorage.getItem('loggedUser');
  if (!username) {
    this.loadingPopup = false;
    alert('Vásárláshoz be kell jelentkezni.');
    return;
  }

  this._http.get<User>(`http://localhost:3000/api/users/byname/${username}`)
    .subscribe({
      next: (user) => {
        const userid = user.id;

        this._http.get<Game[]>('http://localhost:3000/api/games')
          .subscribe({
            next: (games) => {
              const requests = this.cartItems.map(item => {
                const game = games.find(g => g.title === item.name);
                if (!game) {
                  console.error('Nincs ilyen játék az adatbázisban:', item.name);
                  return null;
                }
                return this._http.post('http://localhost:3000/api/ownedg', {
                  userid: userid,
                  gameid: game.id
                });
              }).filter(r => r !== null);

              if (requests.length === 0) {
                this.loadingPopup = false;
                alert('Nem találtam a játékokat az adatbázisban.');
                return;
              }

              forkJoin(requests).subscribe({
                next: () => {
                  this.loadingDone = true;
                  this.cartItems = [];
                  localStorage.removeItem('cart');

                  setTimeout(() => {
                    this.loadingPopup = false;
                    this.showToast('Sikeres vásárlás, játékok hozzáadva a fiókodhoz.', 'success');
                    this.router.navigate(['/']);
                  }, 2000);
                },
                error: (err) => {
                  console.error('Hiba az ownedg mentésnél:', err);
                  this.loadingPopup = false;
                  alert('Hiba történt a fizetés közben.');
                }
              });
            },
            error: (err) => {
              console.error('Hiba a games lekérésnél:', err);
              this.loadingPopup = false;
              alert('Hiba történt a játékok lekérésekor.');
            }
          });
      },
      error: (err) => {
        console.error(err);
        this.loadingPopup = false;
        alert('Felhasználó nem található vagy szerver hiba.');
      }
    });
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
