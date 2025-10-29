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
    // app.js Angular-kompatibilis inicializáló
    if ((window as any).initGameCatalog) {
      (window as any).initGameCatalog();
    }
  }
}
