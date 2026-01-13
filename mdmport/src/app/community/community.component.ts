import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Cikk (Article) adatszerkezet
interface Article {
  id: number;
  title: string;
  content: string;
  category: 'news' | 'game-updates' | 'guides' | 'events';
  author: string;
  date: string;
  likes: number;
  commentsCount: number;
  likedBy: string[]; // Új: Tárolja, ki likeolta már
}

// Komment (Comment) adatszerkezet
interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  likes: number;
  articleId: number;
  likedBy: string[]; // Új: Tárolja, ki likeolta már
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  // Cikkek és kommentek listái
  articles: Article[] = [];
  comments: Comment[] = [];
  
  // Szűrt cikkek és aktuális oldal cikkei
  filteredArticles: Article[] = [];
  pagedArticles: Article[] = [];

  // Modal változók
  isModalOpen: boolean = false;
  selectedArticle: Article | null = null;

  // Jelenlegi felhasználó (demo célokra)
  currentUser = 'Guest'; // Ezt később valós bejelentkezésre cserélni

  // Új komment adatai (fő oldalhoz)
  newComment = {
    author: '',
    content: '',
    articleId: 1
  };

  // Új komment adatai (modalhoz)
  modalNewComment = {
    author: '',
    content: ''
  };

  // Oldalváltozók
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  // Szűrési és keresési szempontok
  selectedCategory: string = 'all';
  searchTerm: string = '';

  // Kategóriák listája
  categories = [
    { id: 'all', name: 'Összes kategória' },
    { id: 'news', name: 'Hírek' },
    { id: 'game-updates', name: 'Játék frissítések' },
    { id: 'guides', name: 'Útmutatók' },
    { id: 'events', name: 'Események' }
  ];

  // ESC billentyű figyelése a modal bezárásához
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
  }

  // ==================== LIKE FUNKCIÓK ====================

  // Cikk likeolása/lelikeolása
  likeArticle(article: Article, event?: Event): void {
    if (event) event.stopPropagation();
    
    const userIndex = article.likedBy.indexOf(this.currentUser);
    
    if (userIndex === -1) {
      // Még nem likeolta -> like
      article.likes++;
      article.likedBy.push(this.currentUser);
    } else {
      // Már likeolta -> lelike
      article.likes--;
      article.likedBy.splice(userIndex, 1);
    }
  }

  // Komment likeolása/lelikeolása
  likeComment(comment: Comment): void {
    const userIndex = comment.likedBy.indexOf(this.currentUser);
    
    if (userIndex === -1) {
      // Még nem likeolta -> like
      comment.likes++;
      comment.likedBy.push(this.currentUser);
    } else {
      // Már likeolta -> lelike
      comment.likes--;
      comment.likedBy.splice(userIndex, 1);
    }
  }

  // Ellenőrzi, hogy a felhasználó már likeolta-e a cikket
  isArticleLiked(article: Article): boolean {
    return article.likedBy.includes(this.currentUser);
  }

  // Ellenőrzi, hogy a felhasználó már likeolta-e a kommentet
  isCommentLiked(comment: Comment): boolean {
    return comment.likedBy.includes(this.currentUser);
  }

  // ==================== KOMMENT FUNKCIÓK ====================

  addCommentToArticle(articleId: number): void {
    if (!this.modalNewComment.author.trim() || !this.modalNewComment.content.trim()) {
      alert('Kérjük töltsd ki mindkét mezőt!');
      return;
    }

    const newComment: Comment = {
      id: this.comments.length + 1,
      author: this.modalNewComment.author,
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

    this.modalNewComment = { author: '', content: '' };
  }

  // Komment hozzáadása fő oldalon
  addComment(): void {
    if (!this.newComment.author.trim() || !this.newComment.content.trim()) {
      alert('Kérjük töltsd ki mindkét mezőt!');
      return;
    }

    const newComment: Comment = {
      id: this.comments.length + 1,
      author: this.newComment.author,
      content: this.newComment.content,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      articleId: this.newComment.articleId,
      likedBy: []
    };

    this.comments.unshift(newComment);
    
    // Növeljük a cikk komment számát
    const article = this.articles.find(a => a.id === this.newComment.articleId);
    if (article) {
      article.commentsCount++;
    }

    // Reseteljük az űrlapot
    this.newComment = { author: '', content: '', articleId: 1 };
  }

  // ==================== MODAL FUNKCIÓK ====================
  
  openArticleModal(article: Article): void {
    this.selectedArticle = article;
    this.isModalOpen = true;
    this.modalNewComment = { author: '', content: '' };
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

  // ==================== SEGÉDFUNKCIÓK ====================

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

  // ==================== OLDALALAKÍTÁS ====================

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

  // ==================== ADATBETÖLTÉS ====================

  loadSampleData(): void {
    // Cikkek listája
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


    // Kommentek listája (kommentek száma megegyezik a cikkek commentsCount mezőjével)
    this.comments = [
  // Cikk 11 - 3 komment
  { id: 1, author: 'Norbi92', content: 'Ez nagyon jól hangzik, kíváncsi vagyok mit hoz a frissítés.', date: '2024-01-16', likes: 5, articleId: 11, likedBy: ['Guest'] },
  { id: 2, author: 'IceWolf', content: 'Ha tényleg jön új pálya, az hatalmas plusz lenne.', date: '2024-01-17', likes: 3, articleId: 11, likedBy: [] },
  { id: 3, author: 'Karesz', content: 'Van már pontos időpont, mikor indul?', date: '2024-01-12', likes: 2, articleId: 11, likedBy: ['User1'] },

  // Cikk 4 - 2 komment
  { id: 4, author: 'ZoliFPS', content: 'Őszintén, ezek a balansz változtatások már nagyon kellettek.', date: '2024-01-15', likes: 6, articleId: 4, likedBy: ['Guest', 'User2'] },
  { id: 5, author: 'MatePlay', content: 'Átolvastam az egészet, meglepően sok új dolgot tanultam.', date: '2024-01-06', likes: 4, articleId: 4, likedBy: [] },

  // Cikk 16 - 1 komment
  { id: 6, author: 'ShadowPvP', content: 'A PvP-s rész különösen hasznos lett, jó irány.', date: '2024-01-19', likes: 7, articleId: 16, likedBy: ['User1'] },

  // Cikk 1 - 2 komment
  { id: 7, author: 'MarketGuru', content: 'Végre valaki normálisan elmagyarázta a gazdasági rendszert.', date: '2024-01-21', likes: 5, articleId: 1, likedBy: [] },
  { id: 8, author: 'Petya', content: 'Új játékosként ez most nagyon sokat segített, köszi!', date: '2024-01-22', likes: 8, articleId: 1, likedBy: ['Guest'] },

  // Cikk 8 - 1 komment
  { id: 9, author: 'Laci', content: 'Jó, hogy előre szóltok a karbantartásról.', date: '2024-01-12', likes: 1, articleId: 8, likedBy: [] },

  // Cikk 13 - 4 komment
  { id: 10, author: 'Anna', content: 'Sok sikert az új moderátoroknak!', date: '2024-01-16', likes: 3, articleId: 13, likedBy: ['User2'] },
  { id: 11, author: 'Bence', content: 'Szerintem teljesen rendben vannak az új szabályok.', date: '2024-01-19', likes: 2, articleId: 13, likedBy: [] },
  { id: 12, author: 'TesztElek', content: 'A januári frissítés óta tényleg simábban fut a játék.', date: '2024-01-15', likes: 6, articleId: 13, likedBy: ['Guest'] },
  { id: 13, author: 'Felfedező', content: 'Az új pálya hangulata nagyon el lett találva.', date: '2024-01-18', likes: 9, articleId: 13, likedBy: ['User1'] },

  // Cikk 6 - 2 komment
  { id: 14, author: 'BalazsPC', content: 'Nálam is javult az FPS, főleg nagyobb harcoknál.', date: '2024-01-21', likes: 4, articleId: 6, likedBy: [] },
  { id: 15, author: 'LevelUp', content: 'Dupla XP alatt végre sikerült pár szintet ugrani.', date: '2024-01-14', likes: 10, articleId: 6, likedBy: ['Guest', 'User2'] },

  // Cikk 2 - 3 komment
  { id: 16, author: 'Versenyző', content: 'Az ilyen közösségi versenyek mindig feldobják a játékot.', date: '2024-01-18', likes: 7, articleId: 2, likedBy: [] },
  { id: 17, author: 'Niki', content: 'Remélem idén is lesznek különleges Valentin-napi jutalmak.', date: '2024-01-23', likes: 5, articleId: 2, likedBy: ['User1'] },
  { id: 18, author: 'Tomi', content: 'Jó látni, hogy folyamatosan jönnek az új tartalmak.', date: '2024-01-20', likes: 3, articleId: 2, likedBy: [] },

  // Cikk 10 - 1 komment
  { id: 19, author: 'HardcoreZ', content: 'Tetszik az irány, remélem ez így megy tovább.', date: '2024-01-16', likes: 6, articleId: 10, likedBy: [] },

  // Cikk 5 - 1 komment
  { id: 20, author: 'Rita', content: 'Az események mindig visszahoznak játszani.', date: '2024-01-13', likes: 8, articleId: 5, likedBy: ['User3'] },

  // Cikk 14 - 3 komment
  { id: 21, author: 'Stratéga', content: 'Jó lenne később egy részletesebb csapatos útmutató is.', date: '2024-01-24', likes: 4, articleId: 14, likedBy: [] },
  { id: 22, author: 'FixIt', content: 'Pozitív meglepetés, hogy ilyen gyorsan javították a hibákat.', date: '2024-01-24', likes: 6, articleId: 14, likedBy: ['Guest'] },
  { id: 23, author: 'KözösségiArc', content: 'Az ilyen eventek miatt jó ide visszajárni.', date: '2024-01-25', likes: 5, articleId: 14, likedBy: [] },

  // Cikk 7 - 1 komment
  { id: 24, author: 'Figyelő', content: 'Kíváncsi vagyok, mi lesz a következő nagy frissítés.', date: '2024-01-25', likes: 7, articleId: 7, likedBy: ['User2'] },

  // Cikk 3 - 1 komment
  { id: 25, author: 'Adam', content: 'Kezdőként ez pont az volt, amire szükségem volt.', date: '2024-01-26', likes: 3, articleId: 3, likedBy: [] },

  // Cikk 12 - 2 komment
  { id: 26, author: 'PlayerOne', content: 'Stabilabb lett a játék, kevesebb a fagyás.', date: '2024-01-27', likes: 4, articleId: 12, likedBy: [] },
  { id: 27, author: 'Eszter', content: 'Köszi a gyors javításokat, így sokkal élvezhetőbb.', date: '2024-01-27', likes: 2, articleId: 12, likedBy: ['Guest'] },

  // Cikk 9 - 1 komment
  { id: 28, author: 'Misi', content: 'Szerintem ez a szabályzat frissítés teljesen rendben van.', date: '2024-01-28', likes: 1, articleId: 9, likedBy: [] },

  // Cikk 15 - 2 komment
  { id: 29, author: 'Lilla', content: 'Nagyon várom a Valentin-napi eseményt.', date: '2024-01-29', likes: 5, articleId: 15, likedBy: [] },
  { id: 30, author: 'Eventes', content: 'Jöhet bármilyen event, én benne vagyok.', date: '2024-01-29', likes: 3, articleId: 15, likedBy: ['User1'] },

  // Cikk 17 - 1 komment
  { id: 31, author: 'Gabor', content: 'Remélem tényleg csak rövid ideig tart a leállás.', date: '2024-03-12', likes: 2, articleId: 17, likedBy: [] }
];
  }
}