// community.component.ts
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { AuthService } from "../services/auth.service";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

interface Comment {
  author: string;
  text: string;
}

interface Post {
  author: string;
  date: Date;
  content: string;
  likes: number;
  comments: Comment[];
  showComments?: boolean;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  fullText: string;
  likes: number;
  likesBy?: string[];
  gameId?: number;
  image?: string;
}

@Component({
  selector: "app-community",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
  ],
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.css"],
})
export class CommunityComponent implements OnInit {
  loggedUser: string | null = null;
  posts: Post[] = [];
  newPostContent = "";

  allArticles: Article[] = [
    { id: 1, title: "Cyberpunk 2077 – Új frissítés elemzés", summary: "A legújabb patch főbb változásai.", fullText: "A frissítés több rétegben nyúl bele a játékba: finomítja a fegyverek visszarúgását...", likes: 67, gameId: 12 },
    { id: 2, title: "Cyberpunk 2077 – Legjobb fegyver build-ek", summary: "Top 5 erős játékstílus.", fullText: "A jelenlegi meta erősen támogatja azokat a build-eket...", likes: 34, gameId: 12 },
    { id: 3, title: "Counter-Strike 2 – Meta fegyverzet", summary: "A jelenlegi legerősebb fegyverek.", fullText: "A meta fegyverek elsősorban a magas sebzés/gyorsaság arány miatt...", likes: 23, gameId: 1 },
    { id: 4, title: "Counter-Strike 2 – Stratégia tippek", summary: "Hasznos túlélési stratégiák.", fullText: "A bombahelyzetek ellen a türelem és a helyzetfelismerés dönt...", likes: 15, gameId: 1 },
    { id: 5, title: "Dota 2 – META hősök", summary: "Az aktuálisan legerősebb karakterek.", fullText: "A meta hősök olyan képességkészlettel rendelkeznek...", likes: 4, gameId: 2 },
    { id: 6, title: "Dota 2 – Ranked fejlődés útmutató", summary: "Hogyan juss fel magasabb rangba.", fullText: "A fejlődés egyik alapja a szereppel való játszás...", likes: 32, gameId: 2 },
    { id: 7, title: "Team Fortress 2 – Class elemzés", summary: "Új frissítés változásai.", fullText: "Az új frissítés jelentős karakteregyensúly-módosításokat hozott...", likes: 51, gameId: 3 },
    { id: 8, title: "Team Fortress 2 – Kompetitív taktika", summary: "Versenyzés stratégiák.", fullText: "A kompetitív mód fókusza a csapatmunkán és a kommunikáción...", likes: 41, gameId: 3 },
    { id: 9, title: "World Of Tanks – Credit szerzési módszerek", summary: "A leghatékonyabb bevételi utak.", fullText: "A magas szintű csaták továbbra is a legjobb bevételi források...", likes: 17, gameId: 4 },
    { id: 10, title: "World Of Tanks – Tankok rangsora", summary: "Legjobb harckocsik.", fullText: "A versenyek meta tankjai a tűzerő, páncélzat és mozgékonyság arányán alapulnak...", likes: 54, gameId: 4 },
    { id: 11, title: "Green Hell – Túlélési tippek", summary: "Alapvető túlélési stratégiák.", fullText: "A dzsungelben való túlélés kulcsa az erőforrások gazdálkodása...", likes: 28, gameId: 5 },
    { id: 12, title: "Green Hell – Építési útmutató", summary: "Legjobb bázishelyek és építmények.", fullText: "A biztonságos bázisépítés kulcsfontosságú a hosszú távú túléléshez...", likes: 19, gameId: 5 },
    { id: 13, title: "Red Dead Redemption 2 – Kalandok útmutató", summary: "Legjobb mellékküldetések.", fullText: "A világ tele rejtett kincsekkel és történetekkel...", likes: 42, gameId: 6 },
    { id: 14, title: "Red Dead Redemption 2 – Online mód tippek", summary: "Hogyan szerezz aranyat hatékonyan.", fullText: "A Red Dead Online számos módot kínál a gazdagodásra...", likes: 31, gameId: 6 },
    { id: 15, title: "Rust – Bázisépítési stratégiák", summary: "Legbiztonságosabb bázisdesignok.", fullText: "A bázis tervezése kulcsfontosságú a rablók elleni védekezésben...", likes: 37, gameId: 7 },
    { id: 16, title: "Rust – PVP taktikák", summary: "Harc tippek kezdőknek.", fullText: "A PVP harcokban a pozicionálás és a taktika döntő fontosságú...", likes: 25, gameId: 7 },
    { id: 17, title: "Sons Of The Forest – Túlélési útmutató", summary: "Alapvető túlélési technikák.", fullText: "A szigeten való túlélés megköveteli az alapvető erőforrások ismeretét...", likes: 33, gameId: 8 },
    { id: 18, title: "Sons Of The Forest – Ellenfelek megismerése", summary: "Minden mutáns típusról.", fullText: "A sziget különböző mutánsokkal van tele, mindegyik egyedi támadási mintákkal...", likes: 21, gameId: 8 },
    { id: 19, title: "ARC Raiders – Kezdő útmutató", summary: "Alapvető játékmechanikák.", fullText: "Az ARC Raiders egy kooperatív lövöldözős játék, ahol a csapatmunka kulcs...", likes: 45, gameId: 9 },
    { id: 20, title: "ARC Raiders – Felszerelés optimalizálás", summary: "Legjobb fegyverek és felszerelések.", fullText: "A megfelelő felszerelés választása jelentősen növeli a túlélési esélyeidet...", likes: 29, gameId: 9 },
    { id: 21, title: "Where Winds Meet – Történet elemzés", summary: "A fő történet és mellékküldetések.", fullText: "A játék gazdag történelmi hátteret kínál a kínai dinasztiák korából...", likes: 38, gameId: 10 },
    { id: 22, title: "Where Winds Meet – Harcrendszer útmutató", summary: "Harc technikák és kombók.", fullText: "A harcrendszer mélysége lehetővé teszi számos egyedi harcstílus kialakítását...", likes: 26, gameId: 10 },
    { id: 23, title: "The Witcher 3: Wild Hunt – Quaest útmutató", summary: "Legjobb fő és mellékküldetések.", fullText: "A Witcher 3 számos lenyűgöző questtel rendelkezik, mindegyik egyedi történettel...", likes: 52, gameId: 11 },
    { id: 24, title: "The Witcher 3 – Build tervezés", summary: "Optimalizált játékstílusok.", fullText: "Geralt buildje testre szabható a különböző játékstílusokhoz...", likes: 44, gameId: 11 }
  ];

  featuredArticles: Article[] = [];
  modalOpen = false;
  selectedArticle: Article | null = null;
  selectedArticleImages: string[] = [];
  selectedArticlePrice: string = "Ingyen";

  constructor(
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  async loadImagesForArticles() {
    try {
      const allPhotos: any[] = await lastValueFrom(
        this.http.get<any[]>(`/api/gamephotos`)
      );

      for (const article of this.allArticles) {
        if (!article.gameId) {
          article.image = "/assets/no-image.jpg";
          continue;
        }

        const photo = allPhotos.find((p) => p.gameid === article.gameId);
        article.image = photo ? `/gamephotos/${photo.pic}` : "/assets/no-image.jpg";
      }
    } catch {
      for (const article of this.allArticles) {
        article.image = "/assets/no-image.jpg";
      }
    }
  }

  getRandomArticles(count: number): Article[] {
    return [...this.allArticles].sort(() => Math.random() - 0.5).slice(0, count);
  }

  async openModal(article: Article) {
    this.selectedArticle = article;
    this.modalOpen = true;
    document.body.classList.add("modal-open");

    this.selectedArticleImages = [];
    try {
      const photos: any[] = await lastValueFrom(
        this.http.get<any[]>(`/api/gamephotos`)
      );

      const articlePhotos = photos
        .filter((p) => p.gameid === article.gameId)
        .map((p) => `/gamephotos/${p.pic}`);

      this.selectedArticleImages = articlePhotos;
    } catch {}
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedArticle = null;
    document.body.classList.remove("modal-open");
  }

  likeArticle(article: Article) {
    if (!this.loggedUser) {
      this.router.navigate(["/login"]);
      return;
    }

    const user = this.loggedUser;
    if (!article.likesBy) article.likesBy = [];

    const alreadyLiked = article.likesBy.includes(user);

    if (!alreadyLiked) {
      article.likes = (article.likes || 0) + 1;
      article.likesBy.push(user);
    } else {
      article.likes = Math.max((article.likes || 0) - 1, 0);
      article.likesBy = article.likesBy.filter((u) => u !== user);
    }

    this.saveArticles();
  }

  saveArticles() {
    localStorage.setItem("community_articles", JSON.stringify(this.allArticles));
  }

  ngOnInit() {
    this.loggedUser = localStorage.getItem("loggedUser");
    this.loadPosts();
    this.loadImagesForArticles().then(() => {
      this.featuredArticles = this.getRandomArticles(6);
    });
  }

  loadPosts() {
    const data = localStorage.getItem("community_posts");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.posts = parsed.map((p: any) => ({
          ...p,
          date: new Date(p.date),
          showComments: false,
        }));
      } catch {
        this.posts = [];
      }
    } else {
      this.posts = [
        {
          author: "Kovács László",
          date: new Date(),
          content: "Ma reggel kipróbáltam az új frissítést – nagyon jól fut!",
          likes: 12,
          comments: [
            { author: "Anna", text: "Teljesen egyetértek!" },
            { author: "Péter", text: "Én is észrevettem a javulást!" },
          ],
          showComments: false,
        },
      ];
    }
  }

  savePosts() {
    localStorage.setItem("community_posts", JSON.stringify(this.posts));
  }

  addPost() {
    if (!this.loggedUser) {
      this.router.navigate(["/login"]);
      return;
    }

    const content = this.newPostContent.trim();
    if (!content) return;

    const newPost = {
      author: this.loggedUser,
      date: new Date(),
      content: content,
      likes: 0,
      likesBy: [],
      comments: [],
    };

    this.posts.unshift(newPost);
    this.newPostContent = "";
    this.savePosts();
  }

  likePost(post: any) {
    if (!this.loggedUser) {
      this.router.navigate(["/login"]);
      return;
    }

    const user = this.loggedUser;
    if (!post.likesBy) post.likesBy = [];

    const alreadyLiked = post.likesBy.includes(user);

    if (!alreadyLiked) {
      post.likes = (post.likes || 0) + 1;
      post.likesBy.push(user);
    } else {
      post.likes = Math.max((post.likes || 0) - 1, 0);
      post.likesBy = post.likesBy.filter((u: any) => u !== user);
    }

    this.savePosts();
  }

  addComment(post: any, commentInput: HTMLInputElement) {
    if (!this.loggedUser) {
      this.router.navigate(["/login"]);
      return;
    }

    const text = commentInput.value.trim();
    if (!text) return;

    if (!post.comments) post.comments = [];

    post.comments.push({
      author: this.loggedUser,
      text: text,
    });

    commentInput.value = "";
    this.savePosts();
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }
}
