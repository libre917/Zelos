-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: zelos
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `apontamentos`
--

DROP TABLE IF EXISTS `apontamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apontamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chamado_id` int DEFAULT NULL,
  `tecnico_id` int DEFAULT NULL,
  `descricao` varchar(250) DEFAULT NULL,
  `comeco` timestamp NOT NULL,
  `fim` timestamp NULL DEFAULT NULL,
  `duracao` int GENERATED ALWAYS AS (timestampdiff(SECOND,`comeco`,`fim`)) STORED,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chamado_id` (`chamado_id`),
  KEY `tecnico_id` (`tecnico_id`),
  KEY `idx_apontamentos_comeco_fim` (`comeco`,`fim`),
  CONSTRAINT `apontamentos_ibfk_1` FOREIGN KEY (`chamado_id`) REFERENCES `chamados` (`id`),
  CONSTRAINT `apontamentos_ibfk_2` FOREIGN KEY (`tecnico_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apontamentos`
--

LOCK TABLES `apontamentos` WRITE;
/*!40000 ALTER TABLE `apontamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `apontamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chamados`
--

DROP TABLE IF EXISTS `chamados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chamados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` varchar(250) DEFAULT NULL,
  `tipo_id` int DEFAULT NULL,
  `tecnico_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `status` enum('pendente','em andamento','concluÃ­do') DEFAULT 'pendente',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tipo_id` (`tipo_id`),
  KEY `tecnico_id` (`tecnico_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_chamados_status` (`status`),
  CONSTRAINT `chamados_ibfk_1` FOREIGN KEY (`tipo_id`) REFERENCES `pool` (`id`),
  CONSTRAINT `chamados_ibfk_2` FOREIGN KEY (`tecnico_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `chamados_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chamados`
--

LOCK TABLES `chamados` WRITE;
/*!40000 ALTER TABLE `chamados` DISABLE KEYS */;
INSERT INTO `chamados` VALUES (1,'1234567890','Aluno arrombado enchendo o saco',3,NULL,1,'pendente','2025-08-30 18:14:16','2025-08-30 18:14:16'),(2,'1234567898','Aluno arrombado quebrou computador',1,NULL,1,'pendente','2025-08-30 18:14:58','2025-08-30 18:14:58'),(3,'123456787','Aluno arrombado quebrou computador de novo',1,NULL,1,'pendente','2025-08-30 18:15:57','2025-08-30 18:15:57'),(4,'1234567122','Aluno arrombado desinstalou a System32',2,NULL,1,'pendente','2025-08-30 18:16:15','2025-08-30 18:16:15');
/*!40000 ALTER TABLE `chamados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pool`
--

DROP TABLE IF EXISTS `pool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pool` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(50) NOT NULL,
  `descricao` varchar(250) DEFAULT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `pool_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `pool_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pool`
--

LOCK TABLES `pool` WRITE;
/*!40000 ALTER TABLE `pool` DISABLE KEYS */;
INSERT INTO `pool` VALUES (1,'Hardware','problemas peças e periféricos computadores','ativo','2025-08-30 18:10:34','2025-08-30 18:10:34',1,NULL),(2,'Software','Problemas com programas do sistema','ativo','2025-08-30 18:10:47','2025-08-30 18:10:47',1,NULL),(3,'Coordenação','Problemas relacionados ao alunos da instituição','ativo','2025-08-30 18:11:08','2025-08-30 18:11:08',1,NULL);
/*!40000 ALTER TABLE `pool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pool_tecnico`
--

DROP TABLE IF EXISTS `pool_tecnico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pool_tecnico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pool` int DEFAULT NULL,
  `id_tecnico` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_pool` (`id_pool`),
  KEY `id_tecnico` (`id_tecnico`),
  CONSTRAINT `pool_tecnico_ibfk_1` FOREIGN KEY (`id_pool`) REFERENCES `pool` (`id`),
  CONSTRAINT `pool_tecnico_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pool_tecnico`
--

LOCK TABLES `pool_tecnico` WRITE;
/*!40000 ALTER TABLE `pool_tecnico` DISABLE KEYS */;
INSERT INTO `pool_tecnico` VALUES (1,2,3),(2,1,4),(3,3,5);
/*!40000 ALTER TABLE `pool_tecnico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `funcao` enum('usuario','tecnico','admin') DEFAULT 'usuario',
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_usuarios_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','$2b$10$m23Q9vakefDZd5c9lzfGzu58dHMXqRkykM/uuLVDIaee4icSixCJi','admin@email.com','admin','ativo','2025-08-30 18:09:27','2025-08-30 18:09:27'),(2,'Rodrigo','$2b$10$JGDsmAFw6uZJuCpIrWmmgOoqMI4yYGIxM1vZDLMs75bTTcWlwaLxa','rodrigo@email.com','usuario','ativo','2025-08-30 18:11:29','2025-08-30 18:11:29'),(3,'Vinicius','$2b$10$hD.yy2KwPvL4zy81jmy1eukwJD7c7sJYC/dbH6HinczdN6BqB3XdO','vini@email.com','tecnico','ativo','2025-08-30 18:12:14','2025-08-30 18:12:14'),(4,'Cleisson','$2b$10$k4DAbZghL2hZkDmjvSyHFu9hldz2blARTUNnqmov1scaVV8Vng75G','cle@email.com','tecnico','ativo','2025-08-30 18:12:41','2025-08-30 18:12:41'),(5,'Arioci','$2b$10$C1RfzJUUPZY1Gw6SgYgs2.sLQ77BbXew2JTov66crNqsQVi2.hDWG','ari@email.com','tecnico','ativo','2025-08-30 18:12:58','2025-08-30 18:12:58');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-31 17:16:58
