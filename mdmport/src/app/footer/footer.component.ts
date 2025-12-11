import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  scrollToTop(smooth = true) {
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 120);
  }
}
