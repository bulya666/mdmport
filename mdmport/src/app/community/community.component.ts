import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink } from '@angular/router';
import { AuthService } from "../services/auth.service";

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

interface GalleryImage {
  src: string;
  alt: string;
}

interface Member {
  name: string;
  role: string;
}

interface Article {
title: string;
image: string;
summary: string;
}

@Component({
  selector: "app-community",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule , MatIconModule, MatTabsModule, MatListModule, FormsModule, MatFormFieldModule, MatInputModule, MatExpansionModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
})
export class CommunityComponent implements OnInit {
  loggedUser: string | null = null;
  posts: Post[] = [];
  newPostContent = "";



  allArticles: Article[] = [
    { title: 'Cyberpunk 2077 – Új DLC elemzés', image: 'assets/articles/cp2077.jpg', summary: 'A legújabb kiegészítő játékmenetbeli változásai.' },
    { title: 'Elden Ring – Top 10 build', image: 'assets/articles/elden.jpg', summary: 'A legerősebb és legjátszhatóbb karakter setupok.' },
    { title: 'Call of Duty meta breakdown', image: 'assets/articles/cod.jpg', summary: 'Az aktuális fegyver META részletes bontása.' },
    { title: 'Fortnite Chapter 5 – Mit hoz az új szezon?', image: 'assets/articles/fortnite.jpg', summary: 'Mechanikák, map update és balance.' },
    { title: 'GTA 6 – Legújabb szivárgások', image: 'assets/articles/gta6.jpg', summary: 'A megjelenés körüli pletykák elemzése.' },
    { title: 'Valorant – Agent tier list', image: 'assets/articles/val.jpg', summary: 'Verseny meta és karakter erősségek.' },
    { title: 'League of Legends – Patch 14.x elemzés', image: 'assets/articles/lol.jpg', summary: 'A legfontosabb változtatások hatása.' },
    { title: 'Apex Legends – Movement tech tippek', image: 'assets/articles/apex.jpg', summary: 'Speciális mozgási trükkök részletesen.' },
    { title: 'Assassin’s Creed Shadows – Mit tudunk eddig?', image: 'assets/articles/ac.jpg', summary: 'Történeti keret, karakterek és játékmenet.' },
    { title: 'The Witcher 4 fejlesztési hírek', image: 'assets/articles/witcher4.jpg', summary: 'A projekt állapota és várható irányok.' },
    { title: 'Overwatch 2 – Balance update', image: 'assets/articles/ow.jpg', summary: 'Meta-shake és hős frissítések.' },
    { title: 'Helldivers 2 tippek és stratégiák', image: 'assets/articles/helldivers.jpg', summary: 'Hatékony kooperáció és build ajánlások.' }
  ];

  featuredArticles: Article[] = [];
  modalOpen = false;
  selectedArticle: Article | null = null;
  articles: Article[] = [];

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.loggedUser = localStorage.getItem('loggedUser');
    this.loadPosts();
    this.featuredArticles = this.getRandomArticles(3);
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
      this.router.navigate(['/login']);
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
    this.newPostContent = '';
    this.savePosts();
  }

  likePost(post: any) {
    if (!this.loggedUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!post.likesBy) {
      post.likesBy = [];
    }

    const user = this.loggedUser;
    const index = post.likesBy.indexOf(user);

    if (index === -1) {
      post.likes++;
      post.likesBy.push(user);
    } else {
      post.likes--;
      post.likesBy.splice(index, 1);
    }

    this.savePosts();
  }

  addComment(post: any, commentInput: HTMLInputElement) {
    if (!this.loggedUser) {
      this.router.navigate(['/login']);
      return;
    }

    const text = commentInput.value.trim();
    if (!text) return;

    if (!post.comments) post.comments = [];

    post.comments.push({
      author: this.loggedUser,
      text: text,
    });

    commentInput.value = '';
    this.savePosts();
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }

  getRandomArticles(count: number): Article[] {
    const shuffled = [...this.allArticles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  openModal(article: Article): void {
    this.selectedArticle = article;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedArticle = null;
  }
}





// interface Article {
//   title: string;
//   summary: string;
//   fullText: string; // új mező a hosszabb szöveghez
// }

// allArticles: Article[] = [
//   { 
//     title: 'Cyberpunk 2077 – Új DLC elemzés', 
//     summary: 'A legújabb kiegészítő bemutatása röviden.', 
//     fullText: 'A legújabb DLC részletesen bemutatja a játékmenet változásait, új küldetéseket, fegyvereket és karakteropciókat. Elemzésünkben kitérünk a játékélményre, karakterfejlődésre és a stratégiákra, amik a játékban használhatók.' 
//   },
//   { 
//     title: 'Elden Ring – Top 10 build', 
//     summary: 'A legerősebb build-ek röviden.', 
//     fullText: 'Ebben a cikkben részletesen bemutatjuk a legerősebb és legjátszhatóbb karakter build-eket, taktikai tippekkel és felszerelés javaslatokkal. Tartalmazza a PvE és PvP optimalizált build-eket is.' 
//   },
//   { 
//     title: 'Call of Duty meta breakdown', 
//     summary: 'Fegyver META összefoglaló.', 
//     fullText: 'Átfogó elemzés az aktuális fegyver META-ról, karakterek hatékonyságáról és a legjobb stratégiákról, hogy versenyképes maradhass a játékban. Tippeket adunk fegyverválasztáshoz és perk kombinációkhoz.' 
//   }
// ];

// featuredArticles: Article[] = this.getRandomArticles(3);

// openModal(article: Article): void {
//   this.selectedArticle = article;
//   this.modalOpen = true;
// }

// closeModal(): void {
//   this.modalOpen = false;
//   this.selectedArticle = null;
// }