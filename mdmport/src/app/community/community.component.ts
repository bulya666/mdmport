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
        content: 'Fedezd fel az új, havas tematikájú pályát egyedi kihívásokkal.',
        category: 'game-updates',
        author: 'DevTeam',
        date: '2024-01-17',
        likes: 63,
        commentsCount: 3,
        likedBy: ['Guest', 'User1', 'User2']
      },
      {
        id: 4,
        title: 'Haladó stratégiák PvP módhoz',
        content: 'Ebben az útmutatóban bemutatjuk a leghatékonyabb PvP stratégiákat és karakterkombinációkat.',
        category: 'guides',
        author: 'GuideMaster',
        date: '2024-01-18',
        likes: 34,
        commentsCount: 2,
        likedBy: ['User1']
      },
      {
        id: 16,
        title: 'Fejlesztői roadmap közzétéve',
        content: 'Nyilvánossá tettük az év első felére vonatkozó fejlesztési terveket és prioritásokat.',
        category: 'news',
        author: 'DevTeam',
        date: '2024-01-24',
        likes: 31,
        commentsCount: 1,
        likedBy: []
      },
      {
        id: 1,
        title: 'Új játék frissítés érkezik héten',
        content: 'A következő frissítés számos új funkciót és javítást hoz a játékosoknak. Várható dátum: péntek délután.',
        category: 'game-updates',
        author: 'Admin',
        date: '2024-01-15',
        likes: 42,
        commentsCount: 2,
        likedBy: ['Guest']
      },
      {
        id: 8,
        title: 'Új moderátorok csatlakoztak',
        content: 'Bemutatjuk az új moderátorokat, akik a közösség rendjéért felelnek.',
        category: 'news',
        author: 'CommunityManager',
        date: '2024-01-16',
        likes: 26,
        commentsCount: 1,
        likedBy: ['User2']
      },
      {
        id: 13,
        title: 'Hétvégi dupla XP esemény',
        content: 'Egész hétvégén dupla tapasztalati pontot szerezhet minden játékos.',
        category: 'events',
        author: 'EventManager',
        date: '2024-01-13',
        likes: 72,
        commentsCount: 4,
        likedBy: ['Guest', 'User1', 'User2', 'User3']
      },
      {
        id: 6,
        title: 'Karakterfejlesztési útmutató',
        content: 'Tippek és trükkök a hatékony karakterfejlesztéshez kezdőknek és haladóknak.',
        category: 'guides',
        author: 'GuideMaster',
        date: '2024-01-22',
        likes: 50,
        commentsCount: 2,
        likedBy: ['User1', 'User3']
      },
      {
        id: 2,
        title: 'Karácsonyi esemény kezdődik',
        content: 'Idén is lesz karácsonyi eseményünk, ahol különleges jutalmakat szerezhettek.',
        category: 'events',
        author: 'EventManager',
        date: '2024-01-10',
        likes: 28,
        commentsCount: 3,
        likedBy: ['Guest']
      },
      {
        id: 10,
        title: 'Januári balansz frissítés',
        content: 'Több karakter és fegyver balanszolása történt a legutóbbi frissítésben.',
        category: 'game-updates',
        author: 'DevTeam',
        date: '2024-01-14',
        likes: 47,
        commentsCount: 1,
        likedBy: ['User2']
      },
      {
        id: 5,
        title: 'Gazdasági rendszer részletes magyarázata',
        content: 'Ismerd meg a játék gazdasági rendszerét, a kereskedelmet és az erőforrás-menedzsmentet.',
        category: 'guides',
        author: 'EconomyExpert',
        date: '2024-01-20',
        likes: 41,
        commentsCount: 1,
        likedBy: []
      },
      {
        id: 14,
        title: 'Közösségi verseny indul',
        content: 'Vegyél részt a közösségi versenyen és nyerj exkluzív jutalmakat.',
        category: 'events',
        author: 'EventManager',
        date: '2024-01-18',
        likes: 55,
        commentsCount: 3,
        likedBy: ['User1', 'User3']
      },
      {
        id: 7,
        title: 'Szerverkarbantartás bejelentése',
        content: 'Tervezett szerverkarbantartás lesz csütörtök hajnalban, rövid leállással.',
        category: 'news',
        author: 'Admin',
        date: '2024-01-12',
        likes: 18,
        commentsCount: 1,
        likedBy: []
      },
      {
        id: 3,
        title: 'Új kezdők útmutató',
        content: 'Készítettünk egy részletes útmutatót az új játékosok számára.',
        category: 'guides',
        author: 'GuideMaster',
        date: '2024-01-05',
        likes: 56,
        commentsCount: 1,
        likedBy: ['Guest', 'User2']
      },
      {
        id: 12,
        title: 'Hibajavítások és optimalizálás',
        content: 'Teljesítményjavítások és több kritikus hiba javítása történt.',
        category: 'game-updates',
        author: 'DevTeam',
        date: '2024-01-21',
        likes: 39,
        commentsCount: 2,
        likedBy: ['User1']
      },
      {
        id: 9,
        title: 'Közösségi szabályzat frissítése',
        content: 'Frissítettük a közösségi irányelveket a jobb felhasználói élmény érdekében.',
        category: 'news',
        author: 'Admin',
        date: '2024-01-19',
        likes: 22,
        commentsCount: 1,
        likedBy: []
      },
      {
        id: 15,
        title: 'Valentin-napi esemény előzetes',
        content: 'Különleges Valentin-napi kihívások és jutalmak érkeznek hamarosan.',
        category: 'events',
        author: 'EventManager',
        date: '2024-01-23',
        likes: 48,
        commentsCount: 2,
        likedBy: ['Guest', 'User3']
      },
      {
        id: 17,
        title: 'Fontos bejelentése',
        content: 'Tűz keletkezett a kádban, rövid leállás várható.',
        category: 'news',
        author: 'Admin',
        date: '2024-03-12',
        likes: 42,
        commentsCount: 1,
        likedBy: ['User2']
      }
    ];

    // Kommentek listája (kommentek száma megegyezik a cikkek commentsCount mezőjével)
    this.comments = [
      // Cikk 11 - 3 komment
      { id: 1, author: 'Játékos1', content: 'Nagyon várom a frissítést!', date: '2024-01-16', likes: 5, articleId: 11, likedBy: ['Guest'] },
      { id: 2, author: 'Játékos2', content: 'Remélem lesz benne új pálya is.', date: '2024-01-17', likes: 3, articleId: 11, likedBy: [] },
      { id: 3, author: 'Játékos3', content: 'Mikor kezdődik pontosan az esemény?', date: '2024-01-12', likes: 2, articleId: 11, likedBy: ['User1'] },
      
      // Cikk 4 - 2 komment
      { id: 4, author: 'GamerPro', content: 'A balansz változtatások nagyon kellettek már.', date: '2024-01-15', likes: 6, articleId: 4, likedBy: ['Guest', 'User2'] },
      { id: 5, author: 'NoobHunter', content: 'Az új útmutató sokat segített, köszi!', date: '2024-01-06', likes: 4, articleId: 4, likedBy: [] },
      
      // Cikk 16 - 1 komment
      { id: 6, author: 'PvPKing', content: 'A PvP stratégiák rész nagyon hasznos.', date: '2024-01-19', likes: 7, articleId: 16, likedBy: ['User1'] },
      
      // Cikk 1 - 2 komment
      { id: 7, author: 'TradeMaster', content: 'Végre érthetően le van írva a gazdasági rendszer.', date: '2024-01-21', likes: 5, articleId: 1, likedBy: [] },
      { id: 8, author: 'NewPlayer', content: 'Kezdőként ez az útmutató aranyat ér.', date: '2024-01-22', likes: 8, articleId: 1, likedBy: ['Guest'] },
      
      // Cikk 8 - 1 komment
      { id: 9, author: 'Watcher', content: 'Jó tudni előre a karbantartásról.', date: '2024-01-12', likes: 1, articleId: 8, likedBy: [] },
      
      // Cikk 13 - 4 komment
      { id: 10, author: 'CommunityFan', content: 'Üdv az új moderátoroknak!', date: '2024-01-16', likes: 3, articleId: 13, likedBy: ['User2'] },
      { id: 11, author: 'RuleFollower', content: 'A szabályzat frissítés teljesen korrekt.', date: '2024-01-19', likes: 2, articleId: 13, likedBy: [] },
      { id: 12, author: 'PatchTester', content: 'A januári frissítés után érezhetően jobb a játék.', date: '2024-01-15', likes: 6, articleId: 13, likedBy: ['Guest'] },
      { id: 13, author: 'Explorer', content: 'Az új pálya kinézete brutálisan jó lett.', date: '2024-01-18', likes: 9, articleId: 13, likedBy: ['User1'] },
      
      // Cikk 6 - 2 komment
      { id: 14, author: 'FPSBoost', content: 'Az optimalizálás tényleg javított az FPS-en.', date: '2024-01-21', likes: 4, articleId: 6, likedBy: [] },
      { id: 15, author: 'XPGrinder', content: 'Dupla XP hétvégén végre lehet haladni.', date: '2024-01-14', likes: 10, articleId: 6, likedBy: ['Guest', 'User2'] },
      
      // Cikk 2 - 3 komment
      { id: 16, author: 'Competitor', content: 'A közösségi verseny nagyon motiváló.', date: '2024-01-18', likes: 7, articleId: 2, likedBy: [] },
      { id: 17, author: 'RomanticGamer', content: 'Kíváncsi vagyok a Valentin-napi jutalmakra.', date: '2024-01-23', likes: 5, articleId: 2, likedBy: ['User1'] },
      { id: 18, author: 'CasualPlayer', content: 'Jó látni, hogy ennyire aktív a fejlesztés.', date: '2024-01-20', likes: 3, articleId: 2, likedBy: [] },
      
      // Cikk 10 - 1 komment
      { id: 19, author: 'HardcoreFan', content: 'A frissítések iránya nagyon ígéretes.', date: '2024-01-16', likes: 6, articleId: 10, likedBy: [] },
      
      // Cikk 5 - 1 komment
      { id: 20, author: 'EventLover', content: 'Az események mindig feldobják a játékot.', date: '2024-01-13', likes: 8, articleId: 5, likedBy: ['User3'] },
      
      // Cikk 14 - 3 komment
      { id: 21, author: 'StrategyFan', content: 'Jó lenne egy külön rész a csapatösszeállításokról is.', date: '2024-01-24', likes: 4, articleId: 14, likedBy: [] },
      { id: 22, author: 'BugHunter', content: 'Örülök, hogy a kritikus hibákat ilyen gyorsan javították.', date: '2024-01-24', likes: 6, articleId: 14, likedBy: ['Guest'] },
      { id: 23, author: 'SocialPlayer', content: 'A közösségi események miatt érdemes visszajárni.', date: '2024-01-25', likes: 5, articleId: 14, likedBy: [] },
      
      // Cikk 7 - 1 komment
      { id: 24, author: 'UpdateWatcher', content: 'Várom a következő nagyobb tartalmi frissítést.', date: '2024-01-25', likes: 7, articleId: 7, likedBy: ['User2'] },
      
      // Cikk 3 - 1 komment
      { id: 25, author: 'TestUser', content: 'Nagyon hasznos útmutató kezdőknek!', date: '2024-01-26', likes: 3, articleId: 3, likedBy: [] },
      
      // Cikk 12 - 2 komment
      { id: 26, author: 'PlayerOne', content: 'A hibajavítások után sokkal stabilabb a játék.', date: '2024-01-27', likes: 4, articleId: 12, likedBy: [] },
      { id: 27, author: 'GamerGirl', content: 'Köszönöm a gyors javításokat!', date: '2024-01-27', likes: 2, articleId: 12, likedBy: ['Guest'] },
      
      // Cikk 9 - 1 komment
      { id: 28, author: 'CommunityMember', content: 'A szabályzat frissítés jó irány.', date: '2024-01-28', likes: 1, articleId: 9, likedBy: [] },
      
      // Cikk 15 - 2 komment
      { id: 29, author: 'LoveGamer', content: 'Várom a Valentin-napi eseményt!', date: '2024-01-29', likes: 5, articleId: 15, likedBy: [] },
      { id: 30, author: 'EventFan', content: 'Minden eseményre várok!', date: '2024-01-29', likes: 3, articleId: 15, likedBy: ['User1'] },
      
      // Cikk 17 - 1 komment
      { id: 31, author: 'ConcernedPlayer', content: 'Remélem nem lesz hosszú leállás.', date: '2024-03-12', likes: 2, articleId: 17, likedBy: [] }
    ];
  }
}