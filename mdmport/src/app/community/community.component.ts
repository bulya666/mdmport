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

interface Article {
  id: number;
  title: string;
  summary: string;
  fullText: string;
  likes: number;
  likesBy?: string[];
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
  {
    id: 1,
    title: 'Cyberpunk 2077 – Új frissítés elemzés',
    summary: 'A legújabb patch főbb változásai.',
    fullText:
      'A frissítés több rétegben nyúl bele a játékba: finomítja a fegyverek visszarúgását, javítja az AI reakcióidejét és stabilabbá teszi a fizikai motor működését. A ródlizó teljesítményesések nagy részét optimalizálták, különösen a nagy tömegjeleneteknél és járműves szakaszoknál. A patch kiemelten kezeli a hibás animációkat és a glitcheket, melyek eddig ritkán, de zavaró módon jelentek meg. Több küldetéslogikai probléma is megoldódott, így kevésbé fordul elő, hogy scriptelt események beragadnak vagy nem indultak el. A fejlesztés célja egy letisztultabb, folyamatosabb élmény biztosítása minden platformon.',
    likes: 67
  },
  {
    id: 2,
    title: 'Cyberpunk – Legjobb fegyver build-ek',
    summary: 'Top 5 erős játékstílus.',
    fullText:
      'A jelenlegi meta erősen támogatja azokat a build-eket, amelyek egyszerre fókuszálnak mozgékonyságra, kritikus sebzésre és energiaalapú fegyverekre. A revolver-alapú kritikus build különösen népszerű a magas burst sebzés miatt. A tech fegyverekkel játszók a töltéserő szabályozásával még páncélozott ellenfelek ellen is hatékonyak. A perkfa rugalmas, így egyes szinergiák — például a gyors kitérést növelő és a sebzést felerősítő passzívok kombinációja — rendkívüli hatékonysághoz vezethet. A kiegészítők és implantátumok finomhangolása tovább növeli a build-ek működőképességét.',
    likes: 34
  },
  {
    id: 3,
    title: 'Elden Ring – Meta fegyverzet',
    summary: 'A jelenlegi legerősebb fegyverek.',
    fullText:
      'A meta fegyverek elsősorban a magas sebzés/gyorsaság arány miatt erősek. A curved sword és a thrusting sword kategória továbbra is dominál a PvP-ben a gyors animációk és nehezen büntethető támadások miatt. PvE-ben a colossal sword-ok és a bleed scalinggel rendelkező fegyverek dominálnak. A weapon artok jelentősen árnyalják a fegyverek teljesítményét, sokszor egy jól megválasztott Ash of War képes egy középszerű fegyvert meta-szintre emelni. A játék változatossága miatt a meta gyakran inkább útmutatás, mintsem szigorú szabály.',
    likes: 23
  },
  {
    id: 4,
    title: 'Elden Ring – Bossharc tippek',
    summary: 'Hasznos túlélési stratégiák.',
    fullText:
      'A bossok ellen a türelem és az animációs felismerés dönt. A legtöbb főellenfél támadássorozata több lépcsőből áll, így érdemes megfigyelni a csapások közti mikro-szüneteket, mert ezek jelzik, mikor jön a befejező ütés. A könnyítéshez ajánlott a megfelelő poise érték elérése, amely megakadályozza, hogy kisebb találatok kizökkentsenek. A buffok — például tűz, szent vagy villámsebzés növelése — sok bossnál látványosan gyorsítják a harcot. A spirit ash társak pedig nemcsak sebzést visznek be, de elosztják az aggrót is, ami hatalmas előny a lassabb fegyverek használóinak.',
    likes: 15
  },
  {
    id: 5,
    title: 'Valorant – META ügynökök',
    summary: 'Az aktuálisan legerősebb karakterek.',
    fullText:
      'A meta ügynökök olyan képességkészlettel rendelkeznek, amelyek egyszerre biztosítanak területzárást, információszerzést és gyors rotációt. A kontrollerek közül azok az ügynökök kiemelkedők, akik többféle füstölési opcióval bírnak. A sentinel szerepkörben a csapdázós játékosok dominálnak, mert képesek a rotációkat lelassítani. A duelistáknál a gyors kitérés és a magas burst sebzés a kulcs. A meta általában mapfüggő, így egy ügynök erőssége környezettől függően változhat.',
    likes: 4
  },
  {
    id: 6,
    title: 'Valorant – Ranked fejlődés útmutató',
    summary: 'Hogyan juss fel magasabb rangba.',
    fullText:
      'A fejlődés egyik alapja a stabil célzás, rendszeres aim rutinokkal. A crosshair elhelyezése és a megfelelő mozgás-stop mechanika elsajátítása hatalmas különbséget jelent. A kommunikáció szintén kulcsszereplő: az egyértelmű, rövid hívások és a pozíciók korrekt átadása sok meccset eldönt. A map ismeret, a gyakori rotációs utak felismerése és a utility használat optimalizálása vezet a folyamatos fejlődéshez. A mentális állóképesség legalább ilyen fontos, mivel a ranglétra hosszú távú, hullámzó folyamat.',
    likes: 32
  },
  {
    id: 7,
    title: 'Fortnite – Chapter elemzés',
    summary: 'Új szezon változásai.',
    fullText:
      'Az új Chapter jelentős fegyveregyensúly-módosításokat hozott, új loot poolal és több új mozgásmechanikával. A map frissítései új hotspotokat hoztak létre, amelyek dinamikusabbá teszik az early game küzdelmeket. A mobilitási lehetőségek — kötelek, jump padek és parkour elemek — nagyobb hangsúlyt kaptak. A fegyverstatisztikák változásai miatt több régi favorit visszakerült a kompetitív körforgásba, miközben új fegyverek más stílusokat támogatnak.',
    likes: 51
  },
  {
    id: 8,
    title: 'Fortnite – Építés nélküli taktika',
    summary: 'Zero Build stratégiák.',
    fullText:
      'Az építés nélküli mód fókusza a fedezékek kreatív kihasználása és a pozícióharc. A mozgás gyorsabb, így a sprint, slide és mantle kombinációk teszik dominánssá az agresszív játékot. A középtávú fegyverek előnyben vannak, mivel a nyílt terepen kevesebb a menekülési lehetőség. A pálya statikus fedezékei körül zajlik a játék nagy része, így azok ismerete sokszor döntő előnyt ad.',
    likes: 41
  },
  {
    id: 9,
    title: 'GTA Online – Pénzszerzési módszerek',
    summary: 'A leghatékonyabb bevételi utak.',
    fullText:
      'A heistek továbbra is a legjobb bevételi források, különösen ha gyakorlott csapattal futnak. A járműexport jó alternatíva, mivel rendszeresen és kiszámíthatóan hoz bevételt. A napi feladatok és időszakos event bónuszok sokszor meglepően magas hozamot adnak. A bunker és a nightclub passzív bevétele stabil, de kezdeti befektetést igényel. Az ideális stratégia a passzív jövedelem és az aktív farmolási ciklus kombinációja.',
    likes: 17
  },
  {
    id: 10,
    title: 'GTA Online – Autók rangsora',
    summary: 'Legjobb versenyjárművek.',
    fullText:
      'A versenyek meta autói a gyorsulás, végsebesség és kezelhetőség arányán alapulnak. A super kategóriában több modell is a csúcson áll aerodinamikai stabilitása miatt. A sportkategóriában a kanyarstabilitás és a súlyelosztás sokszor fontosabb, mint a puszta gyorsulás. A tuners járművek külön meta szerint működnek, mivel a testre szabásuk komoly teljesítménynövelésre ad lehetőséget. A választás erősen versenytípus-függő.',
    likes: 54
  },
  {
    id: 11,
    title: 'CS2 – Fegyver meta',
    summary: 'Legjobb loadout jelenleg.',
    fullText:
      'A játék jelenlegi egyensúlya a kontrollált sorozatlövést és a rövid burstöket részesíti előnyben. Az AK és az M4 variánsai továbbra is a legerősebbek a megbízhatóságuk miatt. A SMG-k mobilitása miatt eco körökben kimagaslóan hasznosak. A fegyverválasztást nagyban befolyásolja a map, a csapat szerepkörei és a gazdasági helyzet. A utility hatékony használata sokszor többet ér, mint maga a fegyver.',
    likes: 16
  },
  {
    id: 12,
    title: 'CS2 – Map taktikák',
    summary: 'Mirage, Inferno, Nuke.',
    fullText:
      'A Mirage középső területének kontrollja döntő fontosságú, mivel megnyitja mindkét bombaterületet. Inferno szűk folyosói miatt az időzített utility a kulcs. Nuke esetében a vertikális szintek ismerete és a gyors rotáció teszi hatékonnyá a játékot. A stratégiák mindig a csapat szerepköreire épülnek, így az entry, support és lurker feladatkörök megfelelő elosztása elengedhetetlen.',
    likes: 73
  },
  {
    id: 13,
    title: 'Minecraft – Survival tippek',
    summary: 'Hogyan maradj életben.',
    fullText:
      'A korai játékban a biztonságos menedék kialakítása az elsődleges. A gyors szerszámfejlesztés és a korai vasbányászat megkönnyíti a túlélést. A mob farmok és automata rendszerek középtávon stabil erőforrást biztosítanak. A világ bejárása során a biomok ismerete segít a megfelelő loot megtalálásában. Az enchant rendszer elsajátítása a középső és késői játék egyik legfontosabb eleme.',
    likes: 3
  },
  {
    id: 14,
    title: 'Minecraft – Redstone alapok',
    summary: 'Kezdőknek is érthetően.',
    fullText:
      'A Redstone rendszer alapja a jel továbbítása és az egyszerű mechanizmusok összekötése. A gombok, karok és nyomólapok jelet generálnak, a repeaterek és comparátorok pedig módosítják azt. A legegyszerűbb kapuk — mint az AND, OR és NOT — már elegendőek kisebb automatizálásokhoz. A kreatív játék egyik csúcsa a mozgó szerkezetek, ajtók és farmok létrehozása.',
    likes: 72
  },
  {
    id: 15,
    title: 'League of Legends – Lane tippek',
    summary: 'Hogyan nyerj lanen.',
    fullText:
      'A lanelés során a hullámkezelés és az elsőkét perc dönt a legtöbbről. A minionok last hitelése és a megfelelő pozícionálás minimalizálja a felesleges sebzésbevételt. A trade ritmus megtanulása lehetővé teszi, hogy az ellenfél hibáit kihasználd. A junglerrel való kommunikáció nagyban növeli az előnyépítés esélyét. A helyes itemizáció alkalmazkodik az ellenfél sebzésforrásaihoz.',
    likes: 13
  },
  {
    id: 16,
    title: 'League – Jungle útvonalak',
    summary: 'A legerősebb clear-ek.',
    fullText:
      'A jungle útvonalak során a gyors első kör a cél, amely elegendő életerőt hagy a korai gankekhez. A meta útvonalak általában a buff–camp–camp háromszögre épülnek, de championfüggően nagy szórás lehet. A jungle kontroll a sárkányok és herald objektívek köré épül. A map figyelése és az ellenséges jungle mozgásának olvasása a magas szintű játék alapköve.',
    likes: 73
  },
  {
    id: 17,
    title: 'FIFA – Taktikai beállítások',
    summary: 'Meta formációk.',
    fullText:
      'A FIFA aktuális meta a kompakt középpályát és a gyors szélsőváltásokat részesíti előnyben. A pressing stílus agresszív, de nagy odafigyelést igényel. A védekezésben a stabil hátsó négyes megtartása a cél, miközben a középpálya szűkíti a passzsávokat. A formációk közül a 4-3-2-1 és a 4-2-3-1 a legnépszerűbb a balansz miatt.',
    likes: 56
  },
  {
    id: 18,
    title: 'FIFA – Olcsó OP játékosok',
    summary: 'A legjobb ár-érték arányú játékosok.',
    fullText:
      'Az olcsó, hatékony játékosok listája mindig változik, de a gyors, jó fizikumú és megfelelő passz-statisztikával rendelkező kártyák általában stabilak maradnak. A liga és a nemzet kombinációja fontos a hibrid csapatok építéséhez. Sok játékos olcsó áruk ellenére kiemelkedő meta-statisztikákkal bír, különösen a szélsők és a box-to-box középpályások szerepében.',
    likes: 25
  }
];

    featuredArticles: Article[] = [];
    modalOpen = false;
    selectedArticle: Article | null = null;

    constructor(private router: Router, private auth: AuthService) {}

    getRandomArticles(count: number): Article[] {
      return [...this.allArticles]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

    openModal(article: Article): void {
    this.selectedArticle = article;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedArticle = null;
  }

  likeArticle(article: Article) {
  if (!this.loggedUser) {
    this.router.navigate(['/login']);
    return;
  }

  const user = this.loggedUser;

  if (!article.likesBy) {
    article.likesBy = [];
  }

  const alreadyLiked = article.likesBy.includes(user);

  if (!alreadyLiked) {
    article.likes = (article.likes || 0) + 1;
    article.likesBy.push(user);
  } else {
    article.likes = Math.max((article.likes || 0) - 1, 0);
    article.likesBy = article.likesBy.filter(u => u !== user);
  }

  this.saveArticles();
}
  saveArticles() {
    localStorage.setItem("community_articles", JSON.stringify(this.allArticles));
  }

  ngOnInit() {
    this.loggedUser = localStorage.getItem('loggedUser');
    this.loadPosts();
    this.featuredArticles = this.getRandomArticles(6);
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

    const user = this.loggedUser;

    if (!post.likesBy) {
      post.likesBy = [];
    }

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
}