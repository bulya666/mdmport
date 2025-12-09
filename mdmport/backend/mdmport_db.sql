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
  KEY `userid` (`userid`),
  KEY `gameid` (`gameid`),
  CONSTRAINT `ownedg_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  CONSTRAINT `ownedg_ibfk_2` FOREIGN KEY (`gameid`) REFERENCES `games` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 65 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 37 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: gamephotos
# ------------------------------------------------------------

INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (19, 1, 'cs2_1.png');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (20, 1, 'cs2_2.png');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (21, 1, 'cs2_3.png');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (22, 1, 'cs2_4.png');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (23, 2, 'dota2_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (24, 2, 'dota2_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (25, 2, 'dota2_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (26, 2, 'dota2_4.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (27, 5, 'greenhell_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (28, 5, 'greenhell_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (29, 5, 'greenhell_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (30, 5, 'greenhell_4.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (31, 4, 'wot_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (32, 4, 'wot_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (33, 4, 'wot_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (34, 4, 'wot_4.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (35, 3, 'tf2_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (36, 3, 'tf2_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (37, 3, 'tf2_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (38, 3, 'tf2_4.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (39, 6, 'rdr2_1.png');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (40, 6, 'rdr2_2.png');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (41, 6, 'rdr2_3.png');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (42, 6, 'rdr2_4.png');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (43, 7, 'rust_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (44, 7, 'rust_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (45, 7, 'rust_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (46, 7, 'rust_4.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (47, 8, 'sotf_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (48, 8, 'sotf_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (49, 8, 'sotf_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (50, 8, 'sotf_4.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (51, 9, 'arc_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (52, 9, 'arc_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (53, 9, 'arc_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (54, 9, 'arc_4.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (55, 10, 'wwm_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (56, 10, 'wwm_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (57, 10, 'wwm_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (58, 10, 'wwm_4.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (59, 11, 'tw3_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (60, 11, 'tw3_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (61, 11, 'tw3_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (62, 11, 'tw3_4.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (64, 12, 'cyber_1.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (65, 12, 'cyber_2.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (66, 12, 'cyber_3.jpg');
INSERT INTO
  `gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (67, 12, 'cyber_4.jpeg');

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
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    2,
    'Dota 2',
    'free',
    'INGYEN',
    'MOBA — taktika és együttműködés.',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/570/capsule_616x353.jpg'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    3,
    'Team Fortress 2',
    'free',
    'INGYEN',
    'Színes, osztályalapú humoros FPS.',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/440/capsule_616x353.jpg'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    4,
    'World Of Tanks',
    'free',
    'INGYEN',
    'Többjátékos online harckocsis csatajáték.',
    'https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/capsule_616x353.jpg'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    5,
    'Green Hell',
    'all',
    '$20.99',
    'Nyílt világú túlélőszimulátor, Amazonasi esőerdőben kell túlélned.',
    'https://cdn.steamstatic.com/steam/apps/815370/capsule_616x353.jpg'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    6,
    'Red Dead Redemption 2',
    'all top',
    '$59.99',
    'Akció-kalandjáték, amely a Vadnyugat hanyatlásának idején, 1899-ben játszódik.',
    'https://cdn.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    7,
    'Rust',
    'all top',
    '$39.99',
    'Online túlélőjáték, ahol egy szigeten ébredsz mindenféle felszerelés nélkül.',
    'https://cdn.steamstatic.com/steam/apps/252490/capsule_616x353.jpg'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    8,
    'Sons Of The Forest',
    'all top',
    '$28.99',
    'Nyílt világú túlélő-horror játék, ahol egy titokzatos szigeten kell élelmet gyűjtened.',
    'https://cdn.steamstatic.com/steam/apps/1326470/capsule_616x353.jpg'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    9,
    'ARC Raiders',
    'top',
    '$39,99',
    'Többjátékos mentőakció-kaland, amelynek helyszíne egy halálos jövőbeli Föld, amelyet egy ARC néven ismert rejtélyes, gépesített fenyegetés pusztít.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1808500/04baafaf64a5aa5f46ecda5d71889a4848dc0628/header.jpg?t=1764755475'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    10,
    'Where Winds Meet',
    'top free',
    'INGYEN',
    'Wuxia-i, nyílt világú akció-kaland szerepjáték, amely a tizedik századi ókori Kínában játszódik. A játékosok egy fiatal kardmester szerepét ölthetik magukra, miközben útra kelnek, hogy feltárják saját identitásuk rejtélyeit.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3564740/6d94b048393d5358690a04a7db99f2c9739c703c/header.jpg?t=1763157550'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    11,
    'The Witcher 3: Wild Hunt',
    'top',
    '$29,99',
    'Légy Ríviai Geralt, a witcher, a szörnyvadász. Vár a háború dúlta, szörnyek prédálta kontinens. Aktuális megbízásod? Megkeresi Cirit, a Prófécia Gyermekét, az élő fegyvert, aki megváltoztathatja a világ képét.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/ad9240e088f953a84aee814034c50a6a92bf4516/header.jpg?t=1761131270'
  );
INSERT INTO
  `games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
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
  (36, 28, 1);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (37, 28, 2);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (38, 28, 4);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (39, 28, 3);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (40, 28, 7);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (41, 28, 5);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (42, 28, 6);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (43, 28, 8);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (44, 30, 6);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (45, 30, 1);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (46, 30, 2);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (47, 30, 12);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (48, 30, 10);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (49, 30, 9);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (50, 30, 11);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (51, 30, 3);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (52, 30, 4);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (53, 30, 8);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (54, 33, 8);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (55, 33, 1);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (56, 33, 7);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (57, 33, 9);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (58, 33, 10);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (59, 33, 12);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (60, 33, 5);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (61, 33, 3);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (62, 34, 2);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (63, 36, 11);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (64, 36, 4);

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
  );
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    29,
    'Szakacs',
    '$2b$12$9C/g/bBswhWse8sQbqSUzeU7KZmDdGym0aUQCxMLK8Rfo8BX/MBsW'
  );
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    30,
    'Bulya',
    '$2b$12$E.dJEjI.yQd3OHZTlPpZz.SAGCq99rj7lTDZ66OATMDSCCKig025W'
  );
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    31,
    'teszt',
    '$2b$12$GEmJsPdCy0PGl4gq9RRRDuBOT2CWCoWokHaDf66jLK1q5IPCsvg0e'
  );
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    32,
    'teszt1',
    '$2b$12$.iW6sUlCpOR1H7i.uCvc/eZC1Qewxwub8H0uRjxoPdIHxLjaDmgXi'
  );
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    33,
    'teszt2',
    '$2b$12$fsl6I8U..FMkBRGYJvUVs.Uel4LztyXuYoKCLSR7qKaNtP4akr812'
  );
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    34,
    'teszt3',
    '$2b$12$5W00TMmFORdU3hN5rffu8u1gKbdSSqflamIbtsko8OX4FD3diCqvq'
  );
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    35,
    'teszt5',
    '$2b$12$0VouLhJ3IeOmNvOdJrIpguc0aPY/oyjAd3WjiT8/Ad4XFHiG.QQwy'
  );
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    36,
    'teszt12',
    '$2b$12$SLIS6yqYoKWrXxoXtzmhx.B2CBEu6BeDOFtcUaAyBF80sSBVTNECm'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
