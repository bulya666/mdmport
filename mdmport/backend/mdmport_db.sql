-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Dec 04. 12:13
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
  `pic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `gamephotos`
--

INSERT INTO `gamephotos` (`id`, `gameid`, `pic`) VALUES
(19, 1, 'cs2_1.png'),
(20, 1, 'cs2_2.png'),
(21, 1, 'cs2_3.png'),
(22, 1, 'cs2_4.png'),
(23, 2, 'dota2_1.jpg'),
(24, 2, 'dota2_2.jpg'),
(25, 2, 'dota2_3.jpg'),
(26, 2, 'dota2_4.jpg'),
(27, 5, 'greenhell_1.jpg'),
(28, 5, 'greenhell_2.jpg'),
(29, 5, 'greenhell_3.jpg'),
(30, 5, 'greenhell_4.jpg'),
(31, 4, 'wot_1.jpg'),
(32, 4, 'wot_2.jpg'),
(33, 4, 'wot_3.jpg'),
(34, 4, 'wot_4.jpg'),
(35, 3, 'tf2_1.jpg'),
(36, 3, 'tf2_2.jpg'),
(37, 3, 'tf2_3.jpg'),
(38, 3, 'tf2_4.jpg'),
(39, 6, 'rdr2_1.png'),
(40, 6, 'rdr2_2.png'),
(41, 6, 'rdr2_3.png'),
(42, 6, 'rdr2_4.png'),
(43, 7, 'rust_1.jpg'),
(44, 7, 'rust_2.jpg'),
(45, 7, 'rust_3.jpg'),
(46, 7, 'rust_4.jpg'),
(47, 8, 'sotf_1.jpg'),
(48, 8, 'sotf_2.jpg'),
(49, 8, 'sotf_3.jpg'),
(50, 8, 'sotf_4.jpg'),
(51, 9, 'arc_1.jpg'),
(52, 9, 'arc_2.jpg'),
(53, 9, 'arc_3.jpg'),
(54, 9, 'arc_4.jpg'),
(55, 10, 'wwm_1.jpg'),
(56, 10, 'wwm_2.jpg'),
(57, 10, 'wwm_3.jpg'),
(58, 10, 'wwm_4.jpg'),
(59, 11, 'tw3_1.jpg'),
(60, 11, 'tw3_2.jpg'),
(61, 11, 'tw3_3.jpg'),
(62, 11, 'tw3_4.jpg'),
(64, 12, 'cyber_1.jpg'),
(65, 12, 'cyber_2.jpg'),
(66, 12, 'cyber_3.jpg'),
(67, 12, 'cyber_4.jpeg');

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
(1, 'Counter-Strike 2', 'free top', 'INGYEN', 'Csapat alapú FPS versenyjáték.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/capsule_616x353.jpg'),
(2, 'Dota 2', 'free', 'INGYEN', 'MOBA — taktika és együttműködés.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/capsule_616x353.jpg'),
(3, 'Team Fortress 2', 'free', 'INGYEN', 'Színes, osztályalapú humoros FPS.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/capsule_616x353.jpg'),
(4, 'World Of Tanks', 'free', 'INGYEN', 'Többjátékos online harckocsis csatajáték.', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/capsule_616x353.jpg'),
(5, 'Green Hell', 'all', '$20.99', 'Nyílt világú túlélőszimulátor, Amazonasi esőerdőben kell túlélned.', 'https://cdn.steamstatic.com/steam/apps/815370/capsule_616x353.jpg'),
(6, 'Red Dead Redemption 2', 'all top', '$59.99', 'Akció-kalandjáték, amely a Vadnyugat hanyatlásának idején, 1899-ben játszódik.', 'https://cdn.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg'),
(7, 'Rust', 'all top', '$39.99', 'Online túlélőjáték, ahol egy szigeten ébredsz mindenféle felszerelés nélkül.', 'https://cdn.steamstatic.com/steam/apps/252490/capsule_616x353.jpg'),
(8, 'Sons Of The Forest', 'all top', '$28.99', 'Nyílt világú túlélő-horror játék, ahol egy titokzatos szigeten kell élelmet gyűjtened.', 'https://cdn.steamstatic.com/steam/apps/1326470/capsule_616x353.jpg'),
(9, 'ARC Raiders', 'top', '$39,99', 'Többjátékos mentőakció-kaland, amelynek helyszíne egy halálos jövőbeli Föld, amelyet egy ARC néven ismert rejtélyes, gépesített fenyegetés pusztít.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1808500/04baafaf64a5aa5f46ecda5d71889a4848dc0628/header.jpg?t=1764755475'),
(10, 'Where Winds Meet', 'top free', 'INGYEN', 'Wuxia-i, nyílt világú akció-kaland szerepjáték, amely a tizedik századi ókori Kínában játszódik. A játékosok egy fiatal kardmester szerepét ölthetik magukra, miközben útra kelnek, hogy feltárják saját identitásuk rejtélyeit.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3564740/6d94b048393d5358690a04a7db99f2c9739c703c/header.jpg?t=1763157550'),
(11, 'The Witcher 3: Wild Hunt', 'top', '$29,99', 'Légy Ríviai Geralt, a witcher, a szörnyvadász. Vár a háború dúlta, szörnyek prédálta kontinens. Aktuális megbízásod? Megkeresi Cirit, a Prófécia Gyermekét, az élő fegyvert, aki megváltoztathatja a világ képét.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/ad9240e088f953a84aee814034c50a6a92bf4516/header.jpg?t=1761131270'),
(12, 'Cyberpunk 2077', 'all', '$82,78', 'Nyílt világú akciókaland-RPG, amely a hatalom, a fényűzés és a testmódosítások lázában élő jövőbeli megapoliszban, Night Cityben játszódik.', 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/e9047d8ec47ae3d94bb8b464fb0fc9e9972b4ac7/header.jpg?t=1756209867');

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
(36, 28, 1),
(37, 28, 2),
(38, 28, 4),
(39, 28, 3),
(40, 28, 7),
(41, 28, 5),
(42, 28, 6),
(43, 28, 8),
(44, 30, 6),
(45, 30, 1),
(46, 30, 2),
(47, 30, 12),
(48, 30, 10),
(49, 30, 9),
(50, 30, 11),
(51, 30, 3),
(52, 30, 4),
(53, 30, 8);

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
(28, 'Admin', '$2b$12$LxKFdUGTxSax1OQRj8o/1uqx1CwfwSeEfsOQNk.OSVJmVAlVYJtWO'),
(29, 'Szakacs', '$2b$12$9C/g/bBswhWse8sQbqSUzeU7KZmDdGym0aUQCxMLK8Rfo8BX/MBsW'),
(30, 'Bulya', '$2b$12$E.dJEjI.yQd3OHZTlPpZz.SAGCq99rj7lTDZ66OATMDSCCKig025W');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT a táblához `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `ownedg`
--
ALTER TABLE `ownedg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

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
