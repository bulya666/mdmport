export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface Game {
  id: number;
  title: string;
}

export interface OwnedGame {
  gameid: number;
}