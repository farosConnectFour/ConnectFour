DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id bigint not null,
    name varchar(25) not null unique,
    password varchar(25) not null,
    points int not null default 1000
);

INSERT INTO users (id, name, password, points) values
(1,"Dimitri", "pass",1100),
(1,"Lieven", "pass",1200),
(1,"Kwinten", "pass",850),
(1,"Sara", "pass",975),
(1,"Peter", "pass",925),
(1,"Michael", "pass",950)