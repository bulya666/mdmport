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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("loggedUser");
    this.loadFeatured();
    this.updateCartCount();

    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') this.updateCartCount();
    });
  }
  ngAfterViewInit(): void {
    if ((window as any).initGameCatalog) {
      (window as any).initGameCatalog();
    }
  }

  async loadFeatured() {
    var randomId = Math.floor(Math.random() * 12) + 1;

    fetch(`/api/games/${randomId}`)
      .then((r) => r.json())
      .then((data) => {
        this.featured = data;
        const f = this.featured;
        (document.getElementById("f-title") as HTMLElement).innerText = f.title;
        (document.getElementById("f-desc") as HTMLElement).innerText = f.desc;
        (document.getElementById("f-cover") as HTMLImageElement).src =
          f.thumbnail;
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
    withActions: boolean = false,
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
    const titleEl = document.getElementById("f-title") as HTMLElement;
    const priceEl = document.getElementById("f-price") as HTMLElement;
    const imageEl = document.getElementById("f-cover") as HTMLImageElement;

    if (!this.loggedUser) {
      this.showToast("Kérjük, jelentkezzen be a kosárhoz adáshoz.", "error");

      this.loadingRedirect = true;

      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 1500);

      return;
    }

    if (!titleEl || !priceEl || !imageEl || !imageEl.src) {
      this.showToast("Hiba történt a játék hozzáadásakor.", "error");
      return;
    }

    const title = titleEl.innerText.trim();
    const priceText = priceEl.innerText.trim();
    const image = imageEl.src;

    if (!title || title.toLowerCase().includes("játék címe")) {
      this.showToast("Érvénytelen játékcím.", "error");
      return;
    }

    const price =
      priceText.toLowerCase().includes("ingyen") ||
      priceText.toLowerCase().includes("free")
        ? 0
        : parseFloat(priceText.replace("$", "").replace(",", "."));

    const item = { name: title, price: isNaN(price) ? 0 : price, image };

    const saved = localStorage.getItem("cart");
    const cart = saved ? JSON.parse(saved) : [];

    const alreadyInCart = cart.some((c: any) => c.name === item.name);
    if (alreadyInCart) {
      this.showToast(`A(z) "${title}" már a kosárban van.`, "error");
      return;
    }

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    this.updateCartCount();

    this.showToast(
      `A(z) "${title}" sikeresen hozzáadva a kosárhoz.`,
      "success",
      true,
    );
    const modal = document.getElementById("modal") as HTMLElement | null;
    if (modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  }
  addToCart() {
    const titleEl = document.getElementById("m-title") as HTMLElement;
    const priceEl = document.getElementById("m-price") as HTMLElement;
    const imageEl = document.getElementById("m-cover") as HTMLImageElement;

    if (!this.loggedUser) {
      this.showToast("Kérjük, jelentkezzen be a kosárhoz adáshoz.", "error");

      this.loadingRedirect = true;

      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 1500);

      return;
    }

    if (!titleEl || !priceEl || !imageEl || !imageEl.src) {
      this.showToast("Hiba történt a játék hozzáadásakor.", "error");
      return;
    }

    const title = titleEl.innerText.trim();
    const priceText = priceEl.innerText.trim();
    const image = imageEl.src;

    if (!title || title.toLowerCase().includes("játék címe")) {
      this.showToast("Érvénytelen játékcím.", "error");
      return;
    }

    const price =
      priceText.toLowerCase().includes("ingyen") ||
      priceText.toLowerCase().includes("free")
        ? 0
        : parseFloat(priceText.replace("$", "").replace(",", "."));

    const item = { name: title, price: isNaN(price) ? 0 : price, image };

    const saved = localStorage.getItem("cart");
    const cart = saved ? JSON.parse(saved) : [];

    const alreadyInCart = cart.some((c: any) => c.name === item.name);
    if (alreadyInCart) {
      this.showToast(`A(z) "${title}" már a kosárban van.`, "error");
      return;
    }

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateCartCount();

    this.showToast(
      `A(z) "${title}" sikeresen hozzáadva a kosárhoz.`,
      "success",
      true,  
    );
    if (this.toastTimeout) {
  clearTimeout(this.toastTimeout);
}
this.toastTimeout = setTimeout(() => {
  this.toastVisible = false;
}, this.shortDuration);
    const modal = document.getElementById("modal") as HTMLElement | null;
    if (modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  }
}
