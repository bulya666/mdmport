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
fullText: string;
imageUrl: string;
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
  constructor(private router: Router, private auth: AuthService) {}

//  allArticles: Article[] = [
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

  ngOnInit() {
    this.loggedUser = localStorage.getItem('loggedUser');
    this.loadPosts();
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

// ------------ cikk

//   openModal(article: Article): void {
//     this.selectedArticle = article;
//     this.modalOpen = true;
//  }

//   closeModal(): void {
//    this.modalOpen = false;
//    this.selectedArticle = null;

//    featuredArticles: Article[] = this.getRandomArticles(3);
//  }
}




