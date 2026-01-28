# MDM Port – Játékáruház Platform

Az **MDM Port** egy teljes stack webalkalmazás videojátékok értékesítésére és kezelésére, **Angular 18** alapú kliensoldali (frontend) alkalmazással és **Node.js / Express** alapú szerveroldali (backend) rendszerrel. A projekt célja egy modern, biztonságos és skálázható e-kereskedelmi platform megvalósítása, amely megfelel az oktatási és vizsgakövetelményeknek.

---

## Tartalomjegyzék

- [Funkciók](#funkciók)
- [Projekt architektúra](#projekt-architektúra)
- [Technológiai stack](#technológiai-stack)
- [Telepítés és beállítás](#telepítés-és-beállítás)
- [Adatbázis séma](#adatbázis-séma)
- [API végpontok](#api-végpontok)
- [Fejlesztési munkafolyamat](#fejlesztési-munkafolyamat)
- [Projekt struktúra](#projekt-struktúra)
- [Biztonsági megoldások](#biztonsági-megoldások)
- [Jövőbeli fejlesztések](#jövőbeli-fejlesztések)

---

## Funkciók

### Felhasználókezelés
- **Regisztráció és bejelentkezés**: Felhasználói fiók létrehozása felhasználónév és jelszó segítségével, bcrypt alapú jelszóhash-eléssel.
- **Session-alapú hitelesítés**: Biztonságos, szerveroldali session kezelés az `express-session` middleware alkalmazásával.
- **Fiókbeállítások kezelése**: Jelszó módosítása, felhasználói preferenciák szerkesztése, fiók törlése.
- **Felhasználói preferenciák**: A felhasználói felület és működés testreszabása (megjelenítési sűrűség, értesítések, adatvédelmi beállítások).

### Játék katalógus
- **Játéklista megjelenítése**: Játékok böngészése címmel, leírással, árral és bélyegképpel.
- **Többképes megjelenítés**: Egy játékhoz több kép társítható a részletes bemutatás érdekében.
- **Szűrés és keresés**: Játékok dinamikus szűrése és keresése kategóriák (tagek) alapján.

### Vásárlási és könyvtárfunkciók
- **Bevásárlókosár**: Játékok kosárba helyezése, eltávolítása és a kosár állapotának kezelése.
- **Vásárlási folyamat**: Játékok megvásárlása, majd automatikus hozzáadás a felhasználó játékkönyvtárához.
- **Játékkönyvtár kezelése**: Megvásárolt játékok megtekintése és a vásárlási előzmények nyomon követése.

### Közösségi és információs funkciók
- **Közösségi felület**: Felhasználók közötti interakciók és beszélgetések biztosítása.
- **Kapcsolat oldal**: Kapcsolatfelvételi űrlap e-mail értesítéssel (Nodemailer használatával).
- **Jogi oldalak**: Általános Szerződési Feltételek (ÁSZF) és Impresszum.
- **Beállítások kezelőfelület**: Központosított felhasználói beállításkezelés.

---

## Projekt architektúra

Az alkalmazás háromrétegű architektúrát követ:

1. **Frontend (Angular 18 SPA)** – Felhasználói felület és kliensoldali logika
2. **Backend (Express.js REST API)** – Üzleti logika és adatkezelés
3. **Adatbázis (MySQL)** – Tartós adatkezelés

```
Angular 18 SPA (localhost:4200)
 └─ REST API hívások
Express.js Backend (localhost:3000/api)
 └─ SQL lekérdezések
MySQL adatbázis (mdmport_db)
```

---

## Technológiai stack

### Frontend
- Angular 18
- TypeScript 5.5
- Angular Material
- RxJS

### Backend
- Node.js
- Express.js
- MySQL2 (Promise API)
- bcrypt
- express-session
- Nodemailer
- dotenv

### Adatbázis
- MySQL 8.0+

---

## Telepítés és beállítás

### Előfeltételek
- Node.js 18 vagy újabb
- MySQL 8.0 vagy újabb
- npm csomagkezelő
- Git verziókezelő

### Telepítési lépések

```bash
git clone https://github.com/bulya666/mdmport.git
cd mdmport/mdmport
npm start
```

### Környezeti változók

`.env` fájl a projekt gyökérkönyvtárában:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mdmport_db
SESSION_SECRET=pelda-titkos-kulcs
```

### Alkalmazás indítása

```bash
npm start
```

---

## Adatbázis séma

A rendszer relációs adatbázist használ, idegen kulcsos kapcsolatokkal és egyedi megszorításokkal.

### users tábla
```sql
CREATE TABLE a_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  preferences LONGTEXT
);
```

### games tábla
```sql
CREATE TABLE b_games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  tag VARCHAR(100),
  price VARCHAR(100),
  `desc` VARCHAR(500),
  thumbnail VARCHAR(500)
);
```

### gamephotos tábla
```sql
CREATE TABLE c_gamephotos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gameid INT NOT NULL,
  pic VARCHAR(255),
  FOREIGN KEY (gameid) REFERENCES games(id)
);
```

### ownedg tábla
```sql
CREATE TABLE d_ownedg (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL,
  gameid INT NOT NULL,
  UNIQUE KEY (userid, gameid),
  FOREIGN KEY (userid) REFERENCES users(id),
  FOREIGN KEY (gameid) REFERENCES games(id)
);
```

---

## API végpontok

### Hitelesítés
- `POST /api/login`
- `POST /api/register`
- `POST /api/logout`

### Játékok
- `GET /api/games`
- `GET /api/games/:id`
- `GET /api/gamephotos/:gameid`

### Felhasználói műveletek
- `PUT /api/users/:username/password`
- `DELETE /api/users/:username`
- `GET /api/users/:username/preferences`
- `PUT /api/users/:username/preferences`

---

## Biztonsági megoldások

- bcrypt alapú jelszóhash-elés (12 salt round)
- HTTP-only és SameSite session sütik
- Paraméterezett SQL lekérdezések
- CORS korlátozás

---

## Jövőbeli fejlesztések

- Online fizetési rendszer integrálása
- Értékelési és véleményezési rendszer
- Kívánságlista funkció
- Adminisztrációs felület
- Kétfaktoros hitelesítés

---

## Licenc

ISC License

---

## Szerzők

**bulya666**
**Szakacs-skibidi**
**MarcellJelencsity**

---

**Utolsó frissítés**: 2026. január

