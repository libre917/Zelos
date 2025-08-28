# Zelos - Esquema do Banco de Dados

## 📋 Visão Geral

Este documento descreve detalhadamente o esquema do banco de dados MySQL do sistema Zelos, incluindo estrutura das tabelas, relacionamentos, índices e exemplos de uso.

## 🗄️ Informações Gerais

- **Sistema de Banco**: MySQL 8.0+
- **Charset**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Engine**: InnoDB
- **Timezone**: UTC

## 🏗️ Estrutura das Tabelas

### 1. Tabela `usuarios`

Armazena informações dos usuários do sistema.

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    funcao VARCHAR(100) NOT NULL,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Descrição dos Campos

| Campo | Tipo | Tamanho | Null | Default | Descrição |
|-------|------|---------|------|---------|-----------|
| `id` | INT | - | NO | AUTO_INCREMENT | Identificador único do usuário |
| `nome` | VARCHAR | 255 | NO | - | Nome completo do usuário |
| `senha` | VARCHAR | 255 | NO | - | Hash da senha (bcrypt) |
| `email` | VARCHAR | 255 | NO | - | Email único do usuário |
| `funcao` | VARCHAR | 100 | NO | - | Role do usuário (admin, tecnico, usuario) |
| `status` | ENUM | - | YES | 'ativo' | Status ativo/inativo |
| `criado_em` | TIMESTAMP | - | YES | CURRENT_TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | - | YES | CURRENT_TIMESTAMP | Data da última atualização |

#### Valores Possíveis para `funcao`

- `admin`: Administrador do sistema
- `tecnico`: Técnico responsável por serviços
- `usuario`: Usuário comum que pode criar chamados

#### Valores Possíveis para `status`

- `ativo`: Usuário ativo no sistema
- `inativo`: Usuário desabilitado

#### Exemplo de Dados

```sql
INSERT INTO usuarios (nome, senha, email, funcao, status) VALUES
('Administrador', '$2a$10$hash...', 'admin@senai.sp.br', 'admin', 'ativo'),
('João Técnico', '$2a$10$hash...', 'joao.tecnico@senai.sp.br', 'tecnico', 'ativo'),
('Maria Usuária', '$2a$10$hash...', 'maria.usuario@senai.sp.br', 'usuario', 'ativo');
```

### 2. Tabela `pool`

Categorias de tipos de serviços disponíveis.

```sql
CREATE TABLE pool (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo varchar(50) NOT NULL,
    descricao TEXT,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    FOREIGN KEY (updated_by) REFERENCES usuarios(id)
);
```

#### Descrição dos Campos

| Campo | Tipo | Tamanho | Null | Default | Descrição |
|-------|------|---------|------|---------|-----------|
| `id` | INT | - | NO | AUTO_INCREMENT | Identificador único do tipo de serviço |
| `titulo` | VARCHAR | 50 | NO | - | Título do tipo de serviço |
| `descricao` | TEXT | - | YES | - | Descrição detalhada do serviço |
| `status` | ENUM | - | YES | 'ativo' | Status ativo/inativo |
| `criado_em` | TIMESTAMP | - | YES | CURRENT_TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | - | YES | CURRENT_TIMESTAMP | Data da última atualização |
| `created_by` | INT | - | YES | - | ID do usuário que criou |
| `updated_by` | INT | - | YES | - | ID do usuário que atualizou |

#### Exemplo de Dados

```sql
INSERT INTO pool (titulo, descricao, status, created_by) VALUES
('Manutenção', 'Serviços de manutenção geral de equipamentos', 'ativo', 1),
('Suporte de TI', 'Suporte técnico em informática e redes', 'ativo', 1),
('Limpeza', 'Serviços de limpeza e higienização', 'ativo', 1);
```

### 3. Tabela `chamados`

Registra todos os chamados do sistema.

```sql
CREATE TABLE chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    tipo_id INT,
    tecnico_id INT,
    usuario_id INT,
    status ENUM('pendente', 'em andamento', 'concluído') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_id) REFERENCES pool(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

#### Descrição dos Campos

| Campo | Tipo | Tamanho | Null | Default | Descrição |
|-------|------|---------|------|---------|-----------|
| `id` | INT | - | NO | AUTO_INCREMENT | Identificador único do chamado |
| `titulo` | VARCHAR | 255 | NO | - | Título do chamado |
| `descricao` | TEXT | - | NO | - | Descrição detalhada do problema |
| `tipo_id` | INT | - | YES | - | ID do tipo de serviço |
| `tecnico_id` | INT | - | YES | - | ID do técnico responsável |
| `usuario_id` | INT | - | YES | - | ID do usuário solicitante |
| `status` | ENUM | - | YES | 'pendente' | Status atual do chamado |
| `criado_em` | TIMESTAMP | - | YES | CURRENT_TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | - | YES | CURRENT_TIMESTAMP | Data da última atualização |

#### Valores Possíveis para `status`

- `pendente`: Aguardando atribuição de técnico
- `em andamento`: Técnico atribuído, trabalho em progresso
- `concluído`: Serviço finalizado

#### Exemplo de Dados

```sql
INSERT INTO chamados (titulo, descricao, tipo_id, usuario_id, status) VALUES
('Projetor não funciona', 'Projetor da sala 101 não está ligando', 1, 3, 'pendente'),
('Computador lento', 'Computador da sala 203 está muito lento', 2, 4, 'pendente');
```

### 4. Tabela `apontamentos`

Registra os apontamentos dos técnicos durante o serviço.

```sql
CREATE TABLE apontamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT,
    tecnico_id INT,
    descricao TEXT,
    comeco TIMESTAMP NOT NULL,
    fim TIMESTAMP NULL,
    duracao INT AS (TIMESTAMPDIFF(SECOND, comeco, fim)) STORED,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);
```

#### Descrição dos Campos

| Campo | Tipo | Tamanho | Null | Default | Descrição |
|-------|------|---------|------|---------|-----------|
| `id` | INT | - | NO | AUTO_INCREMENT | Identificador único do apontamento |
| `chamado_id` | INT | - | YES | - | ID do chamado relacionado |
| `tecnico_id` | INT | - | YES | - | ID do técnico que fez o apontamento |
| `descricao` | TEXT | - | YES | - | Descrição do trabalho realizado |
| `comeco` | TIMESTAMP | - | NO | - | Horário de início do serviço |
| `fim` | TIMESTAMP | - | YES | - | Horário de fim do serviço |
| `duracao` | INT | - | YES | - | Duração em segundos (calculada automaticamente) |
| `criado_em` | TIMESTAMP | - | YES | CURRENT_TIMESTAMP | Data de criação |

#### Exemplo de Dados

```sql
INSERT INTO apontamentos (chamado_id, tecnico_id, descricao, comeco) VALUES
(1, 2, 'Iniciada manutenção do projetor', '2024-12-01 14:00:00'),
(1, 2, 'Projetor funcionando, teste realizado', '2024-12-01 16:30:00');
```

### 5. Tabela `pool_tecnico`

Relacionamento entre técnicos e tipos de serviços.

```sql
CREATE TABLE pool_tecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pool INT,
    id_tecnico INT,
    FOREIGN KEY (id_pool) REFERENCES pool(id),
    FOREIGN KEY (id_tecnico) REFERENCES usuarios(id)
);
```

#### Descrição dos Campos

| Campo | Tipo | Tamanho | Null | Default | Descrição |
|-------|------|---------|------|---------|-----------|
| `id` | INT | - | NO | AUTO_INCREMENT | Identificador único da relação |
| `id_pool` | INT | - | YES | - | ID do tipo de serviço |
| `id_tecnico` | INT | - | YES | - | ID do técnico |

#### Exemplo de Dados

```sql
INSERT INTO pool_tecnico (id_pool, id_tecnico) VALUES
(1, 2), -- Técnico 2 pode fazer manutenção
(2, 2), -- Técnico 2 pode dar suporte de TI
(1, 5), -- Técnico 5 pode fazer manutenção
(3, 6); -- Técnico 6 pode fazer limpeza
```

## 🔗 Relacionamentos

### Diagrama ER

```
usuarios (1) ←→ (N) chamados
usuarios (1) ←→ (N) apontamentos
usuarios (1) ←→ (N) pool_tecnico
pool (1) ←→ (N) chamados
pool (1) ←→ (N) pool_tecnico
chamados (1) ←→ (N) apontamentos
```

### Chaves Estrangeiras

#### Tabela `chamados`
- `tipo_id` → `pool(id)`: Relaciona chamado ao tipo de serviço
- `tecnico_id` → `usuarios(id)`: Relaciona chamado ao técnico responsável
- `usuario_id` → `usuarios(id)`: Relaciona chamado ao usuário solicitante

#### Tabela `apontamentos`
- `chamado_id` → `chamados(id)`: Relaciona apontamento ao chamado
- `tecnico_id` → `usuarios(id)`: Relaciona apontamento ao técnico

#### Tabela `pool_tecnico`
- `id_pool` → `pool(id)`: Relaciona pool ao tipo de serviço
- `id_tecnico` → `usuarios(id)`: Relaciona pool ao técnico

#### Tabela `pool`
- `created_by` → `usuarios(id)`: Relaciona pool ao usuário criador
- `updated_by` → `usuarios(id)`: Relaciona pool ao usuário que atualizou

## 📊 Índices para Otimização

### Índices Primários
- Todas as tabelas possuem índice primário em `id`

### Índices Secundários

```sql
-- Índice para busca rápida por email
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Índice para busca rápida por status de chamados
CREATE INDEX idx_chamados_status ON chamados(status);

-- Índice composto para busca por período de apontamentos
CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);

-- Índices adicionais recomendados
CREATE INDEX idx_chamados_usuario_id ON chamados(usuario_id);
CREATE INDEX idx_chamados_tecnico_id ON chamados(tecnico_id);
CREATE INDEX idx_chamados_tipo_id ON chamados(tipo_id);
CREATE INDEX idx_chamados_criado_em ON chamados(criado_em);
CREATE INDEX idx_usuarios_funcao ON usuarios(funcao);
CREATE INDEX idx_usuarios_status ON usuarios(status);
```

## 🔍 Consultas Comuns

### 1. Chamados Pendentes

```sql
SELECT 
    c.id,
    c.titulo,
    c.descricao,
    p.titulo as tipo_servico,
    u.nome as solicitante,
    c.criado_em
FROM chamados c
JOIN pool p ON c.tipo_id = p.id
JOIN usuarios u ON c.usuario_id = u.id
WHERE c.status = 'pendente'
ORDER BY c.criado_em ASC;
```

### 2. Chamados por Técnico

```sql
SELECT 
    c.id,
    c.titulo,
    c.status,
    c.criado_em,
    p.titulo as tipo_servico
FROM chamados c
JOIN pool p ON c.tipo_id = p.id
WHERE c.tecnico_id = ?
ORDER BY c.criado_em DESC;
```

### 3. Estatísticas de Chamados

```sql
SELECT 
    status,
    COUNT(*) as total,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM chamados), 2) as percentual
FROM chamados
GROUP BY status;
```

### 4. Técnicos por Tipo de Serviço

```sql
SELECT 
    p.titulo as tipo_servico,
    u.nome as tecnico,
    u.email
FROM pool_tecnico pt
JOIN pool p ON pt.id_pool = p.id
JOIN usuarios u ON pt.id_tecnico = u.id
WHERE u.funcao = 'tecnico' AND u.status = 'ativo'
ORDER BY p.titulo, u.nome;
```

### 5. Apontamentos com Duração

```sql
SELECT 
    a.id,
    c.titulo as chamado,
    u.nome as tecnico,
    a.descricao,
    a.comeco,
    a.fim,
    SEC_TO_TIME(a.duracao) as duracao_formatada
FROM apontamentos a
JOIN chamados c ON a.chamado_id = c.id
JOIN usuarios u ON a.tecnico_id = u.id
WHERE a.chamado_id = ?
ORDER BY a.comeco DESC;
```

## 🚀 Scripts de Inicialização

### Script Completo

```sql
-- Criação do banco
CREATE DATABASE IF NOT EXISTS zelos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zelos;

-- Criação das tabelas
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    funcao VARCHAR(100) NOT NULL,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pool (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo varchar(50) NOT NULL,
    descricao TEXT,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    FOREIGN KEY (updated_by) REFERENCES usuarios(id)
);

CREATE TABLE chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    tipo_id INT,
    tecnico_id INT,
    usuario_id INT,
    status ENUM('pendente', 'em andamento', 'concluído') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_id) REFERENCES pool(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE apontamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT,
    tecnico_id INT,
    descricao TEXT,
    comeco TIMESTAMP NOT NULL,
    fim TIMESTAMP NULL,
    duracao INT AS (TIMESTAMPDIFF(SECOND, comeco, fim)) STORED,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);

CREATE TABLE pool_tecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pool INT,
    id_tecnico INT,
    FOREIGN KEY (id_pool) REFERENCES pool(id),
    FOREIGN KEY (id_tecnico) REFERENCES usuarios(id)
);

-- Criação dos índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);
CREATE INDEX idx_chamados_usuario_id ON chamados(usuario_id);
CREATE INDEX idx_chamados_tecnico_id ON chamados(tecnico_id);
CREATE INDEX idx_chamados_tipo_id ON chamados(tipo_id);
CREATE INDEX idx_chamados_criado_em ON chamados(criado_em);
CREATE INDEX idx_usuarios_funcao ON usuarios(funcao);
CREATE INDEX idx_usuarios_status ON usuarios(status);

-- Inserção de dados iniciais
INSERT INTO usuarios (nome, senha, email, funcao, status) VALUES
('Administrador', '$2a$10$hash...', 'admin@senai.sp.br', 'admin', 'ativo'),
('Técnico Geral', '$2a$10$hash...', 'tecnico@senai.sp.br', 'tecnico', 'ativo'),
('Usuário Teste', '$2a$10$hash...', 'usuario@senai.sp.br', 'usuario', 'ativo');

INSERT INTO pool (titulo, descricao, status, created_by) VALUES
('Manutenção', 'Serviços de manutenção geral', 'ativo', 1),
('Suporte de TI', 'Suporte técnico em informática', 'ativo', 1),
('Limpeza', 'Serviços de limpeza', 'ativo', 1);

INSERT INTO pool_tecnico (id_pool, id_tecnico) VALUES
(1, 2), -- Técnico pode fazer manutenção
(2, 2), -- Técnico pode dar suporte de TI
(3, 2); -- Técnico pode fazer limpeza
```

## 🔧 Manutenção do Banco

### Backup

```bash
# Backup completo
mysqldump -u root -p zelos > zelos_backup_$(date +%Y%m%d_%H%M%S).sql

# Backup apenas da estrutura
mysqldump -u root -p --no-data zelos > zelos_structure.sql

# Backup apenas dos dados
mysqldump -u root -p --no-create-info zelos > zelos_data.sql
```

### Restauração

```bash
# Restaurar backup completo
mysql -u root -p zelos < zelos_backup.sql

# Restaurar apenas estrutura
mysql -u root -p zelos < zelos_structure.sql

# Restaurar apenas dados
mysql -u root -p zelos < zelos_data.sql
```

### Otimização

```sql
-- Analisar tabelas
ANALYZE TABLE usuarios, pool, chamados, apontamentos, pool_tecnico;

-- Otimizar tabelas
OPTIMIZE TABLE usuarios, pool, chamados, apontamentos, pool_tecnico;

-- Verificar status das tabelas
SHOW TABLE STATUS;
```

## 📈 Monitoramento

### Queries de Monitoramento

```sql
-- Tamanho das tabelas
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'zelos'
ORDER BY (data_length + index_length) DESC;

-- Estatísticas de uso
SELECT 
    COUNT(*) as total_usuarios,
    SUM(CASE WHEN status = 'ativo' THEN 1 ELSE 0 END) as usuarios_ativos,
    SUM(CASE WHEN funcao = 'admin' THEN 1 ELSE 0 END) as admins,
    SUM(CASE WHEN funcao = 'tecnico' THEN 1 ELSE 0 END) as tecnicos,
    SUM(CASE WHEN funcao = 'usuario' THEN 1 ELSE 0 END) as usuarios
FROM usuarios;

-- Chamados por período
SELECT 
    DATE(criado_em) as data,
    COUNT(*) as total_chamados,
    SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
    SUM(CASE WHEN status = 'em andamento' THEN 1 ELSE 0 END) as em_andamento,
    SUM(CASE WHEN status = 'concluído' THEN 1 ELSE 0 END) as concluidos
FROM chamados
WHERE criado_em >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(criado_em)
ORDER BY data DESC;
```

---

**Esquema do Banco de Dados Zelos**  
**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024 