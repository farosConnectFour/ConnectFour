DROP TABLE IF EXISTS users;

CREATE TABLE users (
	userId bigint not null,
    name varchar(25) not null unique,
    password varchar(25) not null,
    points int not null default 1000,
    PRIMARY KEY (userId)
);

INSERT INTO users (userId, name, password, points) values
(1,"Dimitri", "pass",1100),
(2,"Lieven", "pass",1200),
(3,"Kwinten", "pass",850),
(4,"Sara", "pass",975),
(5,"Peter", "pass",925),
(6,"Michael", "pass",950)