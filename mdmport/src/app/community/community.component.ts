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
    content: 'Fedezd fel az új, havas tematikájú pályát egyedi kihívásokkal. A "Fagyhegyi Ösvény" névre hallgató új térkép tele van rejtett titkokkal, titkos átjárókkal és stratégiai pontokkal, amelyek teljesen új dimenziót adnak a játéknak. A pályán található dinamikus időjárás rendszer, ahol hóviharok és köd előfordulhat, minden meccset egyedivé tesz. A fejlesztők több mint hat hónapot dolgoztak a pálya kidolgozásán, és figyelembe vették a közösségi visszajelzéseket is. Az új pályán különleges erőforrások gyűjthetők, amelyek exkluzív felszerelések készítéséhez szükségesek.',
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
    content: 'Ebben az útmutatóban bemutatjuk a leghatékonyabb PvP stratégiákat és karakterkombinációkat. Megvizsgáljuk a meta jelenlegi állapotát, és részletesen bemutatjuk, hogyan lehet kihasználni az egyes karakterek erősségeit és gyengeségeit. A cikk tartalmaz gyakorlati példákat, videóelemzéseket és statisztikai adatokat a legjobb játékosok meccseiről. Külön fejezet szenteljük a csapatmunka fontosságának, a kommunikációs stratégiáknak és a térképismeretnek. Megtanítjuk, hogyan lehet előre jelezni az ellenfél mozdulatait, és hogyan lehet alkalmazkodni a változó helyzetekhez a ranglistás meccseken.',
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
    content: 'Nyilvánossá tettük az év első felére vonatkozó fejlesztési terveket és prioritásokat. A roadmap tartalmazza az új játékmódokat, karaktereket, felszereléseket és minőségi életjavításokat. Az első negyedévben várható a klánrendszer teljes átdolgozása, a grafikai motor frissítése és az új mentoráló rendszer bevezetése. A második negyedévben pedig egy teljesen új régió érkezik a játékba, amely legalább 20 órányi új tartalmat fog tartalmazni. Minden fejlesztés során figyelembe vesszük a közösség visszajelzéseit, és rendszeres fejlesztői blogbejegyzésekkel tájékoztatjuk a játékosokat a haladásról.',
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
    content: 'A következő frissítés számos új funkciót és javítást hoz a játékosoknak. Várható dátum: péntek délután. A 2.4.0 verziószámú frissítés tartalmazza az új "Vámpírok Birodalma" történetküldetést, amely 10 új küldetéssel bővíti a játékot. A frissítés során 5 új felszerelés érkezik, amelyeket különleges boss-ek legyőzésével lehet megszerezni. A hálózati kódot teljesen átírtuk, ami jelentősen csökkenti a késleltetést és javítja a kapcsolat stabilitását. A felhasználói felület teljesen megújul, új beállítási lehetőségekkel és testreszabható elemekkel. A frissítés mérete körülbelül 8 GB lesz, előre letölthető szerda éjféltől.',
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
    content: 'Bemutatjuk az új moderátorokat, akik a közösség rendjéért felelnek. A 10 új közösségi moderátor mindegyike több éves tapasztalattal rendelkezik a játékban, és már régóta aktív tagjai a közösségnek. Az új moderátorok speciális képzést kaptak a konfliktuskezelésről, a szabályok alkalmazásáról és a közösségi építésről. Minden moderátor rendelkezik saját szakterülettel: van aki a technikai kérdésekben jártas, más a PvP események szervezésében, harmadik pedig a nyelvi támogatásban. A moderátorok hetente tartanak "Közösségi Óra" elnevezésű eseményeket, ahol a játékosok közvetlenül beszélgethetnek velük és tehetnek fel kérdéseket.',
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
    content: 'Egész hétvégén dupla tapasztalati pontot szerezhet minden játékos. Az esemény péntek este 18:00-kor kezdődik és vasárnap éjfélig tart. A dupla XP minden tevékenységre vonatkozik: küldetések, PvP meccsek, raid-ek és crafting. Külön bónusz: ha egy klánban legalább 5 tag teljesít egy raid-et együtt, további 25% XP bónuszt kapnak. Az esemény alatt speciális XP boost elixírek is kaphatók a játékbeli boltban kedvezményes áron. Ne felejtsd el, hogy a hétvégi napi bejelentkezési jutalmak is duplázva lesznek! Javasoljuk, hogy készíts elő egy listát a fejleszteni kívánt karakterekről és képességekről, hogy maximálisan kihasználd az eseményt.',
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
    content: 'Tippek és trükkök a hatékony karakterfejlesztéshez kezdőknek és haladóknak. A cikk részletesen bemutatja, hogyan kell optimalizálni a képességpontok elosztását a karakter osztályodhoz és játékstílusodhoz. Megvizsgáljuk a legjobb felszerelési kombinációkat minden szinten, és bemutatjuk, hogyan lehet hatékonyan farmolni a ritka erőforrásokat. Külön fejezet szenteljük a képességrotációknak, amelyek maximalizálják a sebzést és minimalizálják az energiafogyasztást. A cikk tartalmaz gyakorlati példákat és számításokat, amelyek segítenek meghozni a legjobb döntéseket a karakterfejlesztés során. Végül bemutatjuk a legjobb mentoring csatornákat és közösségeket, ahol további segítséget kérhetsz.',
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
    content: 'Idén is lesz karácsonyi eseményünk, ahol különleges jutalmakat szerezhettek. A "Fagyott Birodalom" elnevezésű esemény 3 hétig tart, és tele van ünnepi küldetésekkel, kihívásokkal és titkos boss-ekkel. Az esemény során gyűjthetőek különleges karácsonyi érmék, amelyeket felhasználva szerezhettek exkluzív felszereléseket, mount-okat és háziállatokat. Az esemény központjában a "Jégpalota" áll, ahol napi küldetéseket lehet teljesíteni és speciális karácsonyi loot-okat szerezni. Minden hétvégén lesznek speciális raid-ek, ahol együtt kell megküzdeni a "Télapó" boss-szal. Az esemény végén minden résztvevő kap egy különleges karácsonyi ajándékcsomagot, amely véletlenszerű ritka tárgyakat tartalmaz.',
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
    content: 'Több karakter és fegyver balanszolása történt a legutóbbi frissítésben. A balansz frissítés célja a játék hosszú távú egészsége és a változatos játékstílusok támogatása. A "Mage" osztály kapott jelentős buff-okat az alacsony szinteken, míg a "Warrior" osztály védelmi képességeit kissé megnöveltük. 15 fegyver statisztikája változott, hogy biztosítsuk a fegyverek közötti különbségeket és specializációkat. A PvP módban bevezettük a "role queue" rendszert, amely biztosítja, hogy minden csapatban legyen tank, healer és damage dealer. A balansz változtatások alapján több mint 10,000 meccs statisztikáját elemeztük, és figyelembe vettük a ranglistás játékosok visszajelzéseit is.',
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
    content: 'Ismerd meg a játék gazdasági rendszerét, a kereskedelmet és az erőforrás-menedzsmentet. A cikk részletesen bemutatja az aukciósház működését, az árképzés stratégiáit és a profit maximalizálásának módjait. Megvizsgáljuk, hogy mely erőforrások a legkeresettebbek a különböző szervereken, és hogyan lehet előre jelezni az árváltozásokat. Külön fejezet szenteljük a crafting rendszernek, amely bemutatja, hogyan lehet alacsony befektetéssel magas értékű tárgyakat előállítani. A cikk tartalmaz gyakorlati példákat és számításokat, amelyek segítenek meghozni a legjobb gazdasági döntéseket. Végül bemutatjuk a legjobb kereskedelmi addon-okat és eszközöket, amelyek segítenek nyomon követni a piaci árakat és a kereskedelmi tranzakciókat.',
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
    content: 'Vegyél részt a közösségi versenyen és nyerj exkluzív jutalmakat. A "Hősök Tornája" elnevezésű verseny 4 héten át tart, és 3 különböző kategóriában lehet részt venni: PvP, PvE és kreatív tartalom. A PvP kategóriában a legtöbb ranglistás pontot szerző játékosok versenyeznek, a PvE kategóriában pedig a leggyorsabb raid clear időket kell produkálni. A kreatív kategóriában a játékosok saját fan art-okat, cosplay-eket és videókat készíthetnek. Minden kategória győztesei exkluzív fegyvereket, armorokat és mount-okat kapnak, valamint a nevük örök időkre felkerül a játék "Dicsőség Csarnokába". A verseny alatt napi stream-ek lesznek, ahol a legjobb pillanatokat mutatjuk be, és interjúkat készítünk a versenyzőkkel.',
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
    content: 'Tervezett szerverkarbantartás lesz csütörtök hajnalban, rövid leállással. A karbantartás január 12-én 04:00 és 08:00 között történik. A karbantartás során a szerver hardverét frissítjük, ami jelentősen javítja a teljesítményt és csökkenti a leállásokat a csúcsidőszakokban. Emellett telepítjük a legújabb biztonsági frissítéseket és optimalizáljuk az adatbázis szerkezetét. A karbantartás alatt nem lesz elérhető a játék, de a weboldal és a fórum továbbra is működni fog. Javasoljuk, hogy a karbantartás előtt fejezd be a folyamatban lévő meccseidet és mentsd el a fontos adataidat. A karbantartás után minden játékos kap 500 aranyat és 24 órás XP boost-ot a kellemetlenségek elkerüléséért.',
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
    content: 'Készítettünk egy részletes útmutatót az új játékosok számára. Az útmutató 10 fejezetből áll, amelyek lépésről lépésre bemutatják a játék alapjait. Az első fejezetek a karakterlétrehozást, az alapvető irányítást és a felhasználói felület ismertetését tartalmazzák. Középső fejezetek a combat rendszert, a képességek használatát és az erőforrás-gyűjtést magyarázzák el. A végén pedig bemutatjuk a haladó funkciókat, mint a klánok, a crafting és a PvP. Az útmutató interaktív elemeket is tartalmaz: gyakorló küldetéseket, tesztkérdéseket és videó beágyazásokat. Minden fejezet végén található egy "Gyakorlati tanács" rovat, ahol tapasztalt játékosok osztják meg a titkaikat. Az útmutató ingyenesen elérhető a játék menüjében, és folyamatosan frissül az új tartalmakkal.',
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
    content: 'Teljesítményjavítások és több kritikus hiba javítása történt. A frissítés során 47 ismert hibát javítottunk ki, köztük a memóriaszivárgást a hosszú játékülés során, a térkép betöltési problémákat és a chat rendszer lefagyásait. Optimalizáltuk a grafikai motort, ami átlagosan 15% FPS növekedést eredményezett az alacsony és közepes konfigurációjú számítógépeken. A hálózati kódot finomhangoltuk, csökkentve a packet loss-t és javítva a játék érzékenységét. A felhasználói felület kapott több kisebb javítást is: gyorsabb betöltési időket, simább animációkat és jobb felbontástámogatást. A frissítés tartalmazza a legújobb DirectX 12 Ultimate támogatást is, amely további grafikai fejlesztéseket tesz lehetővé a kompatibilis hardveren.',
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
    content: 'Frissítettük a közösségi irányelveket a jobb felhasználói élmény érdekében. Az új szabályzat részletesebben definiálja a megfelelő viselkedést a chatben, a fórumon és a hangcsatornákon. Bevezettük a "három figyelmeztetés" rendszert, amely transzparensebbé teszi a moderációs folyamatot. Az új szabályzat tartalmaz speciális szakaszokat a csalás elleni küzdelemről, a számlakereskedelem megelőzéséről és a személyes adatok védelméről. Kiterjesztettük a jelentési rendszert, amely most már lehetővé teszi a voice chat incidensek jelentését és a bizonyítékok feltöltését. A moderátorok kaptak új eszközöket a gyorsabb és pontosabb döntéshozatalhoz. A szabályzat minden változása a közösségi visszajelzések alapján történt, és több hónapos konzultáció eredménye.',
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
    content: 'Különleges Valentin-napi kihívások és jutalmak érkeznek hamarosan. A "Szívek Völgye" elnevezésű esemény február 10-étől 20-áig tart, és romantikus küldetések sorozatát kínálja. Az esemény során párokban kell teljesíteni a küldetéseket, amelyek erősítik a csapatmunkát és a koordinációt. A jutalmak között szerepelnek rózsaszín és piros színű armorok, szív alakú fegyverek és különleges mount-ok. Az esemény központi eleme a "Szerelmi Templom", ahol napi boss-ekkel kell megküzdeni és ritka loot-okat szerezni. Különleges jutalom: ha egy pályán keresztül végigjátszod az eseményt ugyanazzal a partnerrel, kaptok egy exkluzív "Örök Szerelem" címert. Az esemény alatt speciális Valentin-napi csomagok is megjelennek a boltban, amelyek tartalmazzák a díszítő tárgyakat és boost-okat.',
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
    content: 'Tűz keletkezett a kádban, rövid leállás várható. A karbantartás március 12-én 14:00 és 16:00 között történik, amikor a tűzoltók ellenőrzik az épület tűzvédelmi rendszerét. A leállás alatt nem lesz elérhető a játék, de a fiókok adatai teljes biztonságban vannak. A karbantartás után minden játékos kap 1000 aranyat és 7 napos XP boost-ot a kellemetlenségek elkerüléséért. Emellett a karbantartást kihasználva telepítünk egy kisebb hotfix-et is, amely javítja a legutóbbi frissítés néhány kisebb hibáját. Javasoljuk, hogy a karbantartás előtt fejezd be a folyamatban lévő raid-eket és mentsd el a fontos adataidat. Követd a hivatalos Twitter fiókunkat a legfrissebb információkért a karbantartás állapotáról.',
    category: 'news',
    author: 'Admin',
    date: '2024-03-12',
    likes: 42,
    commentsCount: 1,
    likedBy: ['User2']
  },
  // =============== ÚJ CIKKEK ===============
  {
    id: 18,
    title: 'Új klánrendszer bevezetése',
    content: 'Teljesen átdolgoztuk a klánrendszert, hogy gazdagabb és interaktívabb élményt nyújtson. Az új rendszer lehetővé teszi a klánoknak, hogy saját bázist építsenek, amelyet fejleszteni és testreszabni lehet. A klánbázisban különböző épületek állíthatók fel, mint például kovácsműhely, könyvtár vagy tréningtér, amelyek egyedi bónuszokat nyújtanak a klántagoknak. A klánok most már saját címert és zászlót tervezhetnek, és részt vehetnek a klánháborúkban más klánok ellen. A klánszintrendszer most 50 szintig bővült, minden szinttel új képességek és jutalmak nyílva. A klánvezetők részletes statisztikákat kapnak a tagok teljesítményéről, és új eszközökkel rendelkeznek a klán irányításához. A klánok közötti versenyek most havonta kerülnek megrendezésre, ahol a legjobb klánok exkluzív jutalmakat szerezhetnek.',
    category: 'game-updates',
    author: 'DevTeam',
    date: '2024-02-01',
    likes: 58,
    commentsCount: 4,
    likedBy: ['User1', 'User3', 'Guest']
  },
  {
    id: 19,
    title: 'Közösségi stream esemény márciusban',
    content: 'Március 15-én tartjuk a következő nagy közösségi stream eseményünket, ahol bemutatjuk a jövőbeli tartalmakat és közvetlenül válaszolunk a közösség kérdéseire. Az esemény 3 órás lesz, és több különleges vendég is csatlakozik hozzánk, köztük népszerű streamerek és a játék tervezői. A stream alatt exkluzív bepillantást nyerhettek a fejlesztői szobába, ahol éppen dolgoznak a következő nagy frissítésen. Különleges pillanat: élőben teszteljük az új raid boss-t a közösséggel! A stream alatt folyamatosan osztunk ki jutalmakat a nézőknek, köztük ritka felszereléseket, aranyat és akár életre szóló előfizetéseket is. A stream végén bejelentjük a következő nagy esemény dátumát és részleteit. Kövess minket Twitchen és YouTube-on, hogy ne maradj le semmiről!',
    category: 'events',
    author: 'CommunityManager',
    date: '2024-02-05',
    likes: 67,
    commentsCount: 3,
    likedBy: ['User2', 'Guest']
  },
  {
    id: 20,
    title: 'PvE raid útmutató: Az Ősi Sárkány',
    content: 'Részletes útmutató a legnehezebb PvE raid-hez, az "Ősi Sárkány"-hoz. Ez a raid 10 játékos számára készült, és 8 különböző boss-t tartalmaz, mindegyik egyedi mechanikával és kihívással. Az útmutató lépésről lépésre bemutatja minden boss taktikáját, a képességrotációkat és a pozicionálás fontosságát. Külön fejezetek szólnak a raid előkészületéről: mely felszerelésekre van szükség, milyen elixíreket és ételt érdemes használni, és hogyan kell optimalizálni a csapat összetételét. A cikk tartalmaz videó beágyazásokat minden boss fight-ról, amelyek a legjobb stratégiákat mutatják be. Megvizsgáljuk a leggyakoribb hibákat és azok kiküszöbölésének módját. Végül bemutatjuk a raid legjobb lootjait és a droprate statisztikákat, hogy pontosan tudjad, mire számíthatsz.',
    category: 'guides',
    author: 'RaidMaster',
    date: '2024-02-10',
    likes: 89,
    commentsCount: 6,
    likedBy: ['User1', 'User2', 'User3', 'Guest']
  },
  {
    id: 21,
    title: 'Mobil alkalmazás frissítése',
    content: 'Teljesen megújítottuk a játék mobil alkalmazását, hogy jobb felhasználói élményt nyújtson. Az új alkalmazás lehetővé teszi a karakterek kezelését, az aukciósház használatát és a klán chat követését mobilon is. Bevezettük a push notification rendszert, amely értesít, ha raid meghívót kapsz, aukción nyertél, vagy új üzeneted érkezett. Az alkalmazás most offline módban is működik, így bármikor ellenőrizheted a karaktered statisztikáit és a klán eseményeket. Új funkció: a "Játék Követő", amely valós időben mutatja a szerver állapotát és a játékosok számát. Az alkalmazás most teljesen ingyenes, és nem tartalmaz reklámokat. Letölthető Androidra és iOS-re is, és teljesen szinkronizálódik a PC-s fiókkal. A régi alkalmazás felhasználói automatikusan kapnak egy különleges háttérképet és 500 aranyat az új verzióra való átállásért.',
    category: 'news',
    author: 'DevTeam',
    date: '2024-02-15',
    likes: 45,
    commentsCount: 2,
    likedBy: ['User1']
  },
  {
    id: 22,
    title: 'Kreatív mód bevezetése',
    content: 'Bevezetjük a kreatív módot, ahol a játékosok korlátlan erőforrásokkal építhetnek és tervezhetnek. Ez a mód külön szervereken lesz elérhető, és lehetővé teszi a játékosoknak, hogy saját pályákat, akadálypályákat és épületeket hozzanak létre. A kreatív mód tartalmaz egy részletes építőeszköz-készletet, amely lehetővé teszi a blokkok pontos elhelyezését, színezését és forgatását. A játékosok megoszthatják alkotásaikat a közösséggel, és szavazhatnak mások alkotásaira. A legjobb alkotások bekerülnek a hivatalos játékba, mint például új PvP pályák vagy dekoratív elemek. A kreatív módban nincsenek ellenségek vagy halál, így teljesen stresszmentesen lehet építkezni. A mód ingyenesen elérhető minden játékos számára, és rendszeresen frissüljük új építőelemekkel és funkciókkal.',
    category: 'game-updates',
    author: 'CreativeTeam',
    date: '2024-02-20',
    likes: 72,
    commentsCount: 5,
    likedBy: ['Guest', 'User2', 'User3']
  },
  {
    id: 23,
    title: 'Húsvéti esemény részletei',
    content: 'Közeledik a húsvéti esemény, amely április 1-étől 15-éig tart. Az esemény során a játék világa tele lesz húsvéti tojásokkal, amelyek különleges jutalmakat rejtenek. A tojások megtalálhatóak rejtett helyeken, és mini-játékok megoldásával nyithatók ki. Az esemény fő küldetése a "Nagy Tojásvadászat", ahol 100 különböző tojást kell megtalálni, mindegyik egyedi kihívással. Az esemény központi NPC-je a "Húsvéti Nyuszi", aki napi küldetéseket ad és speciális húsvéti felszereléseket árul. Különleges jutalom: ha megtalálod az arany tojást, kapsz egy exkluzív húsvéti mount-ot. Az esemény alatt dupla XP és arany lesz minden PvE tevékenységre. Ne felejtsd el meglátogatni a húsvéti vásárt is, ahol különleges díszítő tárgyakat cserélhetsz a gyűjtött tojásokért.',
    category: 'events',
    author: 'EventManager',
    date: '2024-03-01',
    likes: 61,
    commentsCount: 4,
    likedBy: ['User1', 'Guest']
  },
  {
    id: 24,
    title: 'Új mentoráló rendszer',
    content: 'Bevezetjük az új mentoráló rendszert, amely segíti az új játékosokat és jutalmazza a tapasztalt játékosokat. A rendszerben a tapasztalt játékosok jelentkezhetnek mentorrá, és segíthetik az új játékosokat a játék alapjainak elsajátításában. A mentorok és tanítványok párokban dolgoznak, és együtt teljesítenek küldetéseket és kihívásokat. A mentorok jutalmakat kapnak a tanítványok fejlődéséért, köztük exkluzív címereket, felszereléseket és aranyat. A rendszer tartalmaz egy értékelési mechanizmust, ahol a tanítványok értékelhetik mentorjaikat, és a legjobb mentorok felkerülnek a "Top Mentorok" listájára. A mentorálás során speciális mentor chat csatornák is elérhetőek, ahol a mentorok megoszthatják tapasztalataikat és tanácsokat adhatnak. A rendszer célja a közösség erősítése és az új játékosok gyorsabb integrálása.',
    category: 'news',
    author: 'CommunityManager',
    date: '2024-03-05',
    likes: 53,
    commentsCount: 3,
    likedBy: ['User2', 'User3']
  },
  {
    id: 25,
    title: 'Optimalizálási útmutató PC-re',
    content: 'Részletes útmutató a játék optimalizálásához PC-n, hogy a legjobb teljesítményt és vizuális élményt kapd. A cikk bemutatja a grafikai beállítások minden egyes elemét, és magyarázza el, hogy melyik mennyire befolyásolja a FPS-t és a játékélményt. Megvizsgáljuk a különböző hardver konfigurációkat (CPU, GPU, RAM) és ajánlásokat adunk minden szinthez. Külön fejezet szenteljük a háttérfolyamatok optimalizálásának, a driver frissítések fontosságának és a hálózati beállítások finomhangolásának. A cikk tartalmaz teszt eredményeket különböző konfigurációkon, hogy pontosan lásd, mire számíthatsz a hardvereddel. Bemutatjuk a legjobb harmadik féltől származó szoftvereket a játék teljesítményének monitorozásához és javításához. Végül gyakori problémák megoldásait is megvizsgáljuk, mint a stuttering, a hirtelen FPS esés és a hosszú betöltési idők.',
    category: 'guides',
    author: 'TechExpert',
    date: '2024-03-08',
    likes: 47,
    commentsCount: 2,
    likedBy: ['User1', 'Guest']
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
      { id: 31, author: 'ConcernedPlayer', content: 'Remélem nem lesz hosszú leállás.', date: '2024-03-12', likes: 2, articleId: 17, likedBy: [] },

        // Cikk 18 - 4 komment
  { id: 32, author: 'ClanLeader', content: 'Végre! Már régóta vártuk az új klánrendszert.', date: '2024-02-02', likes: 8, articleId: 18, likedBy: ['User1'] },
  { id: 33, author: 'BuilderPro', content: 'A klánbázis építés fantasztikus ötlet!', date: '2024-02-03', likes: 5, articleId: 18, likedBy: [] },
  { id: 34, author: 'PVPFan', content: 'Remélem a klánháborúk kiegyensúlyozottak lesznek.', date: '2024-02-04', likes: 3, articleId: 18, likedBy: ['Guest'] },
  { id: 35, author: 'OldPlayer', content: 'Jó látni, hogy folyamatosan fejlesztik a játékot.', date: '2024-02-05', likes: 6, articleId: 18, likedBy: ['User3'] },
  
  // Cikk 19 - 3 komment
  { id: 36, author: 'StreamWatcher', content: 'Már várom a streamet, remélem sok új infót kapunk.', date: '2024-02-06', likes: 7, articleId: 19, likedBy: ['User2'] },
  { id: 37, author: 'QuestionMaster', content: 'Készítek egy listát a kérdéseimről!', date: '2024-02-07', likes: 4, articleId: 19, likedBy: [] },
  { id: 38, author: 'LuckyPlayer', content: 'Remélem nyerek valamit a jutalomhúzásban!', date: '2024-02-08', likes: 9, articleId: 19, likedBy: ['Guest'] },
  
  // Cikk 20 - 6 komment
  { id: 39, author: 'RaidGuru', content: 'Végre egy részletes útmutató ehhez a nehéz raidhez!', date: '2024-02-11', likes: 12, articleId: 20, likedBy: ['User1', 'User2'] },
  { id: 40, author: 'TankMain', content: 'A tank pozíciók nagyon jól le vannak írva.', date: '2024-02-12', likes: 8, articleId: 20, likedBy: [] },
  { id: 41, author: 'HealerPro', content: 'Köszönöm a healer tippeket, sokat segítettek.', date: '2024-02-13', likes: 6, articleId: 20, likedBy: ['User3'] },
  { id: 42, author: 'DPSMaster', content: 'A DPS rotációk pontosak és hatékonyak.', date: '2024-02-14', likes: 7, articleId: 20, likedBy: ['Guest'] },
  { id: 43, author: 'RaidNewbie', content: 'Első próbálkozásra sikerült a raid a csapattal!', date: '2024-02-15', likes: 10, articleId: 20, likedBy: ['User1'] },
  { id: 44, author: 'LootHunter', content: 'A droprate statisztikák aranyat érnek!', date: '2024-02-16', likes: 5, articleId: 20, likedBy: [] },
  
  // Cikk 21 - 2 komment
  { id: 45, author: 'MobileUser', content: 'Végre egy jó mobil alkalmazás!', date: '2024-02-16', likes: 9, articleId: 21, likedBy: ['User1'] },
  { id: 46, author: 'OnTheGo', content: 'Most már munka közben is követem a klánt!', date: '2024-02-17', likes: 4, articleId: 21, likedBy: [] },
  
  // Cikk 22 - 5 komment
  { id: 47, author: 'CreativeMind', content: 'Ez a legjobb dolog ami történt a játékkal!', date: '2024-02-21', likes: 15, articleId: 22, likedBy: ['Guest', 'User2'] },
  { id: 48, author: 'Architect', content: 'Már tervezem az első pályámat!', date: '2024-02-22', likes: 8, articleId: 22, likedBy: [] },
  { id: 49, author: 'MapMaker', content: 'Remélem az én pályám is bekerül a játékba.', date: '2024-02-23', likes: 6, articleId: 22, likedBy: ['User3'] },
  { id: 50, author: 'BuilderFan', content: 'Korlátlan erőforrások? Igen, kérem!', date: '2024-02-24', likes: 7, articleId: 22, likedBy: [] },
  { id: 51, author: 'CommunityCreator', content: 'Nagyszerű, hogy támogatják a kreatív közösséget.', date: '2024-02-25', likes: 9, articleId: 22, likedBy: ['User2'] },
  
  // Cikk 23 - 4 komment
  { id: 52, author: 'EventHunter', content: 'Már várom a húsvéti tojásvadászatot!', date: '2024-03-02', likes: 11, articleId: 23, likedBy: ['User1'] },
  { id: 53, author: 'EasterBunny', content: 'Remélem lesz nyuszi mount is!', date: '2024-03-03', likes: 6, articleId: 23, likedBy: [] },
  { id: 54, author: 'Collector', content: '100 tojás? Na ez lesz egy kihívás!', date: '2024-03-04', likes: 8, articleId: 23, likedBy: ['Guest'] },
  { id: 55, author: 'SpringPlayer', content: 'A tavaszi események mindig a legjobbak.', date: '2024-03-05', likes: 5, articleId: 23, likedBy: [] },
  
  // Cikk 24 - 3 komment
  { id: 56, author: 'VeteranPlayer', content: 'Már jelentkeztem mentorrá!', date: '2024-03-06', likes: 7, articleId: 24, likedBy: ['User2'] },
  { id: 57, author: 'Newcomer', content: 'Nagyon örülök, hogy lesz ilyen rendszer.', date: '2024-03-07', likes: 4, articleId: 24, likedBy: [] },
  { id: 58, author: 'Teacher', content: 'Jó ötlet a mentor értékelési rendszer.', date: '2024-03-08', likes: 6, articleId: 24, likedBy: ['User3'] },
  
  // Cikk 25 - 2 komment
  { id: 59, author: 'PCMaster', content: 'Végre egy komoly optimalizálási útmutató!', date: '2024-03-09', likes: 9, articleId: 25, likedBy: ['User1'] },
  { id: 60, author: 'TechGeek', content: 'A teszt eredmények nagyon hasznosak.', date: '2024-03-10', likes: 5, articleId: 25, likedBy: ['Guest'] }
];
}
}