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
  // private notification = inject(NotificationService); // ha külön service-t használsz

  cartItems: CartItem[] = [];
  isLoading = false;
  isPurchaseSuccess = false;

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

  purchase() {
    const username = localStorage.getItem('loggedUser');
    if (!username) {
      this.showNotification('Bejelentkezés szükséges a vásárláshoz', 'warning');
      return;
    }

    this.isLoading = true;
    this.isPurchaseSuccess = false;

    this.http.get<{ id: number }>(`http://localhost:3000/api/users/byname/${username}`)
      .subscribe({
        next: user => this.processPurchase(user.id),
        error: () => {
          this.isLoading = false;
          this.showNotification('Nem sikerült betölteni a felhasználói adatokat', 'error');
        }
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
            this.http.post<{ success: boolean; alreadyOwned?: boolean; message?: string }>(
              'http://localhost:3000/api/ownedg',
              { userid: userId, gameid: game.id }
            ).pipe(
              catchError(err => of({ success: false, error: err }))
            )
          );
        }

        this.cartItems = remaining;
        this.saveCart();

        if (requests.length === 0) {
          this.finishPurchase(false);
          return;
        }

        forkJoin(requests).subscribe({
          next: results => {
            const successes = results.filter(r => r.success).length;
            const alreadyOwned = results.filter(r => r.alreadyOwned).length;

            if (successes > 0) {
              this.showNotification(`${successes} játék sikeresen hozzáadva a könyvtárhoz!`, 'success');
              this.isPurchaseSuccess = true;
              setTimeout(() => this.router.navigate(['/library']), 1800);
            }

            if (alreadyOwned > 0) {
              this.showNotification(`${alreadyOwned} játék már a tulajdonodban volt`, 'info');
            }

            this.finishPurchase(true);
          },
          error: () => {
            this.showNotification('Váratlan hiba történt a tranzakció közben', 'error');
            this.finishPurchase(false);
          }
        });
      },
      error: () => {
        this.showNotification('Nem sikerült betölteni a játéklistát', 'error');
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
      }, 2000);
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    this.notification = { show: true, message, type };
    setTimeout(() => this.notification.show = false, 3800);
  }
  toStore(){
    this.router.navigate(['/']);
  }
}