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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aru`
--

LOCK TABLES `aru` WRITE;
/*!40000 ALTER TABLE `aru` DISABLE KEYS */;
INSERT INTO `aru` VALUES (1,'Sajt',1,3,1999),(3,'Liszt',1,1,1000),(5,'Tej',1,1,899),(6,'Kenyér',1,2,1799),(7,'Víz',1,1,300),(8,'Sampon',2,1,3000);
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `felhasznalo`
--

LOCK TABLES `felhasznalo` WRITE;
/*!40000 ALTER TABLE `felhasznalo` DISABLE KEYS */;
INSERT INTO `felhasznalo` VALUES (1,'admin','admin','$2a$10$G64GtJ5NnRQxZ8re4qJzvOo071oQmPr13tzTjbKwlnVuRkx.XzlFq','ADMIN',NULL),(13,'admin','Kata','$2a$10$Ga77TzoecpCHM4yb9CNIo.mMArhhCd88jhfIFQmwYKr/KFSQewxiS','ADMIN',3),(14,'bela@gmail.com','Nagy Béla','$2a$10$Ze6iE8srWh3H0zupnKtVSOj9M1TippZhNdaPhtYAJnwhOoAkmyhTy','USER',7),(15,'admin','admin2','$2a$10$cBnRssNgkUjk2n79kDXH9OMW19prV/oNtqFlgthhwqG2zrodDlraa','ADMIN',NULL),(16,'sztancsikqrwa@gmail.com','Nagy RÚDolf','$2a$10$KNeh.sY.eQPi6vQlGHtrTexe.wYtf4N8r1eC06YzTPLQf7lhrbd3G','USER',13),(17,'csengevok@citromail.hu','Szellő Csenge','$2a$10$MKDa1.9QvsDERNVC8pdrRO23Cx5wU/aX5YDXB28fsP8yzIj0sZ3ES','USER',14),(18,'lovemarcsello@freemail.hu','Mamóka Momoka','$2a$10$bVIhYgMNN5gFD3ecnkcZ.eWRM/fHDnRY2XmKncuq8P6MQtpPT/H2S','USER',7);
/*!40000 ALTER TABLE `felhasznalo` ENABLE KEYS */;
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
INSERT INTO `raktar` VALUES (3,4330,'Békésszentandrás','Hír utca 5.'),(7,5500,'Szeged','Űr utca 45.'),(12,3487,'Szarvas','Hársfa utca'),(13,1407,'Csabacsűd','Fenyő utca 6.'),(14,2222,'Sződ','Galamb utca 42.'),(15,7845,'Budapest','Vár utca 1.'),(16,3776,'Győr','Mészáros Lőrinc utca 3.');
/*!40000 ALTER TABLE `raktar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rar`
--

DROP TABLE IF EXISTS `rar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rar` (
  `rar_id` int NOT NULL AUTO_INCREMENT,
  `mennyiseg` int NOT NULL,
  `raktar_id` int NOT NULL,
  `aru_id` int NOT NULL,
  PRIMARY KEY (`rar_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rar`
--

LOCK TABLES `rar` WRITE;
/*!40000 ALTER TABLE `rar` DISABLE KEYS */;
/*!40000 ALTER TABLE `rar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `szallitmany`
--

DROP TABLE IF EXISTS `szallitmany`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `szallitmany` (
  `szallitmany_id` int NOT NULL AUTO_INCREMENT,
  `idopont` varchar(20) NOT NULL,
  `mennyiseg` int NOT NULL,
  `aruId` int NOT NULL,
  `raktarId` int NOT NULL,
  PRIMARY KEY (`szallitmany_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `szallitmany`
--

LOCK TABLES `szallitmany` WRITE;
/*!40000 ALTER TABLE `szallitmany` DISABLE KEYS */;
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

-- Dump completed on 2022-11-24  1:04:48
