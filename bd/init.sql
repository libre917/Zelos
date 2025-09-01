-- Script de Inicializacao do Banco Zelos
-- Versao Limpa (sem dados de exemplo)

CREATE DATABASE IF NOT EXISTS zelos DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zelos;

-- Estrutura da tabela usuarios
CREATE TABLE usuarios (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL,
  senha varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  funcao enum('usuario','tecnico','admin') DEFAULT 'usuario',
  status enum('ativo','inativo') DEFAULT 'ativo',
  criado_em timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY idx_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estrutura da tabela pool
CREATE TABLE pool (
  id int NOT NULL AUTO_INCREMENT,
  titulo varchar(50) NOT NULL,
  descricao varchar(250) DEFAULT NULL,
  status enum('ativo','inativo') DEFAULT 'ativo',
  criado_em timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by int DEFAULT NULL,
  updated_by int DEFAULT NULL,
  PRIMARY KEY (id),
  KEY created_by (created_by),
  KEY updated_by (updated_by),
  CONSTRAINT pool_ibfk_1 FOREIGN KEY (created_by) REFERENCES usuarios (id),
  CONSTRAINT pool_ibfk_2 FOREIGN KEY (updated_by) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estrutura da tabela pool_tecnico
CREATE TABLE pool_tecnico (
  id int NOT NULL AUTO_INCREMENT,
  id_pool int DEFAULT NULL,
  id_tecnico int DEFAULT NULL,
  PRIMARY KEY (id),
  KEY id_pool (id_pool),
  KEY id_tecnico (id_tecnico),
  CONSTRAINT pool_tecnico_ibfk_1 FOREIGN KEY (id_pool) REFERENCES pool (id),
  CONSTRAINT pool_tecnico_ibfk_2 FOREIGN KEY (id_tecnico) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estrutura da tabela chamados
CREATE TABLE chamados (
  id int NOT NULL AUTO_INCREMENT,
  titulo varchar(255) NOT NULL,
  descricao varchar(250) DEFAULT NULL,
  tipo_id int DEFAULT NULL,
  tecnico_id int DEFAULT NULL,
  usuario_id int DEFAULT NULL,
  status enum('pendente','em andamento','concluido') DEFAULT 'pendente',
  criado_em timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY tipo_id (tipo_id),
  KEY tecnico_id (tecnico_id),
  KEY usuario_id (usuario_id),
  KEY idx_chamados_status (status),
  CONSTRAINT chamados_ibfk_1 FOREIGN KEY (tipo_id) REFERENCES pool (id),
  CONSTRAINT chamados_ibfk_2 FOREIGN KEY (tecnico_id) REFERENCES usuarios (id),
  CONSTRAINT chamados_ibfk_3 FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estrutura da tabela apontamentos
CREATE TABLE apontamentos (
  id int NOT NULL AUTO_INCREMENT,
  chamado_id int DEFAULT NULL,
  tecnico_id int DEFAULT NULL,
  descricao varchar(250) DEFAULT NULL,
  comeco timestamp NOT NULL,
  fim timestamp NULL DEFAULT NULL,
  duracao int GENERATED ALWAYS AS (timestampdiff(SECOND, comeco, fim)) STORED,
  criado_em timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY chamado_id (chamado_id),
  KEY tecnico_id (tecnico_id),
  KEY idx_apontamentos_comeco_fim (comeco, fim),
  CONSTRAINT apontamentos_ibfk_1 FOREIGN KEY (chamado_id) REFERENCES chamados (id),
  CONSTRAINT apontamentos_ibfk_2 FOREIGN KEY (tecnico_id) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
