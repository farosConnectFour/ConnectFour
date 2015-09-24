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
    winner bigint,
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
("Dimitri", "pass",1000),
("Lieven", "pass",1000),
("Kwinten", "pass",1000),
("Sara", "pass",1000),
("Peter", "pass",1000),
("Michael", "pass",1000),
("Christophe", "pass",1000),
("Wim", "pass",1000),
("Johan", "pass",1000),
("Jessica", "pass",1000),
("Jeroen", "pass",1000),
("Sven", "pass",1000),
("Joris", "pass",1000),
("Tom", "pass",1000);

