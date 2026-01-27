import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

interface Article {
  id: number;
  title: string;
  content: string;
  category: 'news' | 'game-updates' | 'guides' | 'events';
  author: string;
  date: string;
  likes: number;
  commentsCount: number;
  likedBy: string[];
}

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  likes: number;
  articleId: number;
  likedBy: string[];
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  articles: Article[] = [];
  comments: Comment[] = [];
  filteredArticles: Article[] = [];
  pagedArticles: Article[] = [];

  isModalOpen: boolean = false;

  selectedArticle: Article | null = null;

  currentUser: string = 'Guest';

  newComment = {
    content: '',
    articleId: 1
  };

  modalNewComment = {
    content: ''
  };

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  selectedCategory: string = 'all';
  searchTerm: string = '';


  categories = [
    { id: 'all', name: 'Összes kategória' },
    { id: 'news', name: 'Hírek' },
    { id: 'game-updates', name: 'Játék frissítések' },
    { id: 'guides', name: 'Útmutatók' },
    { id: 'events', name: 'Események' }
  ];

  constructor(private router: Router) {}

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.isModalOpen) {
      this.closeModal();
    }
  }

  ngOnInit(): void {
    this.loadSampleData();
    this.filteredArticles = [...this.articles];
    this.updatePagination();
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUser = localStorage.getItem("loggedUser") || 'Guest';
      }
    });
    
    this.currentUser = localStorage.getItem("loggedUser") || 'Guest';
  }

  likeArticle(article: Article, event?: Event): void {
    if (event) event.stopPropagation();
    
    const userIndex = article.likedBy.indexOf(this.currentUser);
    
    if (userIndex === -1) {
      article.likes++;
      article.likedBy.push(this.currentUser);
    } else {
      article.likes--;
      article.likedBy.splice(userIndex, 1);
    }
  }

  likeComment(comment: Comment): void {
    const userIndex = comment.likedBy.indexOf(this.currentUser);
    
    if (userIndex === -1) {
      comment.likes++;
      comment.likedBy.push(this.currentUser);
    } else {
      comment.likes--;
      comment.likedBy.splice(userIndex, 1);
    }
  }

  isArticleLiked(article: Article): boolean {
    return article.likedBy.includes(this.currentUser);
  }

  isCommentLiked(comment: Comment): boolean {
    return comment.likedBy.includes(this.currentUser);
  }

  addCommentToArticle(articleId: number): void {
    if (!this.modalNewComment.content.trim()) {
      alert('Kérjük írd meg a hozzászólásodat!');
      return;
    }

    if (this.currentUser === 'Guest') {
      alert('Kérjük jelentkezz be a hozzászóláshoz!');
      return;
    }

    const newComment: Comment = {
      id: this.comments.length + 1,
      author: this.currentUser,
      content: this.modalNewComment.content,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      articleId: articleId,
      likedBy: []
    };

    this.comments.unshift(newComment);
    
    if (this.selectedArticle) {
      this.selectedArticle.commentsCount++;
    }

    this.modalNewComment = { content: '' };
  }

  addComment(): void {
    if (!this.newComment.content.trim()) {
      alert('Kérjük írd meg a hozzászólásodat!');
      return;
    }

    if (this.currentUser === 'Guest') {
      alert('Kérjük jelentkezz be a hozzászóláshoz!');
      return;
    }

    const newComment: Comment = {
      id: this.comments.length + 1,
      author: this.currentUser,
      content: this.newComment.content,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      articleId: this.newComment.articleId,
      likedBy: []
    };

    this.comments.unshift(newComment);
    
    const article = this.articles.find(a => a.id === this.newComment.articleId);
    if (article) {
      article.commentsCount++;
    }

    this.newComment = { content: '', articleId: 1 };
  }
  
  openArticleModal(article: Article): void {
    this.selectedArticle = article;
    this.isModalOpen = true;
    this.modalNewComment = { content: '' };
    document.body.style.overflow = 'hidden';
  }

  closeModal(event?: MouseEvent): void {
    if (event && (event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.isModalOpen = false;
    } else if (!event) {
      this.isModalOpen = false;
    }
    document.body.style.overflow = 'auto';
  }

  getCommentsForArticle(articleId: number): Comment[] {
    return this.comments.filter(comment => comment.articleId === articleId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getArticleTitle(articleId: number): string {
    const article = this.articles.find(a => a.id === articleId);
    return article ? article.title : 'Ismeretlen cikk';
  }

  getCategoryName(category: string): string {
    const categoryObj = this.categories.find(c => c.id === category);
    return categoryObj ? categoryObj.name : category;
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'news': return '#4CAF50';
      case 'game-updates': return '#2196F3';
      case 'guides': return '#FF9800';
      case 'events': return '#E91E63';
      default: return '#9E9E9E';
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedArticles = this.filteredArticles.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getMax(a: number, b: number): number {
    return Math.max(a, b);
  }

  getDisplayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredArticles.length);
    return `${start} - ${end} / ${this.filteredArticles.length} cikk`;
  }

  filterArticles(): void {
    if (this.selectedCategory === 'all') {
      this.filteredArticles = [...this.articles];
    } else {
      this.filteredArticles = this.articles.filter(article =>
        article.category === this.selectedCategory
      );
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      this.filteredArticles = this.filteredArticles.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.content.toLowerCase().includes(term) ||
        article.author.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  loadSampleData(): void {
    this.articles = [
      {
        id: 11,
        title: 'Új pálya érkezett a játékba',
        content: 'Megérkezett a vadonatúj, havas tematikájú pálya, amely teljesen új játékmeneti elemeket és kihívásokat kínál. A csúszós terep, az extrém időjárási körülmények és az egyedi ellenféltípusok új stratégiák alkalmazását teszik szükségessé. A pálya egyaránt kihívást jelent kezdő és tapasztalt játékosok számára.',
        category: 'game-updates',
        author: 'Support',
        date: '2024-01-17',
        likes: 63,
        commentsCount: 3,
        likedBy: ['Guest', 'User1', 'User2']
      },
      {
        id: 4,
        title: 'Haladó stratégiák PvP módhoz',
        content: 'Ebben az útmutatóban részletesen bemutatjuk a jelenlegi PvP meta legfontosabb elemeit. Megvizsgáljuk a leghatékonyabb karakterkombinációkat, felszereléseket és taktikai megoldásokat. Az útmutató célja, hogy segítsen felkészülni rangsorolt mérkőzésekre és kompetitív eseményekre.',
        category: 'guides',
        author: 'Guides',
        date: '2024-01-18',
        likes: 34,
        commentsCount: 2,
        likedBy: ['User1']
      },
      {
        id: 16,
        title: 'Fejlesztői roadmap közzétéve',
        content: 'Nyilvánosságra hoztuk az év első felére vonatkozó fejlesztési ütemtervet. A roadmap részletesen bemutatja az érkező funkciókat, tervezett frissítéseket, valamint azokat a területeket, amelyek kiemelt figyelmet kapnak a következő hónapokban.',
        category: 'news',
        author: 'Support',
        date: '2024-01-24',
        likes: 31,
        commentsCount: 1,
        likedBy: []
      },
      {
        id: 1,
        title: 'Új játék frissítés érkezik a héten',
        content: 'A hét folyamán egy jelentős frissítés érkezik a játékhoz, amely több új funkciót, hibajavítást és egyensúlymódosítást tartalmaz. A frissítés célja a stabilitás növelése és a játékosélmény javítása. A pontos megjelenés péntek délután várható.',
        category: 'game-updates',
        author: 'Support',
        date: '2024-01-15',
        likes: 42,
        commentsCount: 2,
        likedBy: ['Guest']
      },
      {
        id: 8,
        title: 'Új moderátorok csatlakoztak',
        content: 'Örömmel jelentjük be, hogy új moderátorok csatlakoztak a csapathoz. Feladatuk a közösségi szabályok betartatása, a fórumok és chatfelületek felügyelete, valamint a játékosok segítése a mindennapi kérdésekben.',
        category: 'news',
        author: 'Support',
        date: '2024-01-16',
        likes: 26,
        commentsCount: 1,
        likedBy: ['User2']
      },
      {
        id: 13,
        title: 'Hétvégi dupla XP esemény',
        content: 'A hétvége folyamán minden játékos dupla tapasztalati pontot szerezhet minden játékmódban. Ez kiváló lehetőség a gyorsabb szintlépésre, karakterfejlesztésre és új tartalmak feloldására. Az esemény péntek estétől vasárnap éjfélig tart.',
        category: 'events',
        author: 'Admin',
        date: '2024-01-13',
        likes: 72,
        commentsCount: 4,
        likedBy: ['Guest', 'User1', 'User2', 'User3']
      },
      {
        id: 6,
        title: 'Karakterfejlesztési útmutató',
        content: 'Ez az útmutató részletes segítséget nyújt a karakterek hatékony fejlesztéséhez. Bemutatjuk a képességfák működését, a legjobb statelosztási megoldásokat, valamint tippeket adunk kezdőknek és haladóknak egyaránt.',
        category: 'guides',
        author: 'Guides',
        date: '2024-01-22',
        likes: 50,
        commentsCount: 2,
        likedBy: ['User1', 'User3']
      },
      {
        id: 14,
        title: 'Közösségi verseny indul',
        content: 'Új közösségi versenyt indítunk, ahol a játékosok különböző kihívások teljesítésével szerezhetnek pontokat. A legjobbak exkluzív jutalmakban részesülnek, beleértve ritka kozmetikai elemeket és egyedi címeket.',
        category: 'events',
        author: 'Admin',
        date: '2024-01-18',
        likes: 55,
        commentsCount: 3,
        likedBy: ['User1', 'User3']
      },
      {
        id: 3,
        title: 'Új kezdők útmutató',
        content: 'Ez az útmutató lépésről lépésre vezeti végig az új játékosokat az alapvető játékelemeken. Megismerheted a kezelőfelületet, a harcrendszert, valamint hasznos tippeket kapsz a gyorsabb fejlődéshez.',
        category: 'guides',
        author: 'Guides',
        date: '2024-01-05',
        likes: 56,
        commentsCount: 1,
        likedBy: ['Guest', 'User2']
      },
      {
        id: 17,
        title: 'Fontos bejelentés',
        content: 'Rendkívüli technikai probléma lépett fel, amely átmeneti szolgáltatáskimaradást okozhat. A csapat már dolgozik a hiba elhárításán, és minden tőlünk telhetőt megteszünk a mielőbbi helyreállítás érdekében.',
        category: 'news',
        author: 'Support',
        date: '2024-03-12',
        likes: 42,
        commentsCount: 1,
        likedBy: ['User2']
      }
    ];

    this.comments = [
      { id: 1, author: 'Norbi92', content: 'Ez nagyon jól hangzik, kíváncsi vagyok mit hoz a frissítés.', date: '2024-01-16', likes: 5, articleId: 11, likedBy: ['Guest'] },
      { id: 2, author: 'Nati', content: 'Nemtudom, találj ki valamit.', date: '2026-01-20', likes: 67, articleId: 11, likedBy: [] },
      { id: 3, author: 'Karesz', content: 'Van már pontos időpont, mikor indul?', date: '2024-01-12', likes: 2, articleId: 11, likedBy: ['User1'] },
      { id: 4, author: 'ZoliFPS', content: 'Őszintén, ezek a balansz változtatások már nagyon kellettek.', date: '2024-01-15', likes: 6, articleId: 4, likedBy: ['Guest', 'User2'] },
      { id: 5, author: 'MatePlay', content: 'Átolvastam az egészet, meglepően sok új dolgot tanultam.', date: '2024-01-06', likes: 4, articleId: 4, likedBy: [] },
      { id: 6, author: 'ShadowPvP', content: 'A PvP-s rész különösen hasznos lett, jó irány.', date: '2024-01-19', likes: 7, articleId: 16, likedBy: ['User1'] },
      { id: 7, author: 'MarketGuru', content: 'Végre valaki normálisan elmagyarázta a gazdasági rendszert.', date: '2024-01-21', likes: 5, articleId: 1, likedBy: [] },
      { id: 8, author: 'Petya', content: 'Új játékosként ez most nagyon sokat segített, köszi!', date: '2024-01-22', likes: 8, articleId: 1, likedBy: ['Guest'] },
      { id: 9, author: 'Laci', content: 'Jó, hogy előre szóltok a karbantartásról.', date: '2024-01-12', likes: 1, articleId: 8, likedBy: [] },
      { id: 10, author: 'Anna', content: 'Sok sikert az új moderátoroknak!', date: '2024-01-16', likes: 3, articleId: 13, likedBy: ['User2'] },
      { id: 11, author: 'Bence', content: 'Szerintem teljesen rendben vannak az új szabályok.', date: '2024-01-19', likes: 2, articleId: 13, likedBy: [] },
      { id: 12, author: 'TesztElek', content: 'A januári frissítés óta tényleg simábban fut a játék.', date: '2024-01-15', likes: 6, articleId: 13, likedBy: ['Guest'] },
      { id: 13, author: 'Felfedező', content: 'Az új pálya hangulata nagyon el lett találva.', date: '2024-01-18', likes: 9, articleId: 13, likedBy: ['User1'] },
      { id: 14, author: 'BalazsPC', content: 'Nálam is javult az FPS, főleg nagyobb harcoknál.', date: '2024-01-21', likes: 4, articleId: 6, likedBy: [] },
      { id: 15, author: 'LevelUp', content: 'Dupla XP alatt végre sikerült pár szintet ugrani.', date: '2024-01-14', likes: 10, articleId: 6, likedBy: ['Guest', 'User2'] },
      { id: 16, author: 'Versenyző', content: 'Az ilyen közösségi versenyek mindig feldobják a játékot.', date: '2024-01-18', likes: 7, articleId: 2, likedBy: [] },
      { id: 17, author: 'Niki', content: 'Remélem idén is lesznek különleges Valentin-napi jutalmak.', date: '2024-01-23', likes: 5, articleId: 2, likedBy: ['User1'] },
      { id: 18, author: 'Tomi', content: 'Jó látni, hogy folyamatosan jönnek az új tartalmak.', date: '2024-01-20', likes: 3, articleId: 2, likedBy: [] },
      { id: 19, author: 'HardcoreZ', content: 'Tetszik az irány, remélem ez így megy tovább.', date: '2024-01-16', likes: 6, articleId: 10, likedBy: [] },
      { id: 20, author: 'Rita', content: 'Az események mindig visszahoznak játszani.', date: '2024-01-13', likes: 8, articleId: 5, likedBy: ['User3'] },
      { id: 21, author: 'Stratéga', content: 'Jó lenne később egy részletesebb csapatos útmutató is.', date: '2024-01-24', likes: 4, articleId: 14, likedBy: [] },
      { id: 22, author: 'FixIt', content: 'Pozitív meglepetés, hogy ilyen gyorsan javították a hibákat.', date: '2024-01-24', likes: 6, articleId: 14, likedBy: ['Guest'] },
      { id: 23, author: 'KözösségiArc', content: 'Az ilyen eventek miatt jó ide visszajárni.', date: '2024-01-25', likes: 5, articleId: 14, likedBy: [] },
      { id: 24, author: 'Figyelő', content: 'Kíváncsi vagyok, mi lesz a következő nagy frissítés.', date: '2024-01-25', likes: 7, articleId: 7, likedBy: ['User2'] },
      { id: 25, author: 'Adam', content: 'Kezdőként ez pont az volt, amire szükségem volt.', date: '2024-01-26', likes: 3, articleId: 3, likedBy: [] },
      { id: 26, author: 'PlayerOne', content: 'Stabilabb lett a játék, kevesebb a fagyás.', date: '2024-01-27', likes: 4, articleId: 12, likedBy: [] },
      { id: 27, author: 'Eszter', content: 'Köszi a gyors javításokat, így sokkal élvezhetőbb.', date: '2024-01-27', likes: 2, articleId: 12, likedBy: ['Guest'] },
      { id: 28, author: 'Misi', content: 'Szerintem ez a szabályzat frissítés teljesen rendben van.', date: '2024-01-28', likes: 1, articleId: 9, likedBy: [] },
      { id: 29, author: 'Lilla', content: 'Nagyon várom a Valentin-napi eseményt.', date: '2024-01-29', likes: 5, articleId: 15, likedBy: [] },
      { id: 30, author: 'Eventes', content: 'Jöhet bármilyen event, én benne vagyok.', date: '2024-01-29', likes: 3, articleId: 15, likedBy: ['User1'] },
      { id: 31, author: 'Gabor', content: 'Remélem tényleg csak rövid ideig tart a leállás.', date: '2024-03-12', likes: 2, articleId: 17, likedBy: [] }
    ];
  }
}