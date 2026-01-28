import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, forkJoin, of } from 'rxjs';

import { CartItem, Game, OwnedGame } from './cart-item.model';
import { CdkObserveContent } from "@angular/cdk/observers";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CdkObserveContent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  cartItems: CartItem[] = [];
  isLoading = false;
  isPurchaseSuccess = false;
  showConfirmDialog = false;
  pendingPurchase = false;

  notification = {
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  };

  ngOnInit() {
    this.loadCart();
  }

  private loadCart() {
    const saved = localStorage.getItem('cart');
    this.cartItems = saved ? JSON.parse(saved) : [];
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.saveCart();
  }

  get total(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  confirmPurchase() {
    if (this.cartItems.length === 0) return;

    const username = localStorage.getItem('loggedUser');
    if (!username) {
      this.showNotification('Bejelentkezés szükséges a vásárláshoz', 'warning');
      return;
    }

    this.showConfirmDialog = true;
  }

  cancelPurchase() {
    this.showConfirmDialog = false;
  }

  executePurchase() {
    this.showConfirmDialog = false;
    this.isLoading = true;

    const fakeDelay = Math.floor(Math.random() * 1600) + 1400;

    setTimeout(() => {
      this.startPurchaseProcess();
    }, fakeDelay);
  }

  private startPurchaseProcess() {
    const username = localStorage.getItem('loggedUser');
    if (!username) {
      this.handleError('Bejelentkezési állapot elveszett');
      return;
    }

    this.http.get<{ id: number }>(`http://localhost:3000/api/users/byname/${username}`).subscribe({
      next: (user) => this.processPurchase(user.id),
      error: () => this.handleError('Nem sikerült betölteni a felhasználói adatokat')
    });
  }

  private processPurchase(userId: number) {
    forkJoin({
      owned: this.http.get<OwnedGame[]>(`http://localhost:3000/api/ownedg/${userId}`),
      allGames: this.http.get<Game[]>(`http://localhost:3000/api/games`)
    }).subscribe({
      next: ({ owned, allGames }) => {
        const ownedIds = new Set(owned.map(o => o.gameid));
        const requests: any[] = [];
        const remaining: CartItem[] = [];

        for (const item of this.cartItems) {
          const game = allGames.find(g =>
            g.title.trim().toLowerCase() === item.name.trim().toLowerCase()
          );

          if (!game) {
            remaining.push(item);
            continue;
          }

          if (ownedIds.has(game.id)) {
            this.showNotification(`Már birtoklod: ${game.title}`, 'info');
            continue;
          }

          requests.push(
            this.http.post<{ success: boolean; alreadyOwned?: boolean }>(
              'http://localhost:3000/api/ownedg',
              { userid: userId, gameid: game.id }
            ).pipe(catchError(() => of({ success: false })))
          );
        }

        this.cartItems = remaining;
        this.saveCart();

        if (requests.length === 0) {
          this.finishPurchase(false);
          return;
        }

        forkJoin(requests).subscribe({
          next: (results) => {
            const successes = results.filter(r => r.success).length;

            if (successes > 0) {
              this.showNotification(`${successes} játék sikeresen hozzáadva!`, 'success');
              this.isPurchaseSuccess = true;
              setTimeout(() => this.router.navigate(['/library']), 1800);
            }

            this.finishPurchase(true);
          },
          error: () => {
            this.showNotification('Hiba történt a tranzakció közben', 'error');
            this.finishPurchase(false);
          }
        });
      },
      error: () => {
        this.showNotification('Nem sikerült betölteni a játékokat', 'error');
        this.finishPurchase(false);
      }
    });
  }

  private finishPurchase(success: boolean) {
    this.isLoading = false;

    if (success && this.isPurchaseSuccess) {
      setTimeout(() => {
        this.cartItems = [];
        localStorage.removeItem('cart');
        setTimeout(() => this.router.navigate(['/library']), 900);
      }, 2200);
    }
  }

  private handleError(message: string) {
    this.isLoading = false;
    this.showNotification(message, 'error');
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    this.notification = { show: true, message, type };
    setTimeout(() => this.notification.show = false, 4000);
  }

  toStore() {
    this.router.navigate(['/']);
  }
}
