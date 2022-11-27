-- MySQL dump 10.13  Distrib 8.0.31, for macos12.6 (arm64)
--
-- Host: localhost    Database: raktar
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `raktar`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `raktar` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `raktar`;

--
-- Table structure for table `aru`
--

DROP TABLE IF EXISTS `aru`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aru` (
  `aru_id` int NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) NOT NULL,
  `terfogat` float NOT NULL,
  `suly` float NOT NULL,
  `ar` int NOT NULL,
  PRIMARY KEY (`aru_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aru`
--

LOCK TABLES `aru` WRITE;
/*!40000 ALTER TABLE `aru` DISABLE KEYS */;
INSERT INTO `aru` VALUES (1,'Sajt',0.3,1,4000),(3,'Liszt',1,1,1000),(5,'Tej',1,1,899),(6,'Kenyér',1,2,1799),(7,'Víz',0.001,1,300),(8,'Sampon',0.0007,1,3000),(13,'Asztal',0.01,10,30000),(14,'Mosógép',1.25,120,180000),(15,'Szárító',1.3,100,175000),(16,'Szék',0.05,7,14899),(17,'Tükör',0.01,15,23890),(18,'Lámpa',0.016,2,6890),(19,'ak-47',0.0036,10.5,178000),(20,'Macbook m1 2021',0.001,1.41,480000);
/*!40000 ALTER TABLE `aru` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `felhasznalo`
--

DROP TABLE IF EXISTS `felhasznalo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `felhasznalo` (
  `felhasznalo_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `jelszo` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL,
  `raktar_id` int DEFAULT NULL,
  PRIMARY KEY (`felhasznalo_id`),
  KEY `raktar_id` (`raktar_id`),
  CONSTRAINT `felhasznalo_ibfk_1` FOREIGN KEY (`raktar_id`) REFERENCES `raktar` (`raktar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `felhasznalo`
--

LOCK TABLES `felhasznalo` WRITE;
/*!40000 ALTER TABLE `felhasznalo` DISABLE KEYS */;
INSERT INTO `felhasznalo` VALUES (1,'admin','admin','$2a$10$G64GtJ5NnRQxZ8re4qJzvOo071oQmPr13tzTjbKwlnVuRkx.XzlFq','ADMIN',NULL),(13,'admin','Kata','$2a$10$Ga77TzoecpCHM4yb9CNIo.mMArhhCd88jhfIFQmwYKr/KFSQewxiS','ADMIN',3),(14,'bela@gmail.com','Nagy Béla','$2a$10$Ze6iE8srWh3H0zupnKtVSOj9M1TippZhNdaPhtYAJnwhOoAkmyhTy','USER',7),(15,'admin2','admin2','$2a$10$cBnRssNgkUjk2n79kDXH9OMW19prV/oNtqFlgthhwqG2zrodDlraa','ADMIN',NULL),(16,'sztancsikqrwa@gmail.com','Nagy RÚDolf','$2a$10$KNeh.sY.eQPi6vQlGHtrTexe.wYtf4N8r1eC06YzTPLQf7lhrbd3G','USER',13),(17,'csengevok@citromail.hu','Szellő Csenge','$2a$10$MKDa1.9QvsDERNVC8pdrRO23Cx5wU/aX5YDXB28fsP8yzIj0sZ3ES','USER',14),(18,'lovemarcsello@freemail.hu','Mamóka Momoka','$2a$10$bVIhYgMNN5gFD3ecnkcZ.eWRM/fHDnRY2XmKncuq8P6MQtpPT/H2S','USER',7),(19,'cica@gmail.com','Ciccmiricc','$2a$10$LZNY2gvybkZkSfuIXjLLZef8omDsGWa1pgfBVJDclyT2i6o7jzDIi','USER',15),(20,'pelda@dolgozo.com','Pamacs','$2a$10$GgAwZEVYYPuFUq3CXjVBMOA26H10Ah/tHUNeopuRpHnkINJD34ZOm','USER',16);
/*!40000 ALTER TABLE `felhasznalo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keszlet`
--

DROP TABLE IF EXISTS `keszlet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keszlet` (
  `keszlet_id` int NOT NULL AUTO_INCREMENT,
  `mennyiseg` int NOT NULL,
  `raktar_id` int NOT NULL,
  `aru_id` int NOT NULL,
  PRIMARY KEY (`keszlet_id`),
  KEY `aru_id` (`aru_id`),
  KEY `raktar_id` (`raktar_id`),
  CONSTRAINT `keszlet_ibfk_1` FOREIGN KEY (`aru_id`) REFERENCES `aru` (`aru_id`),
  CONSTRAINT `keszlet_ibfk_2` FOREIGN KEY (`raktar_id`) REFERENCES `raktar` (`raktar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keszlet`
--

LOCK TABLES `keszlet` WRITE;
/*!40000 ALTER TABLE `keszlet` DISABLE KEYS */;
INSERT INTO `keszlet` VALUES (29,50,3,1),(30,1215,3,5),(34,600,16,1),(35,323,16,5),(36,3255,16,7),(37,800,3,20),(38,2222,3,15),(39,2121,7,16),(40,231,7,15),(41,999,7,18),(42,233232,7,7),(43,23232,7,17),(44,2332,12,18),(45,5765,12,6),(46,912,12,7),(47,345,12,16),(48,23,12,8),(49,345,12,13),(50,345,12,17),(51,258,13,13),(52,45,13,14),(53,54,13,17),(54,455454,14,19),(55,23432,15,1),(56,324,15,5),(57,324,15,3),(58,456,15,6),(59,567,15,7),(60,3456,15,8),(61,657,15,13),(62,346,15,16),(63,4564,15,19),(64,456456,15,20);
/*!40000 ALTER TABLE `keszlet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rakomany`
--

DROP TABLE IF EXISTS `rakomany`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rakomany` (
  `rakomany_id` int NOT NULL AUTO_INCREMENT,
  `szallitmany_id` int NOT NULL,
  `aru_id` int NOT NULL,
  `mennyiseg` int NOT NULL,
  PRIMARY KEY (`rakomany_id`),
  KEY `szallitmany_id` (`szallitmany_id`),
  KEY `aru_id` (`aru_id`),
  CONSTRAINT `rakomany_ibfk_1` FOREIGN KEY (`szallitmany_id`) REFERENCES `szallitmany` (`szallitmany_id`),
  CONSTRAINT `rakomany_ibfk_2` FOREIGN KEY (`aru_id`) REFERENCES `aru` (`aru_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rakomany`
--

LOCK TABLES `rakomany` WRITE;
/*!40000 ALTER TABLE `rakomany` DISABLE KEYS */;
INSERT INTO `rakomany` VALUES (19,21,1,4),(22,22,13,5),(23,22,14,1),(24,23,20,444),(25,24,19,999);
/*!40000 ALTER TABLE `rakomany` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raktar`
--

DROP TABLE IF EXISTS `raktar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raktar` (
  `raktar_id` int NOT NULL AUTO_INCREMENT,
  `kapacitas` int NOT NULL,
  `varos` varchar(100) NOT NULL,
  `utca` varchar(100) NOT NULL,
  PRIMARY KEY (`raktar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raktar`
--

LOCK TABLES `raktar` WRITE;
/*!40000 ALTER TABLE `raktar` DISABLE KEYS */;
INSERT INTO `raktar` VALUES (3,4330,'Békésszentandrás','Hír utca 5.'),(7,5500,'Szeged','Űr utca 45.'),(12,3487,'Szarvas','Hársfa utca'),(13,1408,'Csabacsűd','Fenyő utca 6.'),(14,2222,'Sződ','Galamb utca 42.'),(15,7845,'Budapest','Vár utca 1.'),(16,3776,'Győr','Mészáros Lőrinc utca 3.');
/*!40000 ALTER TABLE `raktar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `szallitmany`
--

DROP TABLE IF EXISTS `szallitmany`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `szallitmany` (
  `szallitmany_id` int NOT NULL AUTO_INCREMENT,
  `felhasznalo_id` int NOT NULL,
  `idopont` datetime NOT NULL,
  `honnan_raktar_id` int NOT NULL,
  `hova_raktar_id` int NOT NULL,
  PRIMARY KEY (`szallitmany_id`),
  KEY `felhasznalo_id` (`felhasznalo_id`),
  KEY `honnan_raktar_id` (`honnan_raktar_id`),
  KEY `hova_raktar_id` (`hova_raktar_id`),
  CONSTRAINT `szallitmany_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`),
  CONSTRAINT `szallitmany_ibfk_2` FOREIGN KEY (`honnan_raktar_id`) REFERENCES `raktar` (`raktar_id`),
  CONSTRAINT `szallitmany_ibfk_3` FOREIGN KEY (`hova_raktar_id`) REFERENCES `raktar` (`raktar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `szallitmany`
--

LOCK TABLES `szallitmany` WRITE;
/*!40000 ALTER TABLE `szallitmany` DISABLE KEYS */;
INSERT INTO `szallitmany` VALUES (21,1,'2022-11-27 14:22:11',3,15),(22,1,'2022-11-27 15:24:53',13,3),(23,1,'2022-11-27 15:25:08',15,3),(24,1,'2022-11-27 15:25:23',14,3);
/*!40000 ALTER TABLE `szallitmany` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-27 14:26:10
