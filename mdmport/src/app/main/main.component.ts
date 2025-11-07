import { Component, AfterViewInit, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { NgIf } from "@angular/common";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-main",
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.css",
})
export class MainComponent implements AfterViewInit, OnInit {
  menuOpen = false;
  loggedUser: string | null = null;
  userMenuOpen = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loggedUser = this.auth.getLoggedUser();
  }

  ngAfterViewInit(): void {
    if ((window as any).initGameCatalog) {
      (window as any).initGameCatalog();
    }

    document.body.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains("buy")) {
        this.addToCart();
      }
    });
  }

addToCart() {
  const titleEl = document.getElementById("m-title") as HTMLElement;
  const priceEl = document.getElementById("m-price") as HTMLElement;
  const imageEl = document.getElementById("m-cover") as HTMLImageElement;

  // ellenőrzés, hogy minden adat elérhető
  if (!titleEl || !priceEl || !imageEl || !imageEl.src) {
    console.warn("Nem sikerült minden adatot beolvasni a játékhoz – hozzáadás megszakítva.");
    alert("Hiba történt a játék hozzáadásakor. Kérlek, próbáld újra.");
    return;
  }

  const title = titleEl.innerText.trim();
  const priceText = priceEl.innerText.trim();
  const image = imageEl.src;

  if (!title || title.toLowerCase().includes("játék címe")) {
    console.warn("A játék címe érvénytelen – hozzáadás megszakítva.");
    return;
  }

  const price =
    priceText.toLowerCase().includes("ingyen") || priceText.toLowerCase().includes("free")
      ? 0
      : parseFloat(priceText.replace("$", "").replace(",", "."));

  const item = { name: title, price: isNaN(price) ? 0 : price, image };

  const saved = localStorage.getItem("cart");
  const cart = saved ? JSON.parse(saved) : [];

  const alreadyInCart = cart.some((c: any) => c.name === item.name);
  if (alreadyInCart) {
    alert(`A(z) "${title}" már a kosárban van.`);
    return;
  }

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`A(z) "${title}" hozzáadva a kosárhoz!`);
  this.router.navigate(["/cart"]);
}


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  refresh() {
    window.location.reload();
  }

  logout() {
    this.auth.logout();
    this.loggedUser = null;
    this.closeMenu();
    this.router.navigate(["/"]);
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  toCart() {
    this.router.navigate(["/cart"]);
  }
}
