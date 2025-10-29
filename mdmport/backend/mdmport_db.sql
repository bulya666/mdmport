-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Sze 13. 22:13
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `mdmport_db`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `gamephotos`
--

CREATE TABLE `gamephotos` (
  `id` int(11) NOT NULL,
  `gameid` int(11) NOT NULL,
  `pic` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `tag` varchar(100) NOT NULL,
  `price` varchar(100) NOT NULL,
  `desc` varchar(500) NOT NULL,
  `thumbnail` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `games`
--

INSERT INTO `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`) VALUES
(1, 'Counter-Strike: Global Offensive', 'free top', 'INGYEN', 'Csapat alapú FPS versenyjáték.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/capsule_616x353.jpg'),
(2, 'Dota 2', 'free', 'INGYEN', 'MOBA — taktika és együttműködés.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/capsule_616x353.jpg'),
(3, 'Team Fortress 2', 'free', 'INGYEN', 'Színes, osztályalapú humoros FPS.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/capsule_616x353.jpg'),
(4, 'World Of Tanks', 'free', 'INGYEN', 'Többjátékos online harckocsis csatajáték.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/capsule_616x353.jpg'),
(5, 'Green Hell', 'all', '$20.99', 'Nyílt világú túlélőszimulátor, Amazonasi esőerdőben kell túlélned.', 'https://cdn.steamstatic.com/steam/apps/815370/capsule_616x353.jpg'),
(6, 'Red Dead Redemption 2', 'all top', '$59.99', 'Akció-kalandjáték, amely a Vadnyugat hanyatlásának idején, 1899-ben játszódik.', 'https://cdn.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg'),
(7, 'Rust', 'all top', '$39.99', 'Online túlélőjáték, ahol egy szigeten ébredsz mindenféle felszerelés nélkül.', 'https://cdn.steamstatic.com/steam/apps/252490/capsule_616x353.jpg'),
(8, 'Sons Of The Forest', 'all top', '$28.99', 'Nyílt világú túlélő-horror játék, ahol egy titokzatos szigeten kell élelmet gyűjtened.', 'https://cdn.steamstatic.com/steam/apps/1326470/capsule_616x353.jpg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ownedg`
--

CREATE TABLE `ownedg` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `gameid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `ownedg`
--

INSERT INTO `ownedg` (`id`, `userid`, `gameid`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 2),
(4, 2, 3),
(5, 3, 1),
(6, 3, 3),
(7, 3, 5),
(8, 4, 4),
(9, 5, 2),
(10, 5, 5),
(11, 6, 1),
(12, 6, 4),
(13, 7, 3),
(14, 7, 4),
(15, 7, 5),
(16, 8, 2),
(17, 9, 1),
(18, 9, 2),
(19, 9, 3),
(20, 10, 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'alice', 'vN7$w9kQp2!x'),
(2, 'bob', '8rT#z2LmY6@q'),
(3, 'carol', 'Gq3!pV4sZx9*'),
(4, 'dave', 'mP6^sW0bL1?r'),
(5, 'eva', '4Jt!bK8nZp5$'),
(6, 'frank', 'Q9#vH2xF7!l'),
(7, 'gina', 'uR3!tY6pS8&'),
(8, 'hank', 'B2^fM7zQ1#c'),
(9, 'hank', 'B2^fM7zQ1#c'),
(10, 'iris', 'pL5!nW9sH0%'),
(11, 'jack', 'X7#qR2mT6!v');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `gamephotos`
--
ALTER TABLE `gamephotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gameid` (`gameid`);

--
-- A tábla indexei `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `ownedg`
--
ALTER TABLE `ownedg`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `gameid` (`gameid`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `gamephotos`
--
ALTER TABLE `gamephotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT a táblához `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `ownedg`
--
ALTER TABLE `ownedg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `gamephotos`
--
ALTER TABLE `gamephotos`
  ADD CONSTRAINT `gamephotos_ibfk_1` FOREIGN KEY (`gameid`) REFERENCES `games` (`id`);

--
-- Megkötések a táblához `ownedg`
--
ALTER TABLE `ownedg`
  ADD CONSTRAINT `ownedg_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `ownedg_ibfk_2` FOREIGN KEY (`gameid`) REFERENCES `games` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
