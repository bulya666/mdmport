import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    if ((window as any).initGameCatalog) {
      (window as any).initGameCatalog();
    }
  }
  
  menuOpen = false;

    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }

    closeMenu() {
      this.menuOpen = false;
    }

  refresh() {
    window.location.reload();
  }
}
