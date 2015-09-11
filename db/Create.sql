DROP TABLE IF EXISTS users;

CREATE TABLE users (
	userId bigint not null,
    name varchar(25) not null unique,
    password varchar(25) not null,
    points int not null default 1000,
    PRIMARY KEY (userId)
);

INSERT INTO users (userId, name, password, points) values
(1,"Dimitri", "pass",1350),
(2,"Lieven", "pass",1300),
(3,"Kwinten", "pass",1250),
(4,"Sara", "pass",1200),
(5,"Peter", "pass",1150),
(6,"Michael", "pass",1100),
(7,"Christophe", "pass",1050),
(8,"Wim", "pass",1000),
(9,"Johan", "pass",950),
(10,"Jessica", "pass",900),
(11,"Jeroen", "pass",850),
(12,"Sven", "pass",800),
(13,"Joris", "pass",750),
(14,"Tom", "pass",700)
