import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
interface Game {
  id: number;
  title: string;
  tag: string[];
  price: number;
  desc: string;
  thumbnail: string;
}

interface User {
  id: number;
  username: string;
  password: string;
}

interface Owned {
  id: number;
  userid: number;
  gameid: number;
}

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library.component.html',
})
export class LibraryComponent implements OnInit {
  games: Game[] = [];
  selectedGame: Game | null = null;
  gameShots: any[] = [];

  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Itt azt használd, amire a login komponens menti a nevet (pl. 'loggedUser')
    const username = localStorage.getItem('loggedUser');
    if (!username) {
      this.games = [];
      return;
    }

    // 1) user lekérése név alapján
    this.http.get<User>(`${this.api}/users/byname/${username}`)
      .subscribe(user => {
        const userId = user.id;

        // 2) ownedg rekordok lekérése userID alapján
        this.http.get<Owned[]>(`${this.api}/ownedg/${userId}`)
          .subscribe(owned => {
            const ownedIds = new Set(owned.map(o => o.gameid));

            if (ownedIds.size === 0) {
              this.games = [];
              return;
            }

            // 3) összes játék, majd szűrés a user által birtokolt gameid-kre
            this.http.get<Game[]>(`${this.api}/games`)
              .subscribe(allGames => {
                this.games = allGames.filter(g => ownedIds.has(g.id));
              });
          });
      });
  }

  openModal(game: Game) {
    this.selectedGame = game;
    // ha később kell, itt lehet a gameShots-ot is betölteni
  }

  closeModal() {
    this.selectedGame = null;
    this.gameShots = [];
  }
}
