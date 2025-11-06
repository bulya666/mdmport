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
import { AuthService } from "../auth.service";
import { RouterLink } from "@angular/router";

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
    RouterLink,
  ],
  templateUrl: "./community.component.html",
  styleUrl: "./community.component.css",
})
export class CommunityComponent implements OnInit {
  menuOpen = false;
  loggedUser: string | null = null;
  userMenuOpen = false;

  constructor(private router: Router, private auth: AuthService) {}

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  logout() {
    this.auth.logout();
    this.loggedUser = null;
    this.closeMenu();
    this.closeUserMenu();
    this.router.navigate(["/"]);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  goToShop() {
    this.router.navigate(["/"]);
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }

  newPostContent = "";
  posts: Post[] = [];

  ngOnInit(): void {
    this.loggedUser = this.auth.getLoggedUser();
    this.loadPosts();
  }

  savePosts() {
    localStorage.setItem("community_posts", JSON.stringify(this.posts));
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
        {
          author: "Tóth Anna",
          date: new Date(),
          content: "Valaki tudja, mikor jön a következő esemény?",
          likes: 8,
          comments: [],
          showComments: false,
        },
      ];
    }
  }

  addPost() {
    if (!this.newPostContent.trim()) return;
    this.posts.unshift({
      author: "Vendég",
      date: new Date(),
      content: this.newPostContent,
      likes: 0,
      comments: [],
      showComments: false,
    });
    this.newPostContent = "";
    this.savePosts();
  }

  likePost(post: Post) {
    post.likes++;
    this.savePosts();
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
  }

  addComment(post: Post, input: HTMLInputElement) {
    const text = input.value.trim();
    if (!text) return;
    post.comments.push({ author: "Vendég", text });
    input.value = "";
    this.savePosts();
  }

  clearAll() {
    if (confirm("Biztosan törlöd az összes bejegyzést?")) {
      this.posts = [];
      localStorage.removeItem("community_posts");
    }
  }
  gallery: GalleryImage[] = [
    { src: "assets/community1.jpg", alt: "Közösségi esemény #1" },
    { src: "assets/community2.jpg", alt: "Közösségi esemény #2" },
    { src: "assets/community3.jpg", alt: "Közösségi esemény #3" },
  ];

  members: Member[] = [
    { name: "Kovács László", role: "Admin" },
    { name: "Tóth Anna", role: "Tag" },
    { name: "Szabó Péter", role: "Moderátor" },
  ];
}
