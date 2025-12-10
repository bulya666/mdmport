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

  allArticles = [
  {
    id: 1,
    title: "Cyberpunk 2077 – Új frissítés elemzés",
    summary: "A legújabb patch főbb változásai.",
    fullText:
      "A frissítés több rétegben nyúl bele a játékba: finomítja a fegyverek visszarúgását, kiegyensúlyozza a sebzéseloszlást, és új animációkat vezet be a közelharci fegyverekhez. A mesterséges intelligencia reakcióideje is javult, így az ellenfelek agresszívebben és kiszámíthatóbban mozognak, ami új kihívást jelent a tapasztalt játékosok számára is. A városban zajló random események sűrűbbek és változatosabbak lettek, amelyek friss élményt biztosítanak a szabad barangolás során.\n\n" +
      "A grafikus beállítások is fejlődtek: a ray tracing optimalizációjával a játék sokkal stabilabb teljesítményt nyújt, még magasabb vizuális részletesség mellett is. A járművek fizikája is átdolgozásra került, így most realisztikusabban reagálnak a terepre, az időjárásra és az ütközésekre. Emellett a felhasználói felület kisebb finomításokkal átláthatóbbá vált.\n\n" +
      "Az összkép alapján ez a patch kifejezetten a játékélmény javítására fókuszál. A fejlesztők egyértelműen arra törekedtek, hogy a játék hosszú távon is stabil, élvezetes és modern maradjon. A változtatások frissességet hoznak a játékmenetbe, miközben a technikai oldalon is kézzelfogható fejlődést kínálnak.",
    likes: 67,
    gameId: 12
  },
  {
    id: 2,
    title: "Cyberpunk 2077 – Legjobb fegyver build-ek",
    summary: "Top 5 erős játékstílus.",
    fullText:
      "A jelenlegi meta kiegyensúlyozott, mégis világosan kijelöl néhány domináns build-et. A kritikus találatokra építő build továbbra is az egyik legerősebb opció, különösen az új implantátumok és módosított kiberverek miatt. A gyors és precíz találatokra épülő játékstílus nemcsak hatékony, de rendkívül szórakoztató is, főleg ha a játékos jól időzíti a mozgást és a fedezék használatát.\n\n" +
      "A közelharci build-ek is megerősödtek: a katanák támadási sebessége nőtt, és a kombinált kiberverek most már jobban skálázódnak erőre és ügyességre. Ez a fajta játékstílus nagy jutalmat kínál azoknak, akik szeretik a dinamikus, agresszív megközelítést. Sok játékos számára ez lett az egyik legizgalmasabb mód a városi összecsapások megoldására.\n\n" +
      "A technikai és okosfegyverekre építő build-ek stabil, megbízható alternatívák. Ezekkel a játékos könnyedén leszedheti az ellenfeleket fedezék mögül, miközben minimalizálja a kockázatot. A frissítés után még jobban működnek a távolsági harcokban, így ideálisak azoknak, akik taktikus, óvatos játékmenetre vágynak.",
    likes: 34,
    gameId: 12
  },

  {
    id: 3,
    title: "Counter-Strike 2 – Meta fegyverzet",
    summary: "A jelenlegi legerősebb fegyverek.",
    fullText:
      "A jelenlegi meta egyértelműen az AK-47 és az M4 variánsok körül forog. Az AK-47 továbbra is a legjobb ár-érték arányú fegyver a játékban, különösen a magas fejsérülés miatt, amely a legtapasztaltabb játékosok kezében halálos eszközzé válik. Az M4A1-S kisebb tárkapacitása ellenére még mindig rendkívül hatékony a középtávú tűzharcokban.\n\n" +
      "A sniper kategóriában az AWP megkérdőjelezhetetlenül dominál, azonban a Scout is egyre több figyelmet kap a mobilitása és a gyors újratöltése miatt. Emellett a SMG-k is kiváló választások eco körökben, mivel jó mobilitást kínálnak és meglepően hatékonyak közelharcban.\n\n" +
      "Összességében a jelenlegi fegyvermeta arra ösztönzi a játékosokat, hogy helyzettől függően rugalmasan váltsanak fegyvert. Ez változatosabb stratégiákat és taktikai lehetőségeket nyit meg a kompetitív játékmódban.",
    likes: 23,
    gameId: 1
  },

  {
    id: 4,
    title: "Counter-Strike 2 – Stratégia tippek",
    summary: "Hasznos túlélési stratégiák.",
    fullText:
      "A túlélés kulcsa a jó pozicionálás és a folyamatos kommunikáció. A csapat együttműködése dönti el a körök többségét, különösen akkor, amikor szűk folyosókon vagy nyílt tereken kell áthaladni. A játékosoknak meg kell tanulniuk olvasni az ellenfél mozgását, és előre kell gondolkodniuk a gyakori taktikák kivédéséhez.\n\n" +
      "A gránátok használata továbbra is alapvető része a játéknak. Egy jól időzített smoke teljesen elvághatja az ellenfél látóterét, míg a megfelelő helyre dobott molotov területmegtagadáshoz vezethet. Ezek a segédeszközök lehetővé teszik, hogy a csapat magabiztosan irányítsa a pályát.\n\n" +
      "Emellett az egyéni fejlődés is fontos. A célzás gyakorlása, a reflexek fejlesztése és a gyors döntéshozatal mind hozzájárulnak a jobb teljesítményhez. Ha ez kombinálódik a csapat stratégiájával, a játékos könnyedén megfordíthat egy vesztes helyzetet is.",
    likes: 15,
    gameId: 1
  },

  {
    id: 5,
    title: "Dota 2 – META hősök",
    summary: "Az aktuálisan legerősebb karakterek.",
    fullText:
      "A jelenlegi patch erősen az agresszív, korai játékot domináló hősöket részesíti előnyben. Az olyan karakterek, mint Bristleback vagy Sven, most különösen erősek a gyors farmolási képességüknek és lane-dominanciájuknak köszönhetően. Ezek a hősök képesek azonnal nyomást helyezni az ellenfélre, és megteremteni a csapat számára a győzelem alapjait.\n\n" +
      "A támogatók közül olyan hősök brillíroznak, akik erős gyógyítással vagy kontrollal rendelkeznek, például Dazzle vagy Shadow Shaman. Ezek a karakterek kulcsfontosságúak a korai objektívharcokban, és hatékonyan védenek meg kulcsfontosságú carryket.\n\n" +
      "A momentum-alapú stratégiák erősek ebben a patchben: ha egy csapat már az elején előnyt szerez, könnyen dominálhatja a játékot egészen a végéig. A meta tehát gyors, agresszív, és jutalmazza a határozott játékmódot.",
    likes: 4,
    gameId: 2
  },

  {
    id: 6,
    title: "Dota 2 – Ranked fejlődés útmutató",
    summary: "Hogyan juss fel magasabb rangba.",
    fullText:
      "A fejlődés egyik alapja a szereppel való játszás, valamint annak megértése, hogyan járulhatunk hozzá a csapat sikeréhez minden szakaszban. A játékosoknak érdemes specializálódniuk egy vagy két szerepre, hogy következetesen jól teljesítsenek azokban. A stabil teljesítmény sokkal fontosabb, mint a hirtelen kiugró jó meccsek.\n\n" +
      "A visszajátszások elemzése szintén kulcsfontosságú. Ha a játékos képes felismerni saját hibáit, könnyebben fog fejlődni és gyorsabban alkalmazkodik a különböző helyzetekhez. Fontos megjegyezni, hogy a kommunikáció, a pingek és az egyszerű információmegosztás hatalmas előnyt jelent a csapat számára.\n\n" +
      "A megfelelő hősök kiválasztása is döntő lehet. A meta követése természetesen fontos, de még ennél is fontosabb, hogy a játékos olyan hősöket válasszon, amelyeket valóban jól ismer és kényelmesen játszik. Ez hosszú távon sokkal eredményesebb stratégiának bizonyul.",
    likes: 32,
    gameId: 2
  },

  {
    id: 7,
    title: "Team Fortress 2 – Class elemzés",
    summary: "Új frissítés változásai.",
    fullText:
      "Az új frissítés jelentős karakteregyensúly-módosításokat hozott. A Scout mozgási sebessége finomhangolásra került, hogy jobban illeszkedjen a közeli harcokra specializált játékmenethez. Eközben a Soldier rakétakárát csökkentették, hogy kiegyenlítsék a skill alapú mozgást és a területsebzést.\n\n" +
      "A Medic új gyógyítási mechanikája sokkal stratégiaibbá teszi a játékmenetet, mivel a csapat túlélési esélyei jobban függnek a pozicionálástól és a megfelelő kommunikációtól. A frissítés ezen kívül a Heavy-t is érintette, aki most hatékonyabban tudja tartani a vonalakat.\n\n" +
      "Mindezek a változtatások összességében frissebbé és kiegyensúlyozottabbá teszik a játékot. A játékosoknak érdemes újragondolniuk taktikáikat és új kombinációkat kipróbálniuk.",
    likes: 51,
    gameId: 3
  },

  {
    id: 8,
    title: "Team Fortress 2 – Kompetitív taktika",
    summary: "Versenyzés stratégiák.",
    fullText:
      "A kompetitív mód fókusza a csapatmunkán és a kommunikáción van. A csapatoknak összehangoltan kell mozogniuk, figyelniük a pozíciókra és a különböző osztályok képességeire. A pályák ismerete különösen fontos, mivel minden sarok és útvonal előnyt vagy hátrányt adhat.\n\n" +
      "A támadás és védekezés ritmusának megértése nélkülözhetetlen. Egy jól felépített push könnyen eldöntheti a meccset, míg egy rosszul időzített előretörés azonnali bukáshoz vezethet. A támogatók és a nehéz osztályok kulcsfontosságúak a csapat stabilitásához.\n\n" +
      "Az erőforrások – mint a health packek és lőszer – kontrollálása szintén kritikus tényező. Egy jól időzített visszavonulás vagy pozícióváltás gyakran többet ér, mint a vakmerő támadás.",
    likes: 41,
    gameId: 3
  },

  {
    id: 9,
    title: "World Of Tanks – Credit szerzési módszerek",
    summary: "A leghatékonyabb bevételi utak.",
    fullText:
      "A magas szintű csaták továbbra is a legjobb bevételi források, különösen prémium tankok használatával. A játékosoknak érdemes olyan járműveket választaniuk, amelyekkel stabilan tudnak sebzést okozni, mivel ez a legnagyobb tényező a kreditszerzésben. A túlélés szintén fontos, hiszen a javítási költségek könnyen elviszik a profitot.\n\n" +
      "A küldetések és napi bónuszok elvégzése nagy lökést adhat a bevételnek. Emellett az olyan módok, mint a Frontline vagy az Event csaták, általában jobb jutalmakat kínálnak, így érdemes ezeket kihasználni, amikor elérhetők.\n\n" +
      "A lőszer- és fogyócikk-használat optimalizálása jelentős különbséget jelenthet hosszú távon. A játékosoknak ajánlott figyelniük arra, mikor használnak prémium lőszert, hogy ne csökkentsék túlzottan a bevételüket.",
    likes: 17,
    gameId: 4
  },

  {
    id: 10,
    title: "World Of Tanks – Tankok rangsora",
    summary: "Legjobb harckocsik.",
    fullText:
      "A versenyek meta tankjai gyakran az egyensúly három fő elemére épülnek: tűzerő, páncélzat és mozgékonyság. A nehéz tankok jelenleg egy stabil középutat képviselnek, mivel képesek elnyelni a sebzést, miközben jelentős tűzerőt tartanak fenn. A közepes tankok ezzel szemben rugalmasabbak és jobban alkalmazkodnak a változó csatadöntésekhez.\n\n" +
      "A könnyű tankok a felderítésben és a csapat támogatásában játszanak kulcsszerepet. Bár kevésbé erősek tűzharcban, megfelelő kezekben az információs előny révén könnyen eldönthetik a csatát. A tankrombolók pedig hatalmas sebzést kínálnak, bár gyakran a mobilitásuk vagy a páncélzatuk rovására.\n\n" +
      "Összességében a rangsor azt mutatja, hogy nincs egyetlen „legjobb tank”, hanem különböző helyzetekre, stratégiai megközelítésekre optimalizált eszközök léteznek. A játékosnak érdemes kipróbálnia több típust, hogy megtalálja a saját játékstílusához illőt.",
    likes: 54,
    gameId: 4
  },

  {
    id: 11,
    title: "Green Hell – Túlélési tippek",
    summary: "Alapvető túlélési stratégiák.",
    fullText:
      "A dzsungelben való túlélés kulcsa az erőforrások okos felhasználása. A játékosnak folyamatosan figyelnie kell saját állapotát, mint a hidratáltság, energia és mentális stabilitás. A környezet rengeteg veszélyt rejt, ezért minden lépést meg kell fontolni, mielőtt mélyebbre merészkedünk.\n\n" +
      "A táborhely megfelelő kiválasztása különösen fontos. Érdemes olyan helyet választani, ahol könnyen hozzáférünk friss vízhez, és távol vagyunk a ragadozók által kedvelt útvonalaktól. A menedék építése nemcsak a biztonságot növeli, hanem lehetőséget ad a mentésre is.\n\n" +
      "A vadászat, halászat és gyógynövények gyűjtése mind hozzájárul a hosszú távú túléléshez. Érdemes megtanulni felismerni a mérgező növényeket és állatokat, amelyek komoly problémát okozhatnak, ha rosszul kezeljük őket.",
    likes: 28,
    gameId: 5
  },

  {
    id: 12,
    title: "Green Hell – Építési útmutató",
    summary: "Legjobb bázishelyek és építmények.",
    fullText:
      "A biztonságos bázisépítés kulcsfontosságú a hosszú távú túléléshez. Első lépésként érdemes felmérni a környéket, és olyan helyet találni, ahol a természetes akadályok – mint a sziklák vagy vízfolyások – védelmet nyújtanak. A helyszín közelsége a nyersanyagokhoz nagyban megkönnyíti a mindennapi túlélést.\n\n" +
      "A bázisépítés során figyelni kell a szerkezetek stabilitására és funkcionalitására. A tetők és falak megfelelő kialakítása megvéd az esőtől és a ragadozóktól, míg a tűzrakóhelyek optimális elhelyezése hosszú távú kényelmet biztosít. A megfelelően kialakított tárolók lehetővé teszik, hogy rendszerezetten tarthassuk az összegyűjtött alapanyagokat.\n\n" +
      "A fejlett építmények – mint a vízszűrők vagy állatcsapdák – még tovább növelik a túlélési esélyeket. Ezek segítségével hosszabb expedíciókra indulhatunk, és hatékonyabban hasznosíthatjuk a dzsungel erőforrásait.",
    likes: 19,
    gameId: 5
  },

  {
    id: 13,
    title: "Red Dead Redemption 2 – Kalandok útmutató",
    summary: "Legjobb mellékküldetések.",
    fullText:
      "A játék világa tele van rejtett történetekkel és különleges mellékküldetésekkel, amelyek mélyen gazdagítják a játék hangulatát. Ezek a melléktartalmak gyakran olyan karaktereket mutatnak be, akik emlékezetes párbeszédekkel és egyedi szituációkkal teszik élőbbé a vadnyugat világát. Sok küldetés jelentős jutalmakkal jár, amelyek a későbbi kalandok során kifejezetten hasznosak.\n\n" +
      "A felderítés során rengeteg titokra bukkanhatunk: elhagyott házak, rejtett barlangok és különféle gyűjthető tárgyak várják a kíváncsi játékosokat. Ezek a helyszínek gyakran apró történettöredékeket mesélnek el, amelyek kiegészítik a világ atmoszféráját.\n\n" +
      "A mellékküldetések teljesítése nemcsak jutalmakat ad, hanem hozzájárul Arthur fejlődéséhez és a játék narratívájának kibontakozásához. Érdemes minél több ilyen kalandba belevágni, hogy teljes képet kapjunk a vadnyugat életéről.",
    likes: 42,
    gameId: 6
  },

  {
    id: 14,
    title: "Red Dead Redemption 2 – Online mód tippek",
    summary: "Hogyan szerezz aranyat hatékonyan.",
    fullText:
      "A Red Dead Online rengeteg lehetőséget kínál arany és pénz szerzésére. A játékosok különböző szerepek között választhatnak, mint a fejvadász, kereskedő vagy kincskereső, amelyek mind sajátos játékmenetet és jutalmakat kínálnak. Érdemes olyan szerepet választani, amely illik a játékos stílusához.\n\n" +
      "A napi kihívások teljesítése az egyik legjobb módja a hatékony aranygyűjtésnek. Ezeket rendszeresen frissítik, és akár néhány perces feladatok is komoly bevételt hozhatnak. Emellett érdemes részt venni eventeken, amelyek időszakosan még jobb jutalmakat kínálnak.\n\n" +
      "A vadászat és a prémium alapanyagok eladása stabil bevételi forrást biztosít. A ritka állatok lenyúzása és az erősítők használata további hasznot hozhat, ami hosszú távon hatékonyabb fejlődést tesz lehetővé.",
    likes: 31,
    gameId: 6
  },

  {
    id: 15,
    title: "Rust – Bázisépítési stratégiák",
    summary: "Legbiztonságosabb bázisdesignok.",
    fullText:
      "A bázis tervezése kulcsfontosságú a rablók elleni védekezésben. A játék kezdetén érdemes gyorsan felhúzni egy kis, de stabil menedéket, amelyben elhelyezhetjük az alapvető gépeket és tárolókat. A helyszín kiválasztása döntő: minél eldugottabb a terület, annál kisebb az esélye annak, hogy mások rátalálnak.\n\n" +
      "A több falréteg és a honeycomb szerkezet továbbra is a legjobb védelmi módszer. Ezek megnövelik a támadók erőforrásigényét, így kevésbé éri meg megtámadni a bázist. A megfelelő ajtóelrendezés és a szűk folyosók kialakítása szintén fontos a belső védelem szempontjából.\n\n" +
      "A bázis folyamatos fejlesztése és karbantartása elengedhetetlen. A megfelelő toronyelhelyezés, csapdák és elektronikus rendszerek további védelmet nyújtanak, és hatékonyabban tartják távol a betolakodókat.",
    likes: 37,
    gameId: 7
  },

  {
    id: 16,
    title: "Rust – PVP taktikák",
    summary: "Harc tippek kezdőknek.",
    fullText:
      "A PVP harcokban a pozicionálás döntő fontosságú. A magaslatok használata és a fedezékek közti mozgás lehetővé teszi, hogy előnyhöz jussunk még a jobban felszerelt ellenfelekkel szemben is. Fontos megtanulni az ellenfél mozgásmintáit és előre látni, mikor készülnek támadásra.\n\n" +
      "A fegyverek visszarúgásának kezelése gyakorlást igényel, de egy idő után természetessé válik. A közelharci fegyverek is erősek lehetnek, ha ügyesen meglepjük az ellenfelet vagy közelharci terekben zajlik az összecsapás. A hangokra való figyelés – lépések, ajtók, fegyvertöltés – óriási előnyt biztosít.\n\n" +
      "A csapatmunka és kommunikáció hasonlóan fontos. A jól időzített támadások és a szerepek összehangolása könnyedén felülkerekedhet bármilyen védekező ellenfélen. Érdemes gyakran gyakorolni kisebb összecsapásokban, hogy fejlesszük reakcióidőnket és döntéshozatali képességeinket.",
    likes: 25,
    gameId: 7
  },

  {
    id: 17,
    title: "Sons Of The Forest – Túlélési útmutató",
    summary: "Alapvető túlélési technikák.",
    fullText:
      "A szigeten való túlélés megköveteli az alapvető erőforrások ismeretét és megfelelő kezelést. A játékosoknak folyamatosan figyelniük kell a hidratáltságra, az élelemre és a mentális állapotra, mivel ezek mind hatással vannak a karakter teljesítményére. A környezet tele van veszélyekkel, így óvatosság nélkül könnyen végzetes hibát követhetünk el.\n\n" +
      "A menedék felépítése az első napok prioritása. Egy jól megépített bázis nemcsak védi a játékost, hanem eszközöket is biztosít a további fejlődéshez. A megfelelő helyszín kiválasztása – vízforrás közelében, természetes védelemmel – jelentősen növeli a túlélési esélyeket.\n\n" +
      "A terület alapos felderítése lehetővé teszi a fontos nyersanyagok összegyűjtését, valamint a mutánsok viselkedésének megértését. A csapdák és védelmi szerkezetek használata elengedhetetlen a hosszú távú védelemhez.",
    likes: 33,
    gameId: 8
  },

  {
    id: 18,
    title: "Sons Of The Forest – Ellenfelek megismerése",
    summary: "Minden mutáns típusról.",
    fullText:
      "A sziget különböző mutánsokkal van tele, mindegyik egyedi támadási mintákkal és viselkedéssel. A játékosnak meg kell tanulnia felismerni, melyik fajta jelent komolyabb fenyegetést, és melyikkel lehet gyorsan végezni. A gyors és csendes ellenségek különösen veszélyesek lehetnek, ha váratlanul támadnak.\n\n" +
      "A nagyobb, lassabb mutánsok brutális sebzést okoznak, de könnyebben kijátszhatók körültekintő mozgással. Sokuk érzékeny bizonyos fegyverekre vagy csapdákra, így a környezet okos használata nagy előnyt jelenthet. A tűz például kiválóan működik a legtöbb ellenfél ellen.\n\n" +
      "A mutánsok viselkedésének tanulmányozása hosszú távon kritikus. Ha a játékos kiismeri, hogy melyik típus mikor támad, visszavonul vagy erősítést hív, jóval könnyebben tudja megtervezni a saját védelmét és támadásait.",
    likes: 21,
    gameId: 8
  },

  {
    id: 19,
    title: "ARC Raiders – Kezdő útmutató",
    summary: "Alapvető játékmechanikák.",
    fullText:
      "Az ARC Raiders egy kooperatív lövöldözős játék, ahol a csapatmunka, a gyors reakciók és a taktikus mozgás központi szerepet kapnak. A játékosnak meg kell tanulnia bánni a különféle fegyverekkel és kütyükkel, amelyek mind sajátos előnyökkel rendelkeznek különböző ellenfelek ellen. A pályák nyitottak és veszélyesek, ezért folyamatos mozgás szükséges.\n\n" +
      "A csapat kombinációja nagyban befolyásolja a túlélési esélyeket. Minden játékosnak érdemes szerepet vállalnia, legyen az támogató, mesterlövész vagy közvetlen harcos. A megfelelő kommunikáció elengedhetetlen, különösen akkor, amikor több hullámban érkeznek a gépi ellenfelek.\n\n" +
      "A lootolás és felszerelésfejlesztés segíti a játékos haladását. A jobb fegyverek, több lőszer és erősebb eszközök mind előnyt jelentenek a későbbi pályák keményebb kihívásaival szemben.",
    likes: 45,
    gameId: 9
  },

  {
    id: 20,
    title: "ARC Raiders – Felszerelés optimalizálás",
    summary: "Legjobb fegyverek és felszerelések.",
    fullText:
      "A megfelelő felszerelés választása jelentősen növeli a túlélési esélyeidet. A játék széles fegyverválasztékot kínál, mindegyik egyedi képességekkel, visszarúgással és tűzgyorsasággal. A játékosnak érdemes olyan felszerelést választania, amely illik a saját harcstílusához, legyen az gyors, támadó vagy precíz lövész.\n\n" +
      "A módosítható fegyveralkatrészek lehetővé teszik a felszerelés finomhangolását. Egy jól megválasztott irányzék vagy tárbővítés hatalmas előnyt adhat, különösen a nagyobb ellenfélhullámok során. A csapatok gyakran osztják egymás között a lootot, hogy mindenki a saját szerepéhez szükséges felszerelést kapja.\n\n" +
      "A defensive eszközök – mint a pajzsok, turretek és csapdák – különösen hasznosak, ha koordináltan használják őket. A stratégiai elhelyezés és a megfelelő időzítés gyakran többet ér, mint a puszta sebzés.",
    likes: 29,
    gameId: 9
  },

  {
    id: 21,
    title: "Where Winds Meet – Történet elemzés",
    summary: "A fő történet és mellékküldetések.",
    fullText:
      "A játék gazdag történelmi hátteret kínál a kínai dinasztiák korából, ahol a játékos egy fiatal kalandozóként keresi az igazságot a saját múltjával kapcsolatban. A fő történet tele van intrikákkal, árulással és váratlan fordulatokkal, amelyek szorosan szőtt narratívát eredményeznek. A karakterek jól kidolgozottak, és minden találkozás hozzájárul a világ mélyebb megértéséhez.\n\n" +
      "A mellékküldetések különleges minőségükkel tűnnek ki. Sokuk saját mini-történetet mesél el, amelyek gyakran érzelmileg megérintik a játékost, vagy új nézőpontokkal gazdagítják a világpolitikai helyzetet. Ezek a küldetések nem csupán kiegészítő tartalmak, hanem a világ fontos részei.\n\n" +
      "A különböző narratív rétegek jól illeszkednek egymáshoz, és együtt egy olyan élményt nyújtanak, amely hosszú időre leköti a játékost. A játék összességében mestermunka a történetmesélés terén.",
    likes: 38,
    gameId: 10
  },

  {
    id: 22,
    title: "Where Winds Meet – Harcrendszer útmutató",
    summary: "Harc technikák és kombók.",
    fullText:
      "A harcrendszer mélysége lehetővé teszi számos egyedi harcstílus kialakítását. A játékos különböző fegyvertípusok közül választhat, mindegyik saját animációkkal, sebzéseloszlással és mozgásmintákkal. A harcok intenzívek, és precíz időzítést igényelnek, mivel a védés és kitérés sokszor életeket menthet.\n\n" +
      "A kombórendszer rugalmas, és lehetővé teszi a különböző támadások láncolását, ami rendkívül látványos mozdulatokat eredményez. A játékos a gyakorlással egyre összetettebb technikákat sajátíthat el, amelyekkel még a legerősebb ellenfeleket is könnyűszerrel legyőzheti.\n\n" +
      "A harcrendszer tanulása ugyan igényel időt, de a jutalma hatalmas. A játékos minden fejlődési lépést érez, és hamar megérti, hogyan lehet elegánsan és hatékonyan mozogni a csatatéren.",
    likes: 26,
    gameId: 10
  },

  {
    id: 23,
    title: "The Witcher 3: Wild Hunt – Quaest útmutató",
    summary: "Legjobb fő és mellékküldetések.",
    fullText:
      "A Witcher 3 számos lenyűgöző questtel rendelkezik, mindegyik egyedi történettel és emlékezetes karakterekkel. A játékos könnyen elveszhet a világ részletességében, hiszen még a kisebb mellékküldetések is komoly döntéseket és morális dilemmákat tartalmaznak. A narratíva gazdagsága miatt minden küldetés hozzájárul a világépítéshez.\n\n" +
      "A fő questvonal a politikai machinációk és személyes drámák tökéletes elegyét kínálja. A karakterek közti kapcsolatok folyamatosan fejlődnek, ami dinamikus és élő érzetet ad a történetnek. A játékos döntései valós hatással vannak a világra, ami erős motivációt ad a felfedezésre.\n\n" +
      "A mellékküldetések sokszor ugyanolyan minőségűek, mint a fő történet, és rengeteg jutalmat kínálnak. Ezek megismerése nélkül a játékos aligha értheti meg teljesen a világ működését és mélységét.",
    likes: 52,
    gameId: 11
  },

  {
    id: 24,
    title: "The Witcher 3 – Build tervezés",
    summary: "Optimalizált játékstílusok.",
    fullText:
      "Geralt buildje testre szabható a különböző játékstílusokhoz, legyen szó gyors, agilis harcról vagy erőalapú, brutális támadásokról. Az újratervezett skillrendszer lehetővé teszi, hogy a játékos kísérletezzen és kedvére alakítson ki különböző kombinációkat, amelyek egyedivé teszik a játékélményt. A felszerelések sokfélesége tovább növeli a testreszabhatóságot.\n\n" +
      "A mutagének és potionök megfelelő használata hatalmas előnyt adhat a harcban. A játékosnak érdemes odafigyelnie arra, hogy mely mutagén-synergiákat használja, mivel ezek akár megduplázhatják a sebzést vagy jelentősen növelhetik a túlélést. A bájitalok időzítése szintén kritikus.\n\n" +
      "A különböző build-ek más és más kihívásokra készítik fel Geraltot. A játékos kiválaszthatja, hogy a gyors, precíz stílust részesíti előnyben, vagy inkább a nyers erőre épít és kemény páncéllal indul csatába. A lehetőségek száma szinte végtelen.",
    likes: 44,
    gameId: 11
  }
];
  featuredArticles: Article[] = [];
  articleColumns: Article[][] = [];
  modalOpen = false;
  selectedArticle: Article | null = null;
  selectedArticleImages: string[] = [];
  selectedArticlePrice: string = "Ingyen";

  constructor(
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
  ) {}

 getRandomArticles(count: number): Article[] {
    return [...this.allArticles]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

    splitIntoColumns(articles: Article[], columns: number, perColumn: number): Article[][] {
    const result: Article[][] = [];
    let index = 0;

    for (let i = 0; i < columns; i++) {
      result.push(articles.slice(index, index + perColumn));
      index += perColumn;
    }

    return result;
  }

  async openModal(article: Article) {
    this.selectedArticle = article;
    this.modalOpen = true;
    document.body.classList.add("modal-open");
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
