# Zelos
## Sistema de Chamados - Escola SENAI Armando de Arruda Pereira

Este é um projeto de sistema de chamados para a Escola SENAI Armando de Arruda Pereira, desenvolvido para gerenciar solicitações de manutenção, apoio técnico e outros serviços para itens identificados pelo número de patrimônio da escola. O sistema foi construído com Next.js, Node.js e MySQL.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Como Iniciar](#como-iniciar)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Banco de Dados](#banco-de-dados)
- [API Endpoints](#api-endpoints)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Integração AD](#integração-ad)
- [Desenvolvimento](#desenvolvimento)
- [Licença](#licença)

## 🎯 Sobre o Projeto

Este sistema permite que os usuários registrem chamados de manutenção e outros serviços para itens da escola, utilizando o número de patrimônio como identificador dos itens. Ele permite que os técnicos acompanhem o progresso dos chamados, façam apontamentos sobre o status das manutenções e gerenciem o histórico de serviços realizados.

### Funcionalidades Principais

- **Criação de Chamados**: Usuários podem criar chamados informando o número de patrimônio ou descrição de item e o tipo de serviço necessário.
- **Acompanhamento de Chamados**: Técnicos e usuários podem visualizar o status dos chamados e acompanhar as atualizações feitas pelos responsáveis.
- **Apontamentos de Técnicos**: Técnicos podem adicionar apontamentos detalhados sobre o serviço realizado.
- **Relatórios**: O sistema permite a geração de relatórios sobre os chamados, tipos de serviços e técnicos envolvidos.
- **Gestão de Usuários**: Sistema de roles (admin, técnico, usuário) com permissões específicas.
- **Pool de Serviços**: Categorização de tipos de serviços com técnicos especializados.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Ambiente de execução JavaScript
- **Express.js**: Framework web para Node.js
- **MySQL2**: Driver MySQL para Node.js com suporte a Promises
- **JWT**: Autenticação baseada em tokens
- **Passport.js**: Middleware de autenticação
- **LDAP**: Integração com Active Directory
- **bcryptjs**: Criptografia de senhas
- **Multer**: Upload de arquivos
- **PDFKit**: Geração de relatórios em PDF

### Frontend
- **Next.js**: Framework React para o frontend
- **React**: Biblioteca para interfaces de usuário

### Banco de Dados
- **MySQL**: Banco de dados relacional

## 🏗️ Arquitetura do Sistema

O sistema segue uma arquitetura em camadas bem definida:

```
┌─────────────────┐
│   Frontend      │  ← Next.js (React)
│   (Next.js)     │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Backend       │  ← Express.js + Node.js
│   (API REST)    │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Banco de      │  ← MySQL
│   Dados         │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Active        │  ← LDAP Integration
│   Directory     │
└─────────────────┘
```

### Padrão MVC
- **Models**: Definição das entidades do sistema
- **Views**: Componentes React (frontend)
- **Controllers**: Lógica de negócio e controle de requisições
- **Services**: Camada de serviços para operações complexas
- **Routes**: Definição dos endpoints da API

## 🚀 Como Iniciar

### Pré-requisitos

Antes de começar, é necessário ter as seguintes ferramentas instaladas em sua máquina:

- **Node.js** (versão >= 14.x)
- **MySQL** (versão 8.0+)
- **Git**

### 1. Clonar o repositório

```bash
git clone https://github.com/Paivs/Zelos.git
cd Zelos
```

### 2. Configuração do Banco de Dados

#### 2.1 Criar banco de dados

```sql
CREATE DATABASE zelos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zelos;
```

#### 2.2 Executar script de inicialização

```bash
cd bd
mysql -u root -p zelos < init.sql
```

#### 2.3 Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto backend:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=zelos

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Port
PORT=8080
```

### 3. Instalar dependências

#### 3.1 Backend
```bash
cd backend
npm install
```

#### 3.2 Frontend
```bash
cd frontend
npm install
```

### 4. Iniciar os serviços

#### 4.1 Backend
```bash
cd backend
npm start
# ou
node app.js
```

O servidor estará rodando em `http://localhost:8080`

#### 4.2 Frontend
```bash
cd frontend
npm run dev
```

O sistema estará rodando em `http://localhost:3000`

## 📁 Estrutura de Diretórios

```
zelos/
├── backend/                    # Servidor Node.js/Express
│   ├── config/                # Configurações do sistema
│   │   ├── database.js        # Configuração do banco MySQL
│   │   ├── ldap.js           # Configuração LDAP/AD
│   │   └── dotenv.js         # Carregamento de variáveis
│   ├── controllers/           # Controladores da API
│   │   ├── AuthController.js  # Autenticação e autorização
│   │   ├── TicketsController.js # Gestão de chamados
│   │   ├── UsersController.js # Gestão de usuários
│   │   ├── PoolController.js  # Gestão de pools de serviço
│   │   └── ReportController.js # Relatórios
│   ├── services/              # Camada de serviços
│   │   ├── ticketsService.js  # Lógica de negócio dos chamados
│   │   ├── usersService.js    # Lógica de negócio dos usuários
│   │   └── poolService.js     # Lógica de negócio dos pools
│   ├── model/                 # Modelos de dados
│   │   ├── User.js           # Modelo de usuário
│   │   ├── Ticket.js         # Modelo de chamado
│   │   ├── Pool.js           # Modelo de pool
│   │   └── Report.js         # Modelo de relatório
│   ├── routes/                # Definição das rotas
│   │   ├── authRotas.js      # Rotas de autenticação
│   │   ├── ticketRotas.js    # Rotas de chamados
│   │   ├── userRotas.js      # Rotas de usuários
│   │   ├── poolRotas.js      # Rotas de pools
│   │   └── reportRotas.js    # Rotas de relatórios
│   ├── middlewares/           # Middlewares personalizados
│   │   └── authMiddleware.js  # Validação de JWT
│   ├── utils/                 # Utilitários
│   │   ├── validar.js        # Validações
│   │   └── erroStatus.js     # Tratamento de erros
│   ├── app.js                 # Arquivo principal do servidor
│   └── package.json           # Dependências do backend
├── frontend/                   # Aplicação Next.js
│   ├── app/                   # Páginas da aplicação
│   │   ├── usuario/           # Páginas do usuário comum
│   │   ├── admin/             # Páginas do administrador
│   │   └── tecnico/           # Páginas do técnico
│   ├── components/            # Componentes React
│   └── package.json           # Dependências do frontend
├── bd/                        # Scripts de banco de dados
│   ├── init.sql               # Script de inicialização
│   ├── bd.md                  # Documentação do banco
│   └── Dockerfile             # Containerização do banco
└── README.md                  # Este arquivo
```

## 🗄️ Banco de Dados

### Estrutura das Tabelas

#### 1. Tabela `usuarios`
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

**Campos:**
- `id`: Identificador único do usuário
- `nome`: Nome completo do usuário
- `senha`: Hash da senha (bcrypt)
- `email`: Email único do usuário
- `funcao`: Role do usuário (admin, tecnico, usuario)
- `status`: Status ativo/inativo
- `criado_em`: Data de criação
- `atualizado_em`: Data da última atualização

#### 2. Tabela `pool`
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

#### 3. Tabela `chamados`
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

**Status dos Chamados:**
- `pendente`: Aguardando atribuição de técnico
- `em andamento`: Técnico atribuído, trabalho em progresso
- `concluído`: Serviço finalizado

#### 4. Tabela `apontamentos`
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

#### 5. Tabela `pool_tecnico`
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

### Índices para Otimização

```sql
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);
```

## 🔌 API Endpoints

### Autenticação

#### POST `/auth/login`
Autenticação de usuário via email e senha.

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "jwt_token_aqui"
}
```

#### POST `/auth/logout`
Logout do usuário.

**Response:**
```json
{
  "mensagem": "Logout realizado com sucesso"
}
```

#### GET `/auth/check`
Verifica se o usuário está autenticado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Chamados

#### GET `/ticket`
Lista todos os chamados (requer autenticação).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### GET `/ticket/:id`
Obtém um chamado específico por ID.

#### POST `/ticket`
Cria um novo chamado.

**Request Body:**
```json
{
  "titulo": "Manutenção do Projetor",
  "descricao": "Projetor não está funcionando",
  "tipo_id": 1
}
```

#### PUT `/ticket/:id/tecnico`
Atribui um técnico a um chamado.

**Request Body:**
```json
{
  "tecnico_id": 5
}
```

#### GET `/ticket/user`
Lista chamados do usuário logado.

#### GET `/ticket/status/:status`
Lista chamados por status (pendente, em andamento, concluído).

#### GET `/ticket/tecnico/:id`
Lista chamados de um técnico específico.

### Usuários

#### GET `/users`
Lista todos os usuários.

#### GET `/users/:id`
Obtém um usuário específico.

#### POST `/users`
Cria um novo usuário.

#### PUT `/users/:id`
Atualiza um usuário existente.

#### DELETE `/users/:id`
Remove um usuário.

### Pools de Serviço

#### GET `/pool`
Lista todos os tipos de serviços.

#### GET `/pool/:id`
Obtém um tipo de serviço específico.

#### POST `/pool`
Cria um novo tipo de serviço.

#### PUT `/pool/:id`
Atualiza um tipo de serviço.

#### DELETE `/pool/:id`
Remove um tipo de serviço.

### Relatórios

#### GET `/report`
Gera relatórios do sistema.

## 🔐 Autenticação e Autorização

### Sistema de JWT

O sistema utiliza JSON Web Tokens (JWT) para autenticação:

- **Geração**: Token é gerado no login com expiração de 1 dia
- **Validação**: Middleware `authMiddleware` valida tokens em rotas protegidas
- **Armazenamento**: Token é armazenado em cookie HTTP-only

### Middleware de Autenticação

```javascript
// backend/middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Não autorizado: Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ mensagem: 'Não autorizado: Token inválido' });
  }
};
```

### Sistema de Roles

- **Admin**: Acesso total ao sistema
- **Técnico**: Pode gerenciar chamados e fazer apontamentos
- **Usuário**: Pode criar e acompanhar seus próprios chamados

## 🏢 Integração AD

### Configuração LDAP

O backend está integrado com o Active Directory da SENAI:

```javascript
// backend/config/ldap.js
const ldapOptions = {
  server: {
    url: 'ldap://10.189.87.7:389',
    bindDN: 'cn=script,ou=Funcionarios,ou=Usuarios123,dc=educ123,dc=sp,dc=senai,dc=br',
    bindCredentials: '7GFGOy4ATCiqW9c86eStgCe0RA9BgA',
    searchBase: 'ou=Funcionars,ou=Usuarios123,dc=educ123,dc=sp,dc=senai,dc=br',
    searchFilter: '(sAMAccountName={{username}})'
  }
};
```

### Endpoint de Autenticação AD

**POST** `/auth/login` com JSON:
```json
{
  "username": "usuario_ad",
  "password": "senha_ad"
}
```

⚠️ **Importante**: Este endpoint só funciona via rede cabeada ou WiFi B07. Evite remover ou alterar o código existente de autenticação AD.

## 💻 Desenvolvimento

### Padrões de Código

- **ES6+**: Uso de módulos ES6, async/await, destructuring
- **MVC**: Separação clara entre Model, View e Controller
- **Services**: Camada de serviços para lógica de negócio
- **Error Handling**: Tratamento robusto de erros com status HTTP apropriados

### Estrutura de Serviços

```javascript
// Exemplo de serviço (backend/services/ticketsService.js)
export async function createTicket(data) {
    try {
        // Validações
        validarCamposObrigatorios(data, ['titulo', 'descricao', 'usuario_id', 'tipo_id']);
        
        // Criação do ticket
        const ticketData = new Ticket(data);
        
        // Validações adicionais
        validarStatus(ticketData.status);
        await validarRole(ticketData.usuario_id, ['usuario', 'Usuário', 'admin']);
        
        // Persistência
        return await create('chamados', ticketData);
    } catch (err) {
        console.error('Erro ao criar chamado:', err);
        throw err;
    }
}
```

### Validações

O sistema implementa validações robustas:

- **Campos obrigatórios**: Validação de campos necessários
- **Status válidos**: Validação de status permitidos
- **Roles**: Validação de permissões por função
- **Integridade referencial**: Validação de relacionamentos

### Tratamento de Erros

```javascript
// backend/utils/erroStatus.js
export default function erroStatus(mensagem, status) {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
}
```

### Configuração do Banco

```javascript
// backend/config/database.js
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'senai@123',
    database: 'zelos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

## 🐳 Docker

### Banco de Dados

O projeto inclui um Dockerfile para o banco MySQL:

```dockerfile
# bd/Dockerfile
FROM mysql:8.0
ENV MYSQL_ROOT_PASSWORD=senai@123
ENV MYSQL_DATABASE=zelos
COPY init.sql /docker-entrypoint-initdb.d/
```

### Executar com Docker

```bash
cd bd
docker build -t zelos-mysql .
docker run -d -p 3306:3306 --name zelos-db zelos-mysql
```

## 📊 Monitoramento e Logs

### Health Check

Endpoint para verificar status do sistema:

```bash
GET /health
```

**Response:**
```json
{
  "status": "online"
}
```

### Logs do Sistema

- **Console**: Logs de erro e informações importantes
- **Tratamento de exceções**: Captura de erros não tratados
- **Validação de configuração**: Verificação de dependências na inicialização

## 🔧 Configurações

### Variáveis de Ambiente

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senai@123
DB_NAME=zelos

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Frontend
FRONTEND_URL=http://localhost:3000

# Port
PORT=8080

# LDAP
LDAP_URL=ldap://10.189.87.7:389
LDAP_BIND_DN=cn=script,ou=Funcionarios,ou=Usuarios123,dc=educ123,dc=sp,dc=senai,dc=br
LDAP_BIND_CREDENTIALS=7GFGOy4ATCiqW9c86eStgCe0RA9BgA
```

### CORS

Configuração de CORS para permitir comunicação entre frontend e backend:

```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**
   - Verificar se MySQL está rodando
   - Validar credenciais no arquivo `.env`
   - Verificar se banco `zelos` existe

2. **Erro de autenticação AD**
   - Verificar conectividade de rede
   - Validar configurações LDAP
   - Testar via rede cabeada ou WiFi B07

3. **Erro de JWT**
   - Verificar se `JWT_SECRET` está definido
   - Validar formato do token no header Authorization

### Logs de Debug

Para debug detalhado, adicione no `.env`:

```env
DEBUG=zelos:*
NODE_ENV=development
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Equipe Zelos** - *Desenvolvimento inicial* - [Paivs](https://github.com/Paivs)

## 🙏 Agradecimentos

- Escola SENAI Armando de Arruda Pereira
- Equipe de TI da SENAI
- Comunidade Node.js e Next.js

---

**Última atualização**: Dezembro 2024
**Versão**: 1.0.0
