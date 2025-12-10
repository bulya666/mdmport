import { Component, OnInit } from "@angular/core";
import { CommonModule, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { HttpClient } from "@angular/common/http";
import { forkJoin, of } from "rxjs";
import { catchError, map } from 'rxjs/operators';

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
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  loggedUser: string | null = null;
  userMenuOpen = false;
  menuOpen = false;
  cartItems: CartItem[] = [];
  loadingPopup = false;
  loadingDone = false;

  toastMessage = "";
  toastVisible = false;
  toastType: "success" | "error" = "success";
  toastWithActions = false;
  private toastTimeout: any;

  notification = {
    visible: false,
    message: "",
    type: "info" as "info" | "success" | "warning" | "error",
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private _http: HttpClient,
  ) {}

  ngOnInit() {
    this.loggedUser = localStorage.getItem("loggedUser");
    this.loadCart();
  }

  showMessage(
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
  ) {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.visible = true;

    setTimeout(() => {
      this.notification.visible = false;
    }, 3000);
  }

  loadCart() {
    const saved = localStorage.getItem("cart");
    this.cartItems = saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
  }

  removeFromCart(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  purchase() {
    this.loadingPopup = true;
    this.loadingDone = false;

    const username = localStorage.getItem("loggedUser");
    if (!username) {
      this.loadingPopup = false;
      this.showMessage("Vásárláshoz be kell jelentkezni.", "warning");
      return;
    }

    this._http
      .get<User>(`http://localhost:3000/api/users/byname/${username}`)
      .subscribe({
        next: (user) => {
          const userid = user.id;

          this._http
            .get<any[]>(`http://localhost:3000/api/ownedg/${userid}`)
            .subscribe({
              next: (owned) => {
                const ownedIds = owned.map((o) => o.gameid);

                this._http.get<Game[]>("http://localhost:3000/api/games")
                  .subscribe({
                    next: (games) => {
                      const requests: any[] = [];
                      const remainingCart: CartItem[] = [];

                      for (const item of this.cartItems) {
                        const name = (item.name || "").toString().trim().toLowerCase();
                        const game = games.find(g => (g.title || "").toString().trim().toLowerCase() === name);

                        if (!game) {
                          remainingCart.push(item);
                          continue;
                        }

                        if (ownedIds.includes(game.id)) {
                          this.showMessage(`Már birtoklod: ${game.title}`, "info");
                          continue;
                        }
                        
                        const req$ = this._http.post("http://localhost:3000/api/ownedg", {
                          userid: userid,
                          gameid: game.id,
                        }).pipe(
                          map((res: any) => ({
                            success: !!res?.success,
                            alreadyOwned: !!res?.alreadyOwned,
                            message: res?.message || null
                          })),
                          catchError((err) => of({
                            success: false,
                            error: true,
                            status: err?.status,
                            message: err?.error?.message || 'Hálózati / szerver hiba'
                          }))
                        );

                        requests.push(req$);
                      }

                      // Frissítjük a kosarat azokkal az elemekkel, amelyeknél nem találtunk játékot
                      this.cartItems = remainingCart;
                      localStorage.setItem("cart", JSON.stringify(this.cartItems));

                      if (requests.length === 0) {
                        this.loadingPopup = false;
                        this.showMessage("A kosárban lévő játékok közül nincs új vásárolható cím.", "info");
                        return;
                      }

                      forkJoin(requests).subscribe({
                        next: (responses: any[]) => {
                          const alreadyOwnedGames = responses
                            .filter(r => r.alreadyOwned)
                            .map(r => r.message || 'Ismeretlen játék');

                          const failed = responses.filter(r => !r.success && !r.alreadyOwned);
                          const successCount = responses.filter(r => r.success).length;

                          if (alreadyOwnedGames.length > 0) {
                            this.showMessage(
                              `Ezeket a játékokat már birtoklod: ${alreadyOwnedGames.join(', ')}`,
                              "warning"
                            );
                          }

                          if (failed.length > 0) {
                            this.showMessage(`${failed.length} vásárlás sikertelen (hiba).`, "error");
                          }

                          if (successCount > 0) {
                            this.showMessage(`${successCount} játék sikeresen megvásárolva!`, "success");
                          }

                          this.loadingDone = true;
                          // csak a sikeresek kerültek a DB-be → töröljük a lokális kosarat
                          this.cartItems = [];
                          localStorage.removeItem("cart");
                        },
                        error: (err) => {
                          // Ennek nem kéne lefutnia, mert catchError mindent kezel — de legyen fallback
                          console.error('forkJoin hiba:', err);
                          this.loadingPopup = false;
                          this.showMessage("Váratlan hiba történt a vásárlás közben.", "error");
                        }
                      });
                    },
                    error: () => {
                      this.loadingPopup = false;
                      this.showMessage("Nem sikerült lekérni a játékokat.", "error");
                    },
                  });
              },
              error: () => {
                this.loadingPopup = false;
                this.showMessage("Nem sikerült lekérni a birtokolt játékokat.", "error");
              },
            });
        },
        error: () => {
          this.loadingPopup = false;
          this.showMessage("Nem sikerült lekérni a felhasználót.", "error");
        },
      });
  }
}
