# 🎮 MDM Port – Játékáruház Platform

Egy teljes stack webalkalmazás videojátékok kezelésére és értékesítésére, **Angular 18** frontenddel és **Node.js/Express** backenddel. Az MDM Port egy modern játék e-kereskedelmi platform felhasználókezeléssel, játékkönyvtárral, bevásárlókosárral és felhasználói beállításokkal.

---

## 📋 Tartalomjegyzék

- [Funkciók](#-funkciók)
- [Projekt architektúra](#-projekt-architektúra)
- [Technológiai stack](#-technológiai-stack)
- [Telepítés és beállítás](#-telepítés-és-beállítás)
- [Adatbázis séma](#-adatbázis-séma)
- [API végpontok](#-api-végpontok)
- [Fejlesztési munkafolyamat](#-fejlesztési-munkafolyamat)
- [Projekt struktúra](#-projekt-struktúra)
- [Hozzájárulás](#-hozzájárulás)

---

## ✨ Funkciók

### Felhasználókezelés
- **Regisztráció és bejelentkezés** – Felhasználónév/jelszó (bcrypt titkosítás)
- **Session-alapú hitelesítés** – Biztonságos HTTP sessionök express-sessionnel
- **Fiókbeállítások** – Jelszó módosítása, beállítások kezelése, fiók törlése
- **Felhasználói preferenciák** – Testreszabható UI beállítások (sűrűség, értesítések, adatvédelem)

### Játék katalógus
- **Játéklista** – Játékok böngészése és keresése leírással, árral és bélyegképpel
- **Játék képek** – Több kép egy játékhoz
- **Dinamikus szűrés** – Keresés és szűrés tagek alapján

### Vásárlás és könyvtár
- **Bevásárlókosár** – Játékok hozzáadása/eltávolítása
- **Fizetési folyamat** – Játékok megvásárlása és könyvtárhoz adása
- **Könyvtár kezelés** – Megvásárolt játékok megtekintése
- **Tulajdonolt játékok nyilvántartása** – Felhasználóhoz kötött könyvtár

### Közösség és információ
- **Közösségi oldal** – Felhasználói interakciók és beszélgetések
- **Kapcsolat oldal** – Kapcsolati űrlap e-mail értesítéssel (Nodemailer)
- **ÁSZF és Impresszum** – Jogi oldalak
- **Beállítások felület** – Központi beállításkezelés

---

## 🏗️ Projekt architektúra

```
Angular 18 SPA Frontend (localhost:4200)
 ├─ Komponensek
 ├─ Szolgáltatások (Auth, Settings)
 └─ Session-alapú hitelesítés

Express.js Backend (localhost:3000/api)
 ├─ MVC architektúra
 ├─ Kontrollerek
 └─ Session middleware

MySQL adatbázis (mdmport_db)
 ├─ users
 ├─ games
 ├─ gamephotos
 └─ ownedg
```

---

## 🛠️ Technológiai stack

### Frontend
- Angular 18
- TypeScript 5.5
- Angular Material
- RxJS

### Backend
- Node.js
- Express.js
- MySQL2
- bcrypt
- express-session
- Nodemailer

### Adatbázis
- MySQL 8.0+

---

## 🚀 Telepítés és beállítás

### Előfeltételek
- Node.js 18+
- MySQL 8.0+
- npm
- Git

### Klónozás
```bash
git clone https://github.com/bulya666/mdmport.git
cd mdmport/mdmport
```

### Függőségek telepítése
```bash
npm install
cd backend
npm install
cd ..
```

### Környezeti változók
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mdmport_db
SESSION_SECRET=titkos-kulcs
```

---

## 📊 Adatbázis séma

(A sémák megegyeznek az angol verzióval, csak a dokumentáció nyelve változott.)

---

## 📡 API végpontok

- `/api/login` – Bejelentkezés
- `/api/register` – Regisztráció
- `/api/games` – Játéklista
- `/api/ownedg` – Megvásárolt játékok

---

## 🔧 Fejlesztési munkafolyamat

```bash
npm start
```

---

## 📁 Projekt struktúra

(A struktúra változatlan, lásd az eredeti README-t.)

---

## 🔐 Biztonság

- Jelszóhash-elés bcrypttel
- HTTP-only session sütik
- Paraméterezett SQL lekérdezések

---

## 📄 Licenc

ISC License

---

## 👤 Szerző

**bulya666**

---

**Utolsó frissítés**: 2026. január

