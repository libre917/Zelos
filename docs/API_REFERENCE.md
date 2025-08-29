# Zelos - Referência da API REST

## 📋 Visão Geral

Esta documentação descreve todos os endpoints da API REST do sistema Zelos, incluindo parâmetros, respostas e exemplos de uso.

## 🔐 Autenticação

### Base URL
```
http://localhost:8080
```

### Headers de Autenticação
Para endpoints protegidos, inclua o header:
```
Authorization: Bearer <jwt_token>
```

### Obtenção de Token
Faça login via `/auth/login` para obter um token JWT válido.

## 📚 Endpoints da API

## 🔑 Autenticação

### POST `/auth/login`

Autentica um usuário e retorna um token JWT.

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401):**
```json
{
  "mensagem": "Senha ou email incorretos"
}
```

**Response (404):**
```json
{
  "mensagem": "Usuário não encontrado"
}
```

**Response (403):**
```json
{
  "mensagem": "Usuário inativo"
}
```

### POST `/auth/logout`

Realiza logout do usuário, invalidando o token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "mensagem": "Logout realizado com sucesso"
}
```

### GET `/auth/check`

Verifica se o usuário está autenticado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "authenticated": true,
  "user": {
    "username": "usuario123",
    "displayName": "Nome do Usuário"
  }
}
```

**Response (401):**
```json
{
  "authenticated": false
}
```

## 🎫 Chamados

### GET `/ticket`

Lista todos os chamados do sistema.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Manutenção do Projetor",
    "descricao": "Projetor não está funcionando corretamente",
    "tipo_id": 1,
    "tecnico_id": 5,
    "usuario_id": 3,
    "status": "em andamento",
    "criado_em": "2024-12-01T10:00:00.000Z",
    "atualizado_em": "2024-12-01T14:30:00.000Z"
  },
  {
    "id": 2,
    "titulo": "Suporte de TI",
    "descricao": "Preciso de ajuda com o computador",
    "tipo_id": 2,
    "tecnico_id": null,
    "usuario_id": 4,
    "status": "pendente",
    "criado_em": "2024-12-01T15:00:00.000Z",
    "atualizado_em": "2024-12-01T15:00:00.000Z"
  }
]
```

### GET `/ticket/:id`

Obtém um chamado específico por ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parâmetros:**
- `id` (path): ID do chamado

**Response (200):**
```json
{
  "id": 1,
  "titulo": "Manutenção do Projetor",
  "descricao": "Projetor não está funcionando corretamente",
  "tipo_id": 1,
  "tecnico_id": 5,
  "usuario_id": 3,
  "status": "em andamento",
  "criado_em": "2024-12-01T10:00:00.000Z",
  "atualizado_em": "2024-12-01T14:30:00.000Z"
}
```

**Response (404):**
```json
{
  "message": "Chamado não encontrado"
}
```

### POST `/ticket`

Cria um novo chamado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "titulo": "Manutenção do Ar Condicionado",
  "descricao": "Ar condicionado da sala 101 não está funcionando",
  "tipo_id": 3
}
```

**Campos Obrigatórios:**
- `titulo`: Título do chamado
- `descricao`: Descrição detalhada do problema
- `tipo_id`: ID do tipo de serviço

**Response (201):**
```json
{
  "message": "Chamado criado com sucesso",
  "id": 3
}
```

**Response (400):**
```json
{
  "mensagem": "Campo obrigatório: titulo",
  "status": 400
}
```

### PUT `/ticket/:id/tecnico`

Atribui um técnico a um chamado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parâmetros:**
- `id` (path): ID do chamado

**Request Body:**
```json
{
  "tecnico_id": 7
}
```

**Response (200):**
```json
{
  "message": "Técnico atribuído ao chamado com sucesso"
}
```

**Response (400):**
```json
{
  "message": "ID do técnico é obrigatório"
}
```

**Response (400):**
```json
{
  "message": "ID do técnico inválido"
}
```

### GET `/ticket/user`

Lista chamados do usuário logado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Manutenção do Projetor",
    "descricao": "Projetor não está funcionando corretamente",
    "tipo_id": 1,
    "tecnico_id": 5,
    "usuario_id": 3,
    "status": "em andamento",
    "criado_em": "2024-12-01T10:00:00.000Z",
    "atualizado_em": "2024-12-01T14:30:00.000Z"
  }
]
```

### GET `/ticket/status/:status`

Lista chamados por status.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parâmetros:**
- `status` (path): Status dos chamados (`pendente`, `em andamento`, `concluído`)

**Response (200):**
```json
[
  {
    "id": 2,
    "titulo": "Suporte de TI",
    "descricao": "Preciso de ajuda com o computador",
    "tipo_id": 2,
    "tecnico_id": null,
    "usuario_id": 4,
    "status": "pendente",
    "criado_em": "2024-12-01T15:00:00.000Z",
    "atualizado_em": "2024-12-01T15:00:00.000Z"
  }
]
```

### GET `/ticket/tecnico/:id`

Lista chamados de um técnico específico.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parâmetros:**
- `id` (path): ID do técnico

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Manutenção do Projetor",
    "descricao": "Projetor não está funcionando corretamente",
    "tipo_id": 1,
    "tecnico_id": 5,
    "usuario_id": 3,
    "status": "em andamento",
    "criado_em": "2024-12-01T10:00:00.000Z",
    "atualizado_em": "2024-12-01T14:30:00.000Z"
  }
]
```

### GET `/ticket/record/:id`

Obtém registro completo de um chamado incluindo dados relacionados.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parâmetros:**
- `id` (path): ID do chamado

**Response (200):**
```json
{
  "chamado": {
    "id": 1,
    "titulo": "Manutenção do Projetor",
    "descricao": "Projetor não está funcionando corretamente",
    "status": "em andamento",
    "criado_em": "2024-12-01T10:00:00.000Z"
  },
  "pool": {
    "id": 1,
    "titulo": "Manutenção",
    "descricao": "Serviços de manutenção geral"
  },
  "solicitante": {
    "id": 3,
    "nome": "João Silva",
    "email": "joao.silva@senai.sp.br"
  },
  "tecnico": {
    "id": 5,
    "nome": "Carlos Santos",
    "email": "carlos.santos@senai.sp.br"
  },
  "apontamentos": [
    {
      "id": 1,
      "descricao": "Iniciada manutenção do projetor",
      "comeco": "2024-12-01T14:00:00.000Z",
      "fim": null,
      "duracao": null
    }
  ]
}
```

## 👥 Usuários

### GET `/users`

Lista todos os usuários do sistema.

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@senai.sp.br",
    "funcao": "admin",
    "status": "ativo",
    "criado_em": "2024-12-01T08:00:00.000Z",
    "atualizado_em": "2024-12-01T08:00:00.000Z"
  },
  {
    "id": 2,
    "nome": "Maria Técnica",
    "email": "maria.tecnica@senai.sp.br",
    "funcao": "tecnico",
    "status": "ativo",
    "criado_em": "2024-12-01T08:30:00.000Z",
    "atualizado_em": "2024-12-01T08:30:00.000Z"
  }
]
```

### GET `/users/:id`

Obtém um usuário específico por ID.

**Parâmetros:**
- `id` (path): ID do usuário

**Response (200):**
```json
{
  "id": 2,
  "nome": "Maria Técnica",
  "email": "maria.tecnica@senai.sp.br",
  "funcao": "tecnico",
  "status": "ativo",
  "criado_em": "2024-12-01T08:30:00.000Z",
  "atualizado_em": "2024-12-01T08:30:00.000Z"
}
```

### POST `/users`

Cria um novo usuário.

**Request Body:**
```json
{
  "nome": "Novo Usuário",
  "email": "novo.usuario@senai.sp.br",
  "senha": "senha123",
  "funcao": "usuario"
}
```

**Campos Obrigatórios:**
- `nome`: Nome completo do usuário
- `email`: Email único do usuário
- `senha`: Senha do usuário
- `funcao`: Função do usuário (`admin`, `tecnico`, `usuario`)

**Response (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "id": 10
}
```

### PUT `/users/:id`

Atualiza um usuário existente.

**Parâmetros:**
- `id` (path): ID do usuário

**Request Body:**
```json
{
  "nome": "Nome Atualizado",
  "status": "inativo"
}
```

**Response (200):**
```json
{
  "message": "Usuário atualizado com sucesso"
}
```

### DELETE `/users/:id`

Remove um usuário do sistema.

**Parâmetros:**
- `id` (path): ID do usuário

**Response (200):**
```json
{
  "message": "Usuário removido com sucesso"
}
```

## 🏊 Pools de Serviço

### GET `/pool`

Lista todos os tipos de serviços disponíveis.

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Manutenção",
    "descricao": "Serviços de manutenção geral",
    "status": "ativo",
    "criado_em": "2024-12-01T08:00:00.000Z",
    "atualizado_em": "2024-12-01T08:00:00.000Z",
    "created_by": 1,
    "updated_by": 1
  },
  {
    "id": 2,
    "titulo": "Suporte de TI",
    "descricao": "Suporte técnico em informática",
    "status": "ativo",
    "criado_em": "2024-12-01T08:00:00.000Z",
    "atualizado_em": "2024-12-01T08:00:00.000Z",
    "created_by": 1,
    "updated_by": 1
  }
]
```

### GET `/pool/:id`

Obtém um tipo de serviço específico por ID.

**Parâmetros:**
- `id` (path): ID do tipo de serviço

**Response (200):**
```json
{
  "id": 1,
  "titulo": "Manutenção",
  "descricao": "Serviços de manutenção geral",
  "status": "ativo",
  "criado_em": "2024-12-01T08:00:00.000Z",
  "atualizado_em": "2024-12-01T08:00:00.000Z",
  "created_by": 1,
  "updated_by": 1
}
```

### POST `/pool`

Cria um novo tipo de serviço.

**Request Body:**
```json
{
  "titulo": "Limpeza",
  "descricao": "Serviços de limpeza e higienização",
  "status": "ativo"
}
```

**Campos Obrigatórios:**
- `titulo`: Título do tipo de serviço
- `descricao`: Descrição do serviço

**Response (201):**
```json
{
  "message": "Pool criado com sucesso",
  "id": 4
}
```

### PUT `/pool/:id`

Atualiza um tipo de serviço existente.

**Parâmetros:**
- `id` (path): ID do tipo de serviço

**Request Body:**
```json
{
  "titulo": "Manutenção e Limpeza",
  "descricao": "Serviços combinados de manutenção e limpeza"
}
```

**Response (200):**
```json
{
  "message": "Pool atualizado com sucesso"
}
```

### DELETE `/pool/:id`

Remove um tipo de serviço do sistema.

**Parâmetros:**
- `id` (path): ID do tipo de serviço

**Response (200):**
```json
{
  "message": "Pool removido com sucesso"
}
```

## 📊 Relatórios

### GET `/report`

Gera relatórios do sistema.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `tipo`: Tipo de relatório (`chamados`, `usuarios`, `tecnicos`)
- `data_inicio`: Data de início (YYYY-MM-DD)
- `data_fim`: Data de fim (YYYY-MM-DD)
- `formato`: Formato do relatório (`json`, `pdf`)

**Exemplo de Request:**
```
GET /report?tipo=chamados&data_inicio=2024-12-01&data_fim=2024-12-31&formato=pdf
```

**Response (200) - JSON:**
```json
{
  "relatorio": {
    "tipo": "chamados",
    "periodo": "2024-12-01 a 2024-12-31",
    "total_chamados": 45,
    "chamados_por_status": {
      "pendente": 12,
      "em andamento": 18,
      "concluído": 15
    },
    "chamados_por_tipo": {
      "Manutenção": 20,
      "Suporte de TI": 15,
      "Limpeza": 10
    }
  }
}
```

**Response (200) - PDF:**
Retorna um arquivo PDF com o relatório solicitado.

## 🏥 Health Check

### GET `/health`

Verifica o status do sistema.

**Response (200):**
```json
{
  "status": "online",
  "timestamp": "2024-12-01T16:00:00.000Z",
  "version": "1.0.0"
}
```

## 📝 Códigos de Status HTTP

| Código | Descrição | Uso |
|--------|-----------|-----|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Token não fornecido ou inválido |
| 403 | Forbidden | Usuário sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro interno do servidor |

## 🔒 Segurança

### Validações

- **Campos Obrigatórios**: Todos os campos obrigatórios são validados
- **Tipos de Dados**: Validação de tipos e formatos
- **Permissões**: Verificação de roles e permissões
- **SQL Injection**: Proteção via prepared statements

### Rate Limiting

O sistema implementa proteção contra ataques de força bruta e sobrecarga.

### CORS

Configuração de CORS para permitir apenas origens autorizadas:

```javascript
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
```

## 📱 Exemplos de Uso

### Exemplo 1: Criar um Chamado

```bash
curl -X POST http://localhost:8080/ticket \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Problema no Ar Condicionado",
    "descricao": "Ar condicionado da sala 203 não está funcionando",
    "tipo_id": 1
  }'
```

### Exemplo 2: Listar Chamados Pendentes

```bash
curl -X GET http://localhost:8080/ticket/status/pendente \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Exemplo 3: Atribuir Técnico a um Chamado

```bash
curl -X PUT http://localhost:8080/ticket/5/tecnico \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "tecnico_id": 8
  }'
```

## 🚨 Tratamento de Erros

### Formato de Erro Padrão

```json
{
  "mensagem": "Descrição do erro",
  "status": 400,
  "timestamp": "2024-12-01T16:00:00.000Z"
}
```

### Erros Comuns

#### 400 - Bad Request
```json
{
  "mensagem": "Campo obrigatório: titulo",
  "status": 400
}
```

#### 401 - Unauthorized
```json
{
  "mensagem": "Não autorizado: Token não fornecido"
}
```

#### 403 - Forbidden
```json
{
  "mensagem": "Usuário não tem permissão para esta operação"
}
```

#### 404 - Not Found
```json
{
  "message": "Chamado não encontrado"
}
```

#### 500 - Internal Server Error
```json
{
  "mensagem": "Erro interno do servidor",
  "status": 500
}
```

## 📚 Recursos Adicionais

### Documentação Swagger

Para uma experiência interativa da API, acesse:
```
http://localhost:8080/api-docs
```

### Postman Collection

Uma coleção do Postman está disponível em:
```
docs/postman_collection.json
```

### SDKs

- **JavaScript/Node.js**: Disponível via npm
- **Python**: Disponível via pip
- **PHP**: Disponível via Composer

---

**Referência da API Zelos**  
**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024 