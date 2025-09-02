-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: zelos
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `apontamentos`
--

DROP TABLE IF EXISTS `apontamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apontamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chamado_id` int(11) DEFAULT NULL,
  `tecnico_id` int(11) DEFAULT NULL,
  `descricao` varchar(250) DEFAULT NULL,
  `comeco` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fim` timestamp NULL DEFAULT NULL,
  `duracao` int(11) GENERATED ALWAYS AS (timestampdiff(SECOND,`comeco`,`fim`)) STORED,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `chamado_id` (`chamado_id`),
  KEY `tecnico_id` (`tecnico_id`),
  KEY `idx_apontamentos_comeco_fim` (`comeco`,`fim`),
  CONSTRAINT `apontamentos_ibfk_1` FOREIGN KEY (`chamado_id`) REFERENCES `chamados` (`id`),
  CONSTRAINT `apontamentos_ibfk_2` FOREIGN KEY (`tecnico_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` varchar(250) DEFAULT NULL,
  `tipo_id` int(11) DEFAULT NULL,
  `tecnico_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `status` enum('pendente','em andamento','concluido') DEFAULT 'pendente',
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `tipo_id` (`tipo_id`),
  KEY `tecnico_id` (`tecnico_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_chamados_status` (`status`),
  CONSTRAINT `chamados_ibfk_1` FOREIGN KEY (`tipo_id`) REFERENCES `pool` (`id`),
  CONSTRAINT `chamados_ibfk_2` FOREIGN KEY (`tecnico_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `chamados_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chamados`
--

LOCK TABLES `chamados` WRITE;
/*!40000 ALTER TABLE `chamados` DISABLE KEYS */;
/*!40000 ALTER TABLE `chamados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pool`
--

DROP TABLE IF EXISTS `pool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pool` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(50) NOT NULL,
  `descricao` varchar(250) DEFAULT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `pool_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `pool_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pool`
--

LOCK TABLES `pool` WRITE;
/*!40000 ALTER TABLE `pool` DISABLE KEYS */;
/*!40000 ALTER TABLE `pool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pool_tecnico`
--

DROP TABLE IF EXISTS `pool_tecnico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pool_tecnico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pool` int(11) DEFAULT NULL,
  `id_tecnico` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_pool` (`id_pool`),
  KEY `id_tecnico` (`id_tecnico`),
  CONSTRAINT `pool_tecnico_ibfk_1` FOREIGN KEY (`id_pool`) REFERENCES `pool` (`id`),
  CONSTRAINT `pool_tecnico_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pool_tecnico`
--

LOCK TABLES `pool_tecnico` WRITE;
/*!40000 ALTER TABLE `pool_tecnico` DISABLE KEYS */;
/*!40000 ALTER TABLE `pool_tecnico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `funcao` enum('usuario','tecnico','admin') DEFAULT 'usuario',
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_usuarios_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
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

-- Dump completed on 2025-09-02 16:53:14
