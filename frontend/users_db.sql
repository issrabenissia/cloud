-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: users_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_reservations`
--

DROP TABLE IF EXISTS `domain_reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `domain_name` varchar(255) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `hosting_offer_id` int(11) DEFAULT NULL,
  `technologies` text NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `project_type` enum('portfolio','ecommerce','blog','business','other') NOT NULL,
  `hosting_needed` tinyint(1) DEFAULT 0,
  `additional_services` text DEFAULT NULL,
  `preferred_contact_method` enum('email','phone','both') DEFAULT 'email',
  `project_deadline` date DEFAULT NULL,
  `budget_range` enum('0-100','100-500','500-1000','1000+') DEFAULT '0-100',
  `deployed_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `offer_id` (`offer_id`),
  KEY `hosting_offer_id` (`hosting_offer_id`),
  CONSTRAINT `domain_reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `domain_reservations_ibfk_2` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `domain_reservations_ibfk_3` FOREIGN KEY (`hosting_offer_id`) REFERENCES `offers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_reservations`
--

LOCK TABLES `domain_reservations` WRITE;
/*!40000 ALTER TABLE `domain_reservations` DISABLE KEYS */;
INSERT INTO `domain_reservations` VALUES (3,1,'mon-autre-site.fr',2,NULL,'HTML, CSS','accepted','2025-04-03 16:17:29','2025-04-09 22:01:46','blog',0,NULL,'phone','2025-07-01','0-100','http://localhost:5000/sites/mon-autre-site.fr'),(4,1,'encadrini',4,3,'HTML, CSS','accepted','2025-04-03 19:13:19','2025-04-09 19:30:10','ecommerce',1,'seo','phone','2000-04-15','100-500','http://localhost:5000/sites/encadrini'),(5,1,'haninee.fr',4,2,'HTML, CSS','accepted','2025-04-09 22:23:58','2025-04-09 22:27:28','business',1,'seo','both','2025-05-04','100-500','http://localhost:5000/sites/haninee.fr'),(6,1,'safa',5,2,'HTML, CSS','accepted','2025-04-10 19:47:55','2025-04-10 19:49:41','ecommerce',0,'seo','email','2025-05-11','500-1000','http://safa.localhost:5000');
/*!40000 ALTER TABLE `domain_reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `duration_months` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `features` text DEFAULT NULL,
  `domain_type` enum('com','org','net','fr','autre') DEFAULT 'com',
  `offer_type` enum('domain','hosting') DEFAULT 'domain',
  `storage_space` int(11) DEFAULT NULL,
  `bandwidth` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (2,'Hébergement Pro',12,25.00,'Hébergement pour projets professionnels','SSL gratuit, Support 24/7, 20 Go de stockage','org','hosting',20,200,'2025-04-03 14:55:59','2025-04-03 14:55:59'),(3,'Hébergement Premium',12,50.00,'Hébergement pour gros projets','SSL gratuit, Support 24/7, 50 Go de stockage, Sauvegarde quotidienne','fr','hosting',50,500,'2025-04-03 14:55:59','2025-04-03 14:55:59'),(4,'Offre Domaine Basique',12,15.00,'Domaine pour petits projets','Renouvellement gratuit 1 an','com','domain',NULL,NULL,'2025-04-03 16:47:15','2025-04-03 16:47:15'),(5,'Offre Domaine Pro',12,25.00,'Domaine pour projets professionnels','Renouvellement gratuit 2 ans','org','domain',NULL,NULL,'2025-04-03 16:47:15','2025-04-03 16:47:15');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_files`
--

DROP TABLE IF EXISTS `project_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `reservation_id` (`reservation_id`),
  CONSTRAINT `project_files_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `domain_reservations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_files`
--

LOCK TABLES `project_files` WRITE;
/*!40000 ALTER TABLE `project_files` DISABLE KEYS */;
INSERT INTO `project_files` VALUES (7,4,'C:\\Users\\eki\\Desktop\\Hostify\\hostify\\server\\uploads\\4\\index.html','index.html','2025-04-09 19:30:10'),(9,3,'C:\\Users\\eki\\Desktop\\Hostify\\hostify\\server\\uploads\\3\\index.html','index.html','2025-04-09 22:01:45'),(13,5,'C:\\Users\\eki\\Desktop\\Hostify\\hostify\\server\\uploads\\5\\index.html','index.html','2025-04-09 22:27:28'),(14,6,'C:\\Users\\eki\\Desktop\\Hostify\\hostify\\server\\uploads\\6\\index.html','index.html','2025-04-10 19:49:41');
/*!40000 ALTER TABLE `project_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation_technologies`
--

DROP TABLE IF EXISTS `reservation_technologies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservation_technologies` (
  `reservation_id` int(11) NOT NULL,
  `technology_id` int(11) NOT NULL,
  PRIMARY KEY (`reservation_id`,`technology_id`),
  KEY `technology_id` (`technology_id`),
  CONSTRAINT `reservation_technologies_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `domain_reservations` (`id`),
  CONSTRAINT `reservation_technologies_ibfk_2` FOREIGN KEY (`technology_id`) REFERENCES `technologies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_technologies`
--

LOCK TABLES `reservation_technologies` WRITE;
/*!40000 ALTER TABLE `reservation_technologies` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation_technologies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `technologies`
--

DROP TABLE IF EXISTS `technologies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `technologies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `technologies`
--

LOCK TABLES `technologies` WRITE;
/*!40000 ALTER TABLE `technologies` DISABLE KEYS */;
/*!40000 ALTER TABLE `technologies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('admin','client') DEFAULT 'client',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Benali','hanine','haninebenali554@gmail.com','$2b$10$Shl5x1nOhZ9dzVqhiHWVCubbctirmo1VBW6u474V3bkzQrrO92T9C','admin','2025-03-15 16:50:05'),(2,'Benali','hanine','haninebenali5@gmail.com','$2b$10$.Z57alLay0565WUfCN5GL.uTnw10pvwu3lti57BAZGfGbVKG3f3Y2','client','2025-03-15 16:51:26'),(4,'Benali','hanine','client@gmail.com','$2b$10$IxqEuD7bLxgL.LZxHwaRt.vvjw28Oafe3F/JUEl9NKgnFP8UysWh2','client','2025-04-10 15:26:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-12 22:42:03
