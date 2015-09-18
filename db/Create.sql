DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	userId bigint not null AUTO_INCREMENT,
    name varchar(25) not null unique,
    password varchar(25) not null,
    points int not null default 1000,
    PRIMARY KEY (userId)
);

CREATE TABLE games(
	gameId bigint not null AUTO_INCREMENT,
    player1 bigint not null,
    player2 bigint not null,
    rated tinyint not null,
    winner bigint not null,
    PRIMARY KEY(gameId),
    FOREIGN KEY (player1)
		REFERENCES users(userId)
		ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (player2)
		REFERENCES users(userId)
		ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (winner)
      REFERENCES users(userId)
      ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO users (name, password, points) values
("Dimitri", "pass",1350),
("Lieven", "pass",1300),
("Kwinten", "pass",1250),
("Sara", "pass",1200),
("Peter", "pass",1150),
("Michael", "pass",1100),
("Christophe", "pass",1050),
("Wim", "pass",1000),
("Johan", "pass",950),
("Jessica", "pass",900),
("Jeroen", "pass",850),
("Sven", "pass",800),
("Joris", "pass",750),
("Tom", "pass",700);

INSERT INTO games (player1, player2, rated,winner) values
(1,4,1,1),
(4,7,1,2),
(5,11,1,2),
(3,2,0,1),
(2,8,1,1),
(2,4,1,2),
(6,5,1,2),
(8,9,0,1),
(2,1,1,1),
(1,9,1,2);
