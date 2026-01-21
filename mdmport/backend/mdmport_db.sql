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
) ENGINE = InnoDB AUTO_INCREMENT = 51 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

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

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ownedg
# ------------------------------------------------------------

INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (1, 1, 1);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (2, 1, 2);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (3, 2, 2);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (4, 2, 3);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (5, 3, 1);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (6, 3, 3);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (7, 3, 5);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (8, 4, 4);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (9, 5, 2);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (10, 5, 5);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (11, 6, 1);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (12, 6, 4);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (13, 7, 3);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (14, 7, 4);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (15, 7, 5);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (16, 8, 2);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (17, 9, 1);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (18, 9, 2);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (19, 9, 3);
INSERT INTO
  `ownedg` (`id`, `userid`, `gameid`)
VALUES
  (20, 10, 5);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (1, 'alice', 'vN7$w9kQp2!x');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (2, 'bob', '8rT#z2LmY6@q');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (3, 'carol', 'Gq3!pV4sZx9*');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (4, 'dave', 'mP6^sW0bL1?r');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (5, 'eva', '4Jt!bK8nZp5$');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (6, 'frank', 'Q9#vH2xF7!l');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (7, 'gina', 'uR3!tY6pS8&');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (8, 'hank', 'B2^fM7zQ1#c');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (9, 'hank', 'B2^fM7zQ1#c');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (10, 'iris', 'pL5!nW9sH0%');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (11, 'jack', 'X7#qR2mT6!v');
INSERT INTO
  `users` (`id`, `username`, `password`)
VALUES
  (
    13,
    'Marci',
    '$2b$12$z2ZU.Gk1H7NWb5F0gdOAh.g5sp5oZL/ZjhNGCNCUqNSs3QHDPoEtK'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
