import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  games: any[] = [];
  selectedGame: any | null = null;
  gameShots: any[] = [];
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    const username = this.auth.getLoggedUser();
    if (!username) return console.error('Nincs bejelentkezett felhasználó!');

    // 1. Lekérjük a usert
    this.http.get<any>(`${this.apiUrl}/users/byname/${username}`).subscribe(user => {
      // 2. Lekérjük a felhasználó owned játékait
      this.http.get<any[]>(`${this.apiUrl}/ownedg/${user.id}`).subscribe(owned => {
        if (!owned.length) return console.log('Nincsenek owned játékok');
        const gameIds = owned.map(o => o.gameid);

        // 3. Lekérjük az összes játékot
        this.http.get<any[]>(`${this.apiUrl}/games`).subscribe(allGames => {
          this.games = allGames.filter(g => gameIds.includes(g.id));
          console.log('Játékok betöltve:', this.games);
        });
      });
    });
  }

  openModal(game: any): void {
    this.selectedGame = game;
    // Lekérjük a képeket
    this.http.get<any[]>(`${this.apiUrl}/gamephotos?gameid=${game.id}`).subscribe(
      photos => this.gameShots = photos,
      err => console.error('Hiba a képek betöltésénél', err)
    );
  }

  closeModal(): void {
    this.selectedGame = null;
    this.gameShots = [];
  }
}
