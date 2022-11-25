DROP DATABASE raktar;
CREATE DATABASE IF NOT EXISTS raktar;
USE raktar;


CREATE TABLE IF NOT EXISTS raktar (
    raktar_id int NOT NULL AUTO_INCREMENT,
    kapacitas int NOT NULL,
    varos VARCHAR(100) NOT NULL,
    utca VARCHAR(100) NOT NULL,
    PRIMARY KEY(raktar_id)
);

CREATE TABLE IF NOT EXISTS felhasznalo (
    felhasznalo_id int NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    nev VARCHAR(100) NOT NULL,
    jelszo VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    raktar_id int,
    PRIMARY KEY(felhasznalo_id),
    FOREIGN KEY (raktar_id) REFERENCES raktar(raktar_id)
);

CREATE TABLE IF NOT EXISTS aru(
    aru_id int NOT NULL AUTO_INCREMENT,
    nev VARCHAR(100) NOT NULL,
    terfogat float NOT NULL,
    suly float NOT NULL,
    ar int NOT NULL,
    PRIMARY KEY(aru_id)
);

CREATE TABLE IF NOT EXISTS keszlet(
    rar_id int NOT NULL AUTO_INCREMENT,
    mennyiseg int NOT NULL,
    raktar_id int NOT NULL,
    aru_id int NOT NULL,
    PRIMARY KEY(rar_id),
    FOREIGN KEY (aru_id) REFERENCES aru(aru_id)
);

CREATE TABLE IF NOT EXISTS szallitmany(
    szallitmany_id int NOT NULL AUTO_INCREMENT,
    idopont VARCHAR(20)  NOT NULL,
    mennyiseg int NOT NULL,
    aruId int NOT NULL,
    raktarId int NOT NULL,
    PRIMARY KEY(szallitmany_id)
);

INSERT INTO `aru` VALUES (1,'Sajt',1,3,1999),(3,'Liszt',1,1,1000),(5,'Tej',1,1,899),(6,'Kenyér',1,2,1799),(7,'Víz',1,1,300),(8,'Sampon',2,1,3000);
INSERT INTO `raktar` VALUES (3,4330,'Békésszentandrás','Hír utca 5.'),(7,5500,'Szeged','Űr utca 45.'),(12,3487,'Szarvas','Hársfa utca'),(13,1407,'Csabacsűd','Fenyő utca 6.'),(14,2222,'Sződ','Galamb utca 42.'),(15,7845,'Budapest','Vár utca 1.'),(16,3776,'Győr','Mészáros Lőrinc utca 3.');
INSERT INTO `felhasznalo` VALUES (1,'admin','admin','$2a$10$G64GtJ5NnRQxZ8re4qJzvOo071oQmPr13tzTjbKwlnVuRkx.XzlFq','ADMIN',NULL),(13,'admin','Kata','$2a$10$Ga77TzoecpCHM4yb9CNIo.mMArhhCd88jhfIFQmwYKr/KFSQewxiS','ADMIN',3),(14,'bela@gmail.com','Nagy Béla','$2a$10$Ze6iE8srWh3H0zupnKtVSOj9M1TippZhNdaPhtYAJnwhOoAkmyhTy','USER',7),(15,'admin','admin2','$2a$10$cBnRssNgkUjk2n79kDXH9OMW19prV/oNtqFlgthhwqG2zrodDlraa','ADMIN',NULL),(16,'sztancsikqrwa@gmail.com','Nagy RÚDolf','$2a$10$KNeh.sY.eQPi6vQlGHtrTexe.wYtf4N8r1eC06YzTPLQf7lhrbd3G','USER',13),(17,'csengevok@citromail.hu','Szellő Csenge','$2a$10$MKDa1.9QvsDERNVC8pdrRO23Cx5wU/aX5YDXB28fsP8yzIj0sZ3ES','USER',14),(18,'lovemarcsello@freemail.hu','Mamóka Momoka','$2a$10$bVIhYgMNN5gFD3ecnkcZ.eWRM/fHDnRY2XmKncuq8P6MQtpPT/H2S','USER',7);
