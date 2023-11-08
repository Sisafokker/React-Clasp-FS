-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: react_clasp_fs
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `contactId` int NOT NULL AUTO_INCREMENT,
  `companyId` int DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `division` varchar(50) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` varchar(100) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`contactId`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `companies` (`companyId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,1,'Alejandro','García','555-0101','alejandro.garcia@hoakeen.com','Sales','Manager','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(2,1,'Carlos','Martínez','555-0102','carlos.martinez@hoakeen.com','Marketing','Analyst','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(3,2,'Luisa','Fernández','555-0201','luisa.fernandez@hoakeen.com','Human Resources','Director','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(4,2,'María','López','555-0202','maria.lopez@hoakeen.com','Operations','Coordinator','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(5,3,'Rafael','Hernández','555-0301','rafael.hernandez@hoakeen.com','Finance','Advisor','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(6,3,'Isabel','Alonso','555-0302','isabel.alonso@hoakeen.com','Research','Specialist','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(7,4,'Sofía','Ruiz','555-0401','sofia.ruiz@hoakeen.com','Engineering','Lead','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(8,4,'Fernando','Moreno','555-0402','fernando.moreno@hoakeen.com','Customer Support','Representative','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(9,5,'Antonio','Romero','555-0501','antonio.romero@hoakeen.com','IT','Technician','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(10,5,'Javier','Torres','555-0502','javier.torres@hoakeen.com','Logistics','Supervisor','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(11,1,'Elena','Sanz','555-0103','elena.sanz@hoakeen.com','Administration','Assistant','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(12,2,'Roberto','Díaz','555-0203','roberto.diaz@hoakeen.com','Procurement','Buyer','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(13,3,'Patricia','Navarro','555-0303','patricia.navarro@hoakeen.com','Quality Control','Inspector','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(14,4,'Lucía','Gil','555-0403','lucia.gil@hoakeen.com','Legal','Counsel','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com'),(15,5,'José','Vidal','555-0503','jose.vidal@hoakeen.com','Public Relations','Executive','2023-11-08 12:02:33','2023-11-08 12:02:33','dev@hoakeen.com','dev@hoakeen.com');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-08 18:49:05
