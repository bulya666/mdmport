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
) ENGINE = InnoDB AUTO_INCREMENT = 73 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 44 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
  (66, 38, 7);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (67, 38, 1);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (68, 38, 9);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (69, 38, 11);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (70, 38, 12);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (71, 38, 6);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (72, 38, 2);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (`id`, `username`, `password`, `preferences`)
VALUES
  (
    28,
    'Admin',
    '$2b$12$LxKFdUGTxSax1OQRj8o/1uqx1CwfwSeEfsOQNk.OSVJmVAlVYJtWO',
    NULL
  );
INSERT INTO
  `users` (`id`, `username`, `password`, `preferences`)
VALUES
  (
    38,
    'Bulya',
    '$2b$12$yjlwvXFu.1SPhLLIUS7f.eLAKuVFqPk2lYw0samGc2qsw3Ih5z49G',
    NULL
  );
INSERT INTO
  `users` (`id`, `username`, `password`, `preferences`)
VALUES
  (
    39,
    'Szakacs',
    '$2b$12$wl0TyjcupGDoQlyt3JdgXuaNQxT48xQJUStQcE.SVyQyjQUEmI6Zy',
    NULL
  );
INSERT INTO
  `users` (`id`, `username`, `password`, `preferences`)
VALUES
  (
    40,
    'Marci',
    '$2b$12$nevQMoKcFS9qM6UXj7oT8.rbD781b1AA8cboe5gzcJAVIHusgsYIi',
    NULL
  );
INSERT INTO
  `users` (`id`, `username`, `password`, `preferences`)
VALUES
  (
    42,
    'teszt1',
    '$2b$12$wVt7MsL57.TTDVoV3QULOuV6ON9FY8PZqjhQ7ajx7LUlmVTGcOeDC',
    NULL
  );
INSERT INTO
  `users` (`id`, `username`, `password`, `preferences`)
VALUES
  (
    43,
    'kurvanyad',
    '$2b$12$SjC1BJ2JrnotEtpn7hdJCu4xbvR4EyLs9JRLKHadI4/ClrlZxQdtG',
    NULL
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
