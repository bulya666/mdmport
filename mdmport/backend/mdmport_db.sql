/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Táblák (változatlanul, de AUTO_INCREMENT igazítva ahol szükséges)

CREATE TABLE IF NOT EXISTS `a_users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `role` ENUM('user', 'admin', 'superadmin') NOT NULL DEFAULT 'user',
  `preferences` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (JSON_VALID(`preferences`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `b_games` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `tag` VARCHAR(100) NOT NULL,
  `price` VARCHAR(100) NOT NULL,
  `desc` VARCHAR(500) NOT NULL,
  `thumbnail` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `c_gamephotos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `gameid` INT(11) NOT NULL,
  `pic` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gameid` (`gameid`),
  CONSTRAINT `c_gamephotos_ibfk_1` FOREIGN KEY (`gameid`) REFERENCES `b_games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `d_ownedg` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `userid` INT(11) NOT NULL,
  `gameid` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_game` (`userid`, `gameid`),
  KEY `gameid` (`gameid`),
  CONSTRAINT `d_ownedg_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `a_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `d_ownedg_ibfk_2` FOREIGN KEY (`gameid`) REFERENCES `b_games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Felhasználók – superadmin kivéve, id-k újraszámozva 1-től (ha szükséges, de most megtartottam az eredetit)

INSERT IGNORE INTO `a_users` (`id`, `username`, `password`, `role`, `preferences`) VALUES
(2, 'Admin',   '$2b$12$LxKFdUGTxSax1OQRj8o/1uqx1CwfwSeEfsOQNk.OSVJmVAlVYJtWO', 'admin',   NULL),
(3, 'Bulya',   '$2b$12$yjlwvXFu.1SPhLLIUS7f.eLAKuVFqPk2lYw0samGc2qsw3Ih5z49G', 'user',    NULL),
(4, 'Szakacs', '$2b$12$wl0TyjcupGDoQlyt3JdgXuaNQxT48xQJUStQcE.SVyQyjQUEmI6Zy', 'user',    NULL),
(5, 'Marci',   '$2b$12$nevQMoKcFS9qM6UXj7oT8.rbD781b1AA8cboe5gzcJAVIHusgsYIi', 'user',    NULL),
(6, 'teszt1',  '$2b$12$wVt7MsL57.TTDVoV3QULOuV6ON9FY8PZqjhQ7ajx7LUlmVTGcOeDC', 'user',    NULL),
(7, 'Teszt12', '$2b$12$btgVoqqClaz4/ZfOBnS/yecBfWRwHx1Mo0VEdrAIULbauf9qu.9vu', 'user',    NULL);

-- Játékok (változatlan)

INSERT IGNORE INTO `b_games` (`id`, `title`, `tag`, `price`, `desc`, `thumbnail`) VALUES
(1,  'Counter-Strike 2',         'free top',    'INGYEN',  'Csapat alapú FPS versenyjáték.',                  'https://cdn.cloudflare.steamstatic.com/steam/apps/730/capsule_616x353.jpg'),
(2,  'Dota 2',                   'free',        'INGYEN',  'MOBA — taktika és együttműködés.',                'https://cdn.cloudflare.steamstatic.com/steam/apps/570/capsule_616x353.jpg'),
(3,  'Team Fortress 2',          'free',        'INGYEN',  'Színes, osztályalapú humoros FPS.',               'https://cdn.cloudflare.steamstatic.com/steam/apps/440/capsule_616x353.jpg'),
(4,  'World Of Tanks',           'free',        'INGYEN',  'Többjátékos online harckocsis csatajáték.',       'https://cdn.cloudflare.steamstatic.com/steam/apps/1407200/capsule_616x353.jpg'),
(5,  'Green Hell',               'all',         '$20.99',  'Nyílt világú túlélőszimulátor.',                  'https://cdn.steamstatic.com/steam/apps/815370/capsule_616x353.jpg'),
(6,  'Red Dead Redemption 2',    'all top',     '$59.99',  'Vadnyugati akció-kaland.',                        'https://cdn.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg'),
(7,  'Rust',                     'all top',     '$39.99',  'Online túlélőjáték.',                             'https://cdn.steamstatic.com/steam/apps/252490/capsule_616x353.jpg'),
(8,  'Sons Of The Forest',       'all top',     '$28.99',  'Nyílt világú túlélő-horror.',                     'https://cdn.steamstatic.com/steam/apps/1326470/capsule_616x353.jpg'),
(9,  'ARC Raiders',              'top',         '$39,99',  'Sci-fi többjátékos kaland.',                      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1808500/header.jpg'),
(10, 'Where Winds Meet',         'top free',    'INGYEN',  'Wuxia akció-RPG.',                                'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3564740/6d94b048393d5358690a04a7db99f2c9739c703c/header.jpg?t=1768270140'),
(11, 'The Witcher 3: Wild Hunt', 'top',         '$29,99',  'Nyílt világú fantasy RPG.',                       'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg'),
(12, 'Cyberpunk 2077',           'all',         '$82,78',  'Futurisztikus akció-RPG.',                        'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg');

-- Képek (változatlan)

INSERT IGNORE INTO `c_gamephotos` (`id`, `gameid`, `pic`) VALUES
(1,1,'cs2_1.png'),   (2,1,'cs2_2.png'),   (3,1,'cs2_3.png'),   (4,1,'cs2_4.png'),
(5,2,'dota2_1.jpg'), (6,2,'dota2_2.jpg'), (7,2,'dota2_3.jpg'), (8,2,'dota2_4.jpg'),
(9,3,'tf2_1.jpg'),   (10,3,'tf2_2.jpg'),  (11,3,'tf2_3.jpg'),  (12,3,'tf2_4.jpg'),
(13,4,'wot_1.jpg'),  (14,4,'wot_2.jpg'),  (15,4,'wot_3.jpg'),  (16,4,'wot_4.jpg'),
(17,5,'greenhell_1.jpg'), (18,5,'greenhell_2.jpg'), (19,5,'greenhell_3.jpg'), (20,5,'greenhell_4.jpg'),
(21,6,'rdr2_1.png'), (22,6,'rdr2_2.png'), (23,6,'rdr2_3.png'), (24,6,'rdr2_4.png'),
(25,7,'rust_1.jpg'), (26,7,'rust_2.jpg'), (27,7,'rust_3.jpg'), (28,7,'rust_4.jpg'),
(29,8,'sotf_1.jpg'), (30,8,'sotf_2.jpg'), (31,8,'sotf_3.jpg'), (32,8,'sotf_4.jpg'),
(33,9,'arc_1.jpg'),  (34,9,'arc_2.jpg'),  (35,9,'arc_3.jpg'),  (36,9,'arc_4.jpg'),
(37,10,'wwm_1.jpg'),(38,10,'wwm_2.jpg'),(39,10,'wwm_3.jpg'),(40,10,'wwm_4.jpg'),
(41,11,'tw3_1.jpg'),(42,11,'tw3_2.jpg'),(43,11,'tw3_3.jpg'),(44,11,'tw3_4.jpg'),
(45,12,'cyber_1.jpg'),(46,12,'cyber_2.jpg'),(47,12,'cyber_3.jpg'),(48,12,'cyber_4.jpeg');

-- Tulajdonlások – superadmin-hoz tartozó sorok kivéve

INSERT IGNORE INTO `d_ownedg` (`id`, `userid`, `gameid`) VALUES
(1,  2, 1),
(2,  2, 2),
(3,  2, 3),
(4,  2, 4),
(5,  2, 5),
(6,  2, 6),
(7,  2, 7),
(8,  2, 8),
(10, 3, 1),
(14, 3, 6),
(15, 3, 2),
(9,  3, 7),
(11, 3, 9),
(12, 3,11),
(13, 3,12),
(16, 2, 9),
(17, 7, 4),
(18, 7, 2),
(19, 7, 1),
(20, 7, 5),
(21, 7, 9);

-- Visszaállítás

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;