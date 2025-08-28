# Zelos - Documentação Técnica do Backend

## 📋 Visão Geral

Este documento contém informações técnicas detalhadas sobre a implementação do backend do sistema Zelos, incluindo arquitetura, padrões de código, configurações e detalhes de implementação.

## 🏗️ Arquitetura do Backend

### Estrutura em Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    Controllers                          │
│              (Lógica de Controle)                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     Services                            │
│              (Lógica de Negócio)                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Models                             │
│              (Entidades de Dados)                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Database Layer                        │
│              (MySQL + Connection Pool)                 │
└─────────────────────────────────────────────────────────┘
```

### Padrões de Design

- **MVC (Model-View-Controller)**: Separação clara de responsabilidades
- **Repository Pattern**: Abstração da camada de dados
- **Service Layer**: Lógica de negócio isolada
- **Middleware Pattern**: Processamento de requisições em cadeia

## 🔧 Configuração do Sistema

### Arquivo Principal: `app.js`

```javascript
// Configuração básica do Express
const app = express();
const porta = process.env.PORT || 8080;

// Middlewares essenciais
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: 'sJYMmuCB2Z187XneUuaOVYTVUlxEOb2K94tFZy370HjOY7T7aiCKvwhNQpQBYL9e',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());
```

### Configuração de Banco de Dados: `config/database.js`

```javascript
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

**Características do Pool:**
- **Connection Limit**: Máximo de 10 conexões simultâneas
- **Queue Limit**: Sem limite para fila de conexões
- **Wait for Connections**: Aguarda conexões disponíveis

### Configuração LDAP: `config/ldap.js`

```javascript
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

## 🗄️ Camada de Dados

### Funções de Banco de Dados

#### `readAll(table, where = null)`
```javascript
async function readAll(table, where = null) {
    const connection = await getConnection();
    try {
        let sql = `SELECT * FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }
        const [rows] = await connection.execute(sql);
        return rows;
    } finally {
        connection.release();
    }
}
```

#### `create(table, data)`
```javascript
async function create(table, data) {
    const connection = await getConnection();
    try {
        const columns = Object.keys(data).join(', ');
        const placeholders = Array(Object.keys(data).length).fill('?').join(', ');
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        const values = Object.values(data);
        const [result] = await connection.execute(sql, values);
        return {id: result.insertId};
    } finally {
        connection.release();
    }
}
```

#### `update(table, data, where)`
```javascript
async function update(table, data, where) {
    const connection = await getConnection();
    try {
        const set = Object.keys(data)
            .map(column => `${column} = ?`)
            .join(', ');
        const sql = `UPDATE ${table} SET ${set} WHERE ${where}`;
        const values = Object.values(data);
        const [result] = await connection.execute(sql, [...values]);
        return result.affectedRows;
    } finally {
        connection.release();
    }
}
```

### Gerenciamento de Conexões

- **Connection Pool**: Reutilização eficiente de conexões
- **Auto-release**: Conexões são liberadas automaticamente após uso
- **Error Handling**: Tratamento robusto de erros de conexão

## 🔐 Sistema de Autenticação

### JWT (JSON Web Token)

#### Geração de Token
```javascript
const token = jwt.sign(
    { id: usuario.id, tipo: usuario.tipo }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' }
);
```

#### Validação de Token
```javascript
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

### Criptografia de Senhas

```javascript
// Hash de senha
const senhaHash = await bcrypt.hash(senha, 10);

// Comparação de senha
const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
```

### Sessões Express

```javascript
app.use(session({
    secret: 'sJYMmuCB2Z187XneUuaOVYTVUlxEOb2K94tFZy370HjOY7T7aiCKvwhNQpQBYL9e',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));
```

## 🚦 Controle de Rotas

### Estrutura de Rotas

#### Autenticação
```javascript
// authRotas.js
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/check', checkAuth);
```

#### Chamados (Protegidas)
```javascript
// ticketRotas.js
router.get('/', getTicketsController);
router.get('/:id', getTicketController);
router.post('/', createTicketController);
router.put('/:id/tecnico', setTechnicianToTicketController);
router.get('/user', getTicketsByUserController);
router.get('/status/:status', getTicketsByStatusController);
router.get('/tecnico/:id', getTicketsByTechnicianController);
```

#### Usuários
```javascript
// userRotas.js
router.get('/', getUsersController);
router.get('/:id', getUserController);
router.post('/', createUserController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);
```

### Middleware de Autenticação

Todas as rotas de chamados e pools são protegidas pelo `authMiddleware`:

```javascript
app.use('/ticket', authMiddleware, ticketRotas);
app.use('/pool', authMiddleware, poolRotas);
```

## 🎯 Camada de Serviços

### Tickets Service

#### `createTicket(data)`
```javascript
export async function createTicket(data) {
    try {
        // Validações
        validarCamposObrigatorios(data, ['titulo', 'descricao', 'usuario_id', 'tipo_id']);
        
        const ticketData = new Ticket(data);
        validarStatus(ticketData.status);
        
        // Validação de role
        await validarRole(ticketData.usuario_id, ['usuario', 'Usuário', 'admin']);
        
        // Validação de tipo
        if (ticketData.tipo_id) {
            const tipoExistente = await read('pool', `id = '${ticketData.tipo_id}'`);
            if (!tipoExistente) {
                throw erroStatus('Tipo de chamado inválido', 400);
            }
        }
        
        return await create('chamados', ticketData);
    } catch (err) {
        console.error('Erro ao criar chamado:', err);
        throw err;
    }
}
```

#### `setTechnicianToTicket(ticketId, technicianId)`
```javascript
export async function setTechnicianToTicket(ticketId, technicianId) {
    try {
        validarCamposObrigatorios({ ticketId, technicianId }, ['ticketId', 'technicianId']);
        
        const ticket = await getTicket(ticketId);
        if (!ticket) {
            throw erroStatus('Chamado não encontrado', 404);
        }
        
        // Validação de pool de técnico
        const [pool] = await getPoolTechniciansById(ticket.tipo_id, technicianId);
        if (!pool) {
            throw erroStatus('Técnico não autorizado para este tipo de chamado', 403);
        }
        
        const response = await update(
            'chamados',
            { tecnico_id: technicianId, status: 'em andamento' },
            `id = '${ticketId}'`
        );
        return response;
    } catch (err) {
        console.error('Erro ao atribuir técnico ao chamado:', err);
        throw err;
    }
}
```

### Users Service

#### `getRoleUser(userId)`
```javascript
export async function getRoleUser(userId) {
    try {
        const user = await read('usuarios', `id = '${userId}'`);
        return user ? user.funcao : null;
    } catch (err) {
        console.error('Erro ao obter role do usuário:', err);
        throw err;
    }
}
```

## 🛡️ Validações e Segurança

### Validação de Campos Obrigatórios

```javascript
export function validarCamposObrigatorios(data, camposObrigatorios) {
    for (const campo of camposObrigatorios) {
        if (!data[campo] || data[campo].toString().trim() === '') {
            throw erroStatus(`Campo obrigatório: ${campo}`, 400);
        }
    }
}
```

### Validação de Status

```javascript
export function validarStatus(status) {
    const statusValidos = ['pendente', 'em andamento', 'concluído'];
    if (status && !statusValidos.includes(status)) {
        throw erroStatus(`Status inválido: ${status}`, 400);
    }
}
```

### Validação de Roles

```javascript
export async function validarRole(userId, rolesPermitidos) {
    const user = await read('usuarios', `id = '${userId}'`);
    if (!user) {
        throw erroStatus('Usuário não encontrado', 404);
    }
    
    if (!rolesPermitidos.includes(user.funcao)) {
        throw erroStatus('Usuário não tem permissão para esta operação', 403);
    }
}
```

## 📊 Geração de Relatórios

### PDF Generation com PDFKit

```javascript
import PDFDocument from 'pdfkit';

export async function generateReport(data) {
    const doc = new PDFDocument();
    
    // Cabeçalho
    doc.fontSize(20).text('Relatório de Chamados', { align: 'center' });
    doc.moveDown();
    
    // Dados dos chamados
    data.chamados.forEach(chamado => {
        doc.fontSize(14).text(`Chamado #${chamado.id}: ${chamado.titulo}`);
        doc.fontSize(12).text(`Status: ${chamado.status}`);
        doc.fontSize(12).text(`Criado em: ${chamado.criado_em}`);
        doc.moveDown();
    });
    
    return doc;
}
```

## 🔍 Tratamento de Erros

### Sistema de Erros Personalizado

```javascript
// utils/erroStatus.js
export default function erroStatus(mensagem, status) {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
}
```

### Tratamento Global de Erros

```javascript
// app.js
process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Exceção não capturada:', err);
    process.exit(1);
});
```

### Tratamento de Erros nos Controllers

```javascript
export async function getTicketsController(req, res) {
    try {
        const tickets = await getTickets();
        res.status(200).json(tickets);
    } catch (err) {
        console.error('Erro ao buscar chamados:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}
```

## 🔄 Inicialização do Sistema

### Criação Automática de Admin

```javascript
// app.js - Inicialização automática
(async () => {
    const existAdmin = await readAll('usuarios', `funcao = 'admin'`);
    
    if (!existAdmin || existAdmin.length === 0) {
        const senhaHash = await generateHashedPassword('admin@123');
        const adminCriado = await create('usuarios', {
            nome: 'admin',
            senha: senhaHash,
            email: 'admin@email.com',
            funcao: 'admin',
        });
        console.log('admin criado para funcionamento inicial da aplicação');
    }
})();
```

### Verificação de Dependências

```javascript
// Verificação do Passport
if (!passport) {
    throw new Error('Passport não foi importado corretamente');
}
```

## 📈 Performance e Otimização

### Connection Pool MySQL

- **Reutilização de conexões**: Evita overhead de abertura/fechamento
- **Limite de conexões**: Previne sobrecarga do banco
- **Queue management**: Gerencia filas de conexões eficientemente

### Índices de Banco

```sql
-- Índices para otimização
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);
```

### Validações Assíncronas

```javascript
// Validações em paralelo quando possível
const [pool, solicitante, tecnico, apontamentos] = await Promise.all([
    chamado.tipo_id ? read('pool', `id = '${chamado.tipo_id}'`) : null,
    chamado.usuario_id ? read('usuarios', `id = '${chamado.usuario_id}'`) : null,
    chamado.tecnico_id ? read('usuarios', `id = '${chamado.tecnico_id}'`) : null,
    readAll('apontamentos', `chamado_id = '${chamadoId}'`),
]);
```

## 🔧 Configurações de Desenvolvimento

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

### Scripts de Desenvolvimento

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## 🚨 Troubleshooting Técnico

### Problemas de Conexão com Banco

1. **Verificar se MySQL está rodando**
2. **Validar credenciais no arquivo de configuração**
3. **Verificar se banco `zelos` existe**
4. **Testar conectividade: `mysql -u root -p -h localhost`**

### Problemas de Autenticação

1. **Verificar se `JWT_SECRET` está definido**
2. **Validar formato do token no header Authorization**
3. **Verificar expiração do token**
4. **Validar integridade do token**

### Problemas de LDAP

1. **Verificar conectividade de rede**
2. **Validar configurações LDAP**
3. **Testar via rede cabeada ou WiFi B07**
4. **Verificar logs de erro do servidor LDAP**

## 📚 Recursos Adicionais

### Dependências Principais

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "cross-env": "^7.0.3",
    "dotenv": "^17.2.0",
    "express": "^5.1.0",
    "express-session": "^1.18.1",
    "jsonwebtoken": "^9.0.2",
    "ldapjs": "^3.0.7",
    "multer": "^1.4.5-lts.2",
    "mysql2": "^3.14.1",
    "passport": "^0.7.0",
    "passport-ldapauth": "^3.0.1",
    "pdfkit": "^0.17.1"
  }
}
```

### Versões Recomendadas

- **Node.js**: >= 14.x
- **MySQL**: >= 8.0
- **npm**: >= 6.x

---

**Documento Técnico do Backend Zelos**  
**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024 