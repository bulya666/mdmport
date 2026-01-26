/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: a_users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `a_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('user', 'admin', 'superadmin') NOT NULL DEFAULT 'user',
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: b_games
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `b_games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `tag` varchar(100) NOT NULL,
  `price` varchar(100) NOT NULL,
  `desc` varchar(500) NOT NULL,
  `thumbnail` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: c_gamephotos
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `c_gamephotos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gameid` int(11) NOT NULL,
  `pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gameid` (`gameid`),
  CONSTRAINT `c_gamephotos_ibfk_1` FOREIGN KEY (`gameid`) REFERENCES `b_games` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 49 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: d_ownedg
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `d_ownedg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `gameid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_game` (`userid`, `gameid`),
  KEY `gameid` (`gameid`),
  CONSTRAINT `d_ownedg_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `a_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `d_ownedg_ibfk_2` FOREIGN KEY (`gameid`) REFERENCES `b_games` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: a_users
# ------------------------------------------------------------

INSERT INTO
  `a_users` (`id`, `username`, `password`, `role`, `preferences`)
VALUES
  (
    1,
    'superadmin',
    '$2b$12$REPLACE_WITH_BCRYPT_HASH',
    'superadmin',
    NULL
  );
INSERT INTO
  `a_users` (`id`, `username`, `password`, `role`, `preferences`)
VALUES
  (
    2,
    'Admin',
    '$2b$12$LxKFdUGTxSax1OQRj8o/1uqx1CwfwSeEfsOQNk.OSVJmVAlVYJtWO',
    'admin',
    NULL
  );
INSERT INTO
  `a_users` (`id`, `username`, `password`, `role`, `preferences`)
VALUES
  (
    3,
    'Bulya',
    '$2b$12$yjlwvXFu.1SPhLLIUS7f.eLAKuVFqPk2lYw0samGc2qsw3Ih5z49G',
    'user',
    NULL
  );
INSERT INTO
  `a_users` (`id`, `username`, `password`, `role`, `preferences`)
VALUES
  (
    4,
    'Szakacs',
    '$2b$12$wl0TyjcupGDoQlyt3JdgXuaNQxT48xQJUStQcE.SVyQyjQUEmI6Zy',
    'user',
    NULL
  );
INSERT INTO
  `a_users` (`id`, `username`, `password`, `role`, `preferences`)
VALUES
  (
    5,
    'Marci',
    '$2b$12$nevQMoKcFS9qM6UXj7oT8.rbD781b1AA8cboe5gzcJAVIHusgsYIi',
    'user',
    NULL
  );
INSERT INTO
  `a_users` (`id`, `username`, `password`, `role`, `preferences`)
VALUES
  (
    6,
    'teszt1',
    '$2b$12$wVt7MsL57.TTDVoV3QULOuV6ON9FY8PZqjhQ7ajx7LUlmVTGcOeDC',
    'user',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: b_games
# ------------------------------------------------------------

INSERT INTO
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
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
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
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
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
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
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
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
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    5,
    'Green Hell',
    'all',
    '$20.99',
    'Nyílt világú túlélőszimulátor.',
    'https://cdn.steamstatic.com/steam/apps/815370/capsule_616x353.jpg'
  );
INSERT INTO
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    6,
    'Red Dead Redemption 2',
    'all top',
    '$59.99',
    'Vadnyugati akció-kaland.',
    'https://cdn.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg'
  );
INSERT INTO
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    7,
    'Rust',
    'all top',
    '$39.99',
    'Online túlélőjáték.',
    'https://cdn.steamstatic.com/steam/apps/252490/capsule_616x353.jpg'
  );
INSERT INTO
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    8,
    'Sons Of The Forest',
    'all top',
    '$28.99',
    'Nyílt világú túlélő-horror.',
    'https://cdn.steamstatic.com/steam/apps/1326470/capsule_616x353.jpg'
  );
INSERT INTO
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    9,
    'ARC Raiders',
    'top',
    '$39,99',
    'Sci-fi többjátékos kaland.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1808500/header.jpg'
  );
INSERT INTO
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    10,
    'Where Winds Meet',
    'top free',
    'INGYEN',
    'Wuxia akció-RPG.',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3564740/6d94b048393d5358690a04a7db99f2c9739c703c/header.jpg?t=1768270140'
  );
INSERT INTO
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    11,
    'The Witcher 3: Wild Hunt',
    'top',
    '$29,99',
    'Nyílt világú fantasy RPG.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg'
  );
INSERT INTO
  `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`)
VALUES
  (
    12,
    'Cyberpunk 2077',
    'all',
    '$82,78',
    'Futurisztikus akció-RPG.',
    'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: c_gamephotos
# ------------------------------------------------------------

INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (1, 1, 'cs2_1.png');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (2, 1, 'cs2_2.png');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (3, 1, 'cs2_3.png');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (4, 1, 'cs2_4.png');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (5, 2, 'dota2_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (6, 2, 'dota2_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (7, 2, 'dota2_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (8, 2, 'dota2_4.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (9, 3, 'tf2_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (10, 3, 'tf2_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (11, 3, 'tf2_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (12, 3, 'tf2_4.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (13, 4, 'wot_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (14, 4, 'wot_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (15, 4, 'wot_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (16, 4, 'wot_4.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (17, 5, 'greenhell_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (18, 5, 'greenhell_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (19, 5, 'greenhell_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (20, 5, 'greenhell_4.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (21, 6, 'rdr2_1.png');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (22, 6, 'rdr2_2.png');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (23, 6, 'rdr2_3.png');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (24, 6, 'rdr2_4.png');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (25, 7, 'rust_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (26, 7, 'rust_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (27, 7, 'rust_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (28, 7, 'rust_4.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (29, 8, 'sotf_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (30, 8, 'sotf_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (31, 8, 'sotf_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (32, 8, 'sotf_4.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (33, 9, 'arc_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (34, 9, 'arc_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (35, 9, 'arc_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (36, 9, 'arc_4.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (37, 10, 'wwm_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (38, 10, 'wwm_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (39, 10, 'wwm_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (40, 10, 'wwm_4.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (41, 11, 'tw3_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (42, 11, 'tw3_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (43, 11, 'tw3_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (44, 11, 'tw3_4.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (45, 12, 'cyber_1.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (46, 12, 'cyber_2.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (47, 12, 'cyber_3.jpg');
INSERT INTO
  `c_gamephotos` (`id`, `gameid`, `pic`)
VALUES
  (48, 12, 'cyber_4.jpeg');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: d_ownedg
# ------------------------------------------------------------

INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (1, 2, 1);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (2, 2, 2);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (3, 2, 3);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (4, 2, 4);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (5, 2, 5);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (6, 2, 6);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (7, 2, 7);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (8, 2, 8);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (16, 2, 9);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (10, 3, 1);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (15, 3, 2);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (14, 3, 6);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (9, 3, 7);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (11, 3, 9);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (12, 3, 11);
INSERT INTO
  `d_ownedg` (`id`, `userid`, `gameid`)
VALUES
  (13, 3, 12);

-- -------------------------------------------------------------------------
-- Superadmin felhasználó és jogosultságok (ha még nem létezik)
-- -------------------------------------------------------------------------

-- Biztonság kedvéért töröljük, ha létezik (de csak ha biztosan nem akarod megtartani a régi beállításokat!)
-- DROP USER IF EXISTS 'superadmin'@'%';

-- Ha a felhasználó MÉG NEM létezik → létrehozzuk (jelszó: 123456 – cseréld le erős jelszóra!)
-- Ha már létezik → hagyd ki ezt a sort, vagy használd ALTER USER-t később


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
