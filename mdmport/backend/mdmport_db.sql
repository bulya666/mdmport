/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: gamephotos
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `gamephotos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gameid` int(11) NOT NULL,
  `pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gameid` (`gameid`),
  CONSTRAINT `gamephotos_ibfk_1` FOREIGN KEY (`gameid`) REFERENCES `games` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 68 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: games
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `tag` varchar(100) NOT NULL,
  `price` varchar(100) NOT NULL,
  `desc` varchar(500) NOT NULL,
  `thumbnail` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ownedg
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ownedg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `gameid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ownedg_user_game` (`userid`, `gameid`),
  KEY `userid` (`userid`),
  KEY `gameid` (`gameid`),
  CONSTRAINT `ownedg_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  CONSTRAINT `ownedg_ibfk_2` FOREIGN KEY (`gameid`) REFERENCES `games` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 95 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: sessions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 47 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: gamephotos
# ------------------------------------------------------------

INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (19, 1, 'cs2_1.png'),(20, 1, 'cs2_2.png'),(21, 1, 'cs2_3.png'),(22, 1, 'cs2_4.png'),(23, 2, 'dota2_1.jpg'),(24, 2, 'dota2_2.jpg'),(25, 2, 'dota2_3.jpg'),(26, 2, 'dota2_4.jpg'),(27, 5, 'greenhell_1.jpg'),(28, 5, 'greenhell_2.jpg'),(29, 5, 'greenhell_3.jpg'),(30, 5, 'greenhell_4.jpg'),(31, 4, 'wot_1.jpg'),(32, 4, 'wot_2.jpg'),(33, 4, 'wot_3.jpg'),(34, 4, 'wot_4.jpg'),(35, 3, 'tf2_1.jpg'),(36, 3, 'tf2_2.jpg'),(37, 3, 'tf2_3.jpg'),(38, 3, 'tf2_4.jpg'),(39, 6, 'rdr2_1.png'),(40, 6, 'rdr2_2.png'),(41, 6, 'rdr2_3.png'),(42, 6, 'rdr2_4.png'),(43, 7, 'rust_1.jpg'),(44, 7, 'rust_2.jpg'),(45, 7, 'rust_3.jpg'),(46, 7, 'rust_4.jpg'),(47, 8, 'sotf_1.jpg'),(48, 8, 'sotf_2.jpg'),(49, 8, 'sotf_3.jpg'),(50, 8, 'sotf_4.jpg'),(51, 9, 'arc_1.jpg'),(52, 9, 'arc_2.jpg'),(53, 9, 'arc_3.jpg'),(54, 9, 'arc_4.jpg'),(55, 10, 'wwm_1.jpg'),(56, 10, 'wwm_2.jpg'),(57, 10, 'wwm_3.jpg'),(58, 10, 'wwm_4.jpg'),(59, 11, 'tw3_1.jpg'),(60, 11, 'tw3_2.jpg'),(61, 11, 'tw3_3.jpg'),(62, 11, 'tw3_4.jpg'),(64, 12, 'cyber_1.jpg'),(65, 12, 'cyber_2.jpg'),(66, 12, 'cyber_3.jpg'),(67, 12, 'cyber_4.jpeg');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: games
# ------------------------------------------------------------

INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    1,
    'Counter-Strike 2',
    'free top',
    'INGYEN',
    'Csapat alapú FPS versenyjáték.',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/730/capsule_616x353.jpg'
  ),(
    2,
    'Dota 2',
    'free',
    'INGYEN',
    'MOBA — taktika és együttműködés.',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/570/capsule_616x353.jpg'
  ),(
    3,
    'Team Fortress 2',
    'free',
    'INGYEN',
    'Színes, osztályalapú humoros FPS.',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/440/capsule_616x353.jpg'
  ),(
    4,
    'World Of Tanks',
    'free',
    'INGYEN',
    'Többjátékos online harckocsis csatajáték.',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/capsule_616x353.jpg'
  ),(
    5,
    'Green Hell',
    'all',
    '$20.99',
    'Nyílt világú túlélőszimulátor, Amazonasi esőerdőben kell túlélned.',
    'https://cdn.steamstatic.com/steam/apps/815370/capsule_616x353.jpg'
  ),(
    6,
    'Red Dead Redemption 2',
    'all top',
    '$59.99',
    'Akció-kalandjáték, amely a Vadnyugat hanyatlásának idején, 1899-ben játszódik.',
    'https://cdn.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg'
  ),(
    7,
    'Rust',
    'all top',
    '$39.99',
    'Online túlélőjáték, ahol egy szigeten ébredsz mindenféle felszerelés nélkül.',
    'https://cdn.steamstatic.com/steam/apps/252490/capsule_616x353.jpg'
  ),(
    8,
    'Sons Of The Forest',
    'all top',
    '$28.99',
    'Nyílt világú túlélő-horror játék, ahol egy titokzatos szigeten kell élelmet gyűjtened.',
    'https://cdn.steamstatic.com/steam/apps/1326470/capsule_616x353.jpg'
  ),(
    9,
    'ARC Raiders',
    'top',
    '$39,99',
    'Többjátékos mentőakció-kaland, amelynek helyszíne egy halálos jövőbeli Föld, amelyet egy ARC néven ismert rejtélyes, gépesített fenyegetés pusztít.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1808500/04baafaf64a5aa5f46ecda5d71889a4848dc0628/header.jpg?t=1764755475'
  ),(
    10,
    'Where Winds Meet',
    'top free',
    'INGYEN',
    'Wuxia-i, nyílt világú akció-kaland szerepjáték, amely a tizedik századi ókori Kínában játszódik. A játékosok egy fiatal kardmester szerepét ölthetik magukra, miközben útra kelnek, hogy feltárják saját identitásuk rejtélyeit.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3564740/6d94b048393d5358690a04a7db99f2c9739c703c/header.jpg?t=1763157550'
  ),(
    11,
    'The Witcher 3: Wild Hunt',
    'top',
    '$29,99',
    'Légy Ríviai Geralt, a witcher, a szörnyvadász. Vár a háború dúlta, szörnyek prédálta kontinens. Aktuális megbízásod? Megkeresi Cirit, a Prófécia Gyermekét, az élő fegyvert, aki megváltoztathatja a világ képét.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/ad9240e088f953a84aee814034c50a6a92bf4516/header.jpg?t=1761131270'
  ),(
    12,
    'Cyberpunk 2077',
    'all',
    '$82,78',
    'Nyílt világú akciókaland-RPG, amely a hatalom, a fényűzés és a testmódosítások lázában élő jövőbeli megapoliszban, Night Cityben játszódik.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/e9047d8ec47ae3d94bb8b464fb0fc9e9972b4ac7/header.jpg?t=1756209867'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ownedg
# ------------------------------------------------------------

INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (36, 28, 1),(37, 28, 2),(39, 28, 3),(38, 28, 4),(41, 28, 5),(42, 28, 6),(40, 28, 7),(43, 28, 8),(45, 30, 1),(46, 30, 2),(51, 30, 3),(52, 30, 4),(44, 30, 6),(53, 30, 8),(49, 30, 9),(48, 30, 10),(50, 30, 11),(47, 30, 12),(55, 33, 1),(61, 33, 3),(60, 33, 5),(56, 33, 7),(54, 33, 8),(57, 33, 9),(58, 33, 10),(59, 33, 12),(62, 34, 2),(63, 38, 1),(64, 38, 2),(65, 38, 12),(66, 39, 1),(67, 39, 11),(70, 43, 1),(71, 43, 2),(76, 43, 3),(72, 43, 4),(68, 43, 5),(69, 43, 6),(75, 43, 7),(74, 43, 9),(73, 43, 10),(78, 44, 1),(84, 44, 2),(86, 44, 4),(80, 44, 5),(77, 44, 6),(79, 44, 7),(81, 44, 8),(85, 44, 10),(82, 44, 11),(83, 44, 12),(88, 45, 2),(91, 45, 3),(89, 45, 7),(94, 45, 8),(90, 45, 9),(92, 45, 10),(87, 45, 11),(93, 45, 12);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: sessions
# ------------------------------------------------------------

INSERT INTO
  `sessions` (`session_id`, `expires`, `data`)
VALUES
  (
    'EDDnOynlRP2qJKTjkgRy4moiL1GPfPAk',
    1767610760,
    '{\"cookie\":{\"originalMaxAge\":3600000,\"expires\":\"2026-01-05T10:59:19.680Z\",\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":28,\"username\":\"Admin\"}'
  ),(
    'VQAFn3X8AeF8hQRIIkgQ5EXUa20avlXh',
    1767611856,
    '{\"cookie\":{\"originalMaxAge\":3600000,\"expires\":\"2026-01-05T11:17:35.892Z\",\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":46,\"username\":\"teszt123\"}'
  ),(
    'Y5E09gtXnveV-J8exEsttWXkpQUjJTW7',
    1767696997,
    '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-01-06T10:56:36.645Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":28,\"username\":\"Admin\",\"loggedInAt\":\"2026-01-05T10:56:36.899Z\"}'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    28,
    'Admin',
    '$2b$12$LxKFdUGTxSax1OQRj8o/1uqx1CwfwSeEfsOQNk.OSVJmVAlVYJtWO'
  ),(
    29,
    'Szakacs',
    '$2b$12$9C/g/bBswhWse8sQbqSUzeU7KZmDdGym0aUQCxMLK8Rfo8BX/MBsW'
  ),(
    30,
    'Bulya',
    '$2b$12$E.dJEjI.yQd3OHZTlPpZz.SAGCq99rj7lTDZ66OATMDSCCKig025W'
  ),(
    31,
    'teszt',
    '$2b$12$GEmJsPdCy0PGl4gq9RRRDuBOT2CWCoWokHaDf66jLK1q5IPCsvg0e'
  ),(
    32,
    'teszt1',
    '$2b$12$.iW6sUlCpOR1H7i.uCvc/eZC1Qewxwub8H0uRjxoPdIHxLjaDmgXi'
  ),(
    33,
    'teszt2',
    '$2b$12$fsl6I8U..FMkBRGYJvUVs.Uel4LztyXuYoKCLSR7qKaNtP4akr812'
  ),(
    34,
    'teszt3',
    '$2b$12$5W00TMmFORdU3hN5rffu8u1gKbdSSqflamIbtsko8OX4FD3diCqvq'
  ),(
    35,
    'teszt5',
    '$2b$12$0VouLhJ3IeOmNvOdJrIpguc0aPY/oyjAd3WjiT8/Ad4XFHiG.QQwy'
  ),(
    36,
    'teszt1',
    '$2b$12$x6CIPgjhp4THHLyZIuCLW.MkqXGyRVynw9uxOCKyWXFGuqoq8CoAC'
  ),(
    37,
    'teszt3',
    '$2b$12$uIMo/3MWS.jlS.bzMlExSe4JOEjp0283PdbQpHdJzVPzfDw3m4dXu'
  ),(
    38,
    'test',
    '$2b$12$JYU6.byCqRtaeZv.LJzJ9OaM6QQ.qnXX6ro9ysRTwHN4DSeN0gwIC'
  ),(
    39,
    'test1',
    '$2b$12$dj.gUMzDGT9AReMWKcAWJ.6pLOSd7Kka0pdwPlxNyh3qaIeTAaS8.'
  ),(
    40,
    'Helo',
    '$2b$12$CplJed8YqfQ.cu3dh2Z83ed7xVI0xtQl4.9d7M3hvjhTaFPBXGpLC'
  ),(
    41,
    'Helo1',
    '$2b$12$z01nif91hK3wfatEqAj.LeqB4yCsWvi75iG/E9rMqRuhw/OHE9APG'
  ),(
    42,
    'teszt',
    '$2b$12$Z//4HFFpyGeli7oIelqLhuROsn/9gfSSBR9pSqjx2JA0f4bB03qfK'
  ),(
    43,
    'Helo12',
    '$2b$12$YhAshX2QeH/EZvm1Hvy88OY/olhTv5azIr8y39CsJRvPz1HxNBUXW'
  ),(
    44,
    'Teszt100',
    '$2b$12$R0f0vICeMLlf9tIQ4D8cSu.X5qIUB6n/weNFN/CSXh51uMplrcO4O'
  ),(
    45,
    'asdasdasd',
    '$2b$12$Dc5gsvCXKrsCapTeE23OIeZJJzZH4aghuskfeHdiFpC.jcP/1Huie'
  ),(
    46,
    'teszt123',
    '$2b$12$zXEvxYEsPtvvzfsjGCGzIuyyyZZfiB399NLyadVZzyWNKcN2hgP..'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
