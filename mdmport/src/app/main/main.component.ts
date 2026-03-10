import { Component, AfterViewInit, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-main",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.css",
})
export class MainComponent implements AfterViewInit, OnInit {
  menuOpen = false;
  loggedUser: string | null = null;
  userMenuOpen = false;
  toastMessage = "";
  toastVisible = false;
  toastType: "success" | "error" = "success";
  toastWithActions = false;
  private toastTimeout: any;
  loadingRedirect = false;
  featured: any = null;
  cartItemCount: number = 0;
  shortDuration = 1500;
  selectedGame: any = null;

  isInCart(name: string): boolean {
    const saved = localStorage.getItem("cart");
    if (!saved) return false;
    const cart = saved ? JSON.parse(saved) : [];
    return cart.some((c: any) => c.name === name);
  }

  openGame(game: any) {
    this.selectedGame = game;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("loggedUser");
    this.loadFeatured();
    this.updateCartCount();

    window.addEventListener("storage", (e) => {
      if (e.key === "cart") this.updateCartCount();
    });
  }

  ngAfterViewInit(): void {
    if ((window as any).initGameCatalog) {
      (window as any).initGameCatalog();
    }
  }

  async loadFeatured() {
    const randomId = Math.floor(Math.random() * 12) + 1;

    fetch(`/api/games/${randomId}`)
      .then((r) => r.json())
      .then((data) => {
        this.featured = data;
        const f = this.featured;
        (document.getElementById("f-title") as HTMLElement).innerText = f.title;
        (document.getElementById("f-desc") as HTMLElement).innerText = f.desc;
        (document.getElementById("f-cover") as HTMLImageElement).src = f.thumbnail;
        (document.getElementById("f-price") as HTMLElement).innerText =
          f.price == 0 ? "INGYEN" : f.price;
      });
  }

  updateCartCount() {
    const cart = localStorage.getItem("cart");
    this.cartItemCount = cart ? JSON.parse(cart).length : 0;
  }

  private showToast(
    message: string,
    type: "success" | "error" = "success",
    withActions: boolean = false
  ) {
    this.toastMessage = message;
    this.toastType = type;
    this.toastWithActions = withActions;
    this.toastVisible = true;

    if (!withActions) {
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      this.toastTimeout = setTimeout(() => {
        this.toastVisible = false;
      }, 1500);
    }
  }

  continueShopping() {
    this.toastVisible = false;
  }

  goToCart() {
    this.toastVisible = false;
    this.router.navigate(["/cart"]);
  }

  RecomendedAddToCart() {
    const title = (document.getElementById("f-title") as HTMLElement)?.innerText?.trim();
    const priceText = (document.getElementById("f-price") as HTMLElement)?.innerText?.trim();
    const image = (document.getElementById("f-cover") as HTMLImageElement)?.src;

    if (!title || !image) return;

    this.addGameToCart(title, priceText, image);
  }

  addToCart() {
    const title = (document.getElementById("m-title") as HTMLElement)?.innerText?.trim();
    const priceText = (document.getElementById("m-price") as HTMLElement)?.innerText?.trim();
    const image = (document.getElementById("m-cover") as HTMLImageElement)?.src;

    if (!title || !image) return;

    this.addGameToCart(title, priceText, image);
    
  }

  addGameToCart(title: string, price: number | string, image: string) {
    if (!this.loggedUser) {
      this.showToast("Kérjük, jelentkezzen be a kosárhoz adáshoz.", "error");
      this.loadingRedirect = true;
      setTimeout(() => this.router.navigate(["/login"]), 1500);
      return;
    }

    let finalPrice: number;
    if (typeof price === 'string') {
      finalPrice = price.toLowerCase().includes('ingyen') || price.toLowerCase().includes('free')
        ? 0
        : parseFloat(price.replace(/[^0-9.,]/g, '').replace(',', '.'));
    } else {
      finalPrice = price;
    }

    if (isNaN(finalPrice)) finalPrice = 0;

    const item = { name: title.trim(), price: finalPrice, image };

    if (!item.name || item.name.toLowerCase().includes('játék címe')) {
      this.showToast("Érvénytelen játékcím.", "error");
      return;
    }

    const saved = localStorage.getItem("cart");
    const cart: any[] = saved ? JSON.parse(saved) : [];

    if (cart.some(c => c.name === item.name)) {
      this.showToast(`A(z) "${item.name}" már a kosárban van.`, "error");
      return;
    }

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();

    this.showToast(`A(z) "${item.name}" sikeresen hozzáadva a kosárhoz.`, "success", true);
  }
}