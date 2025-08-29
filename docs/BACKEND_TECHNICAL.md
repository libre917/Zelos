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

## 🎯 Camada de Serviços Detalhada

### Users Service (`backend/services/usersService.js`)

#### `getUsers()`
```javascript
export async function getUsers() {
    try {
        const users = await readAll('usuarios');
        for (const user of users) {
            user.senha = undefined; // Remove senha por segurança
        }
        return users;
    } catch (err) {
        console.error('getUsers error:', err);
        throw err;
    }
}
```

#### `createUser(id_admin, data)`
```javascript
export async function createUser(id_admin, data) {
    try {
        if (!id_admin) throw erroStatus('ID do administrador é obrigatório', 400);

        const userRole = await getRoleUser(id_admin);
        if (userRole !== 'admin') throw erroStatus('Apenas administradores podem criar usuários', 403);

        if (!data.nome || !data.email || !data.senha || !data.funcao) {
            throw erroStatus('Nome, email, senha e função obrigatórios', 400);
        }

        const userData = new User(data);

        validarEmail(userData.email);
        validarRole(userData.funcao, ['admin', 'usuario', 'tecnico']);
        await checkEmailDuplicado(userData.email);

        userData.senha = await generateHashedPassword(userData.senha);

        return await create('usuarios', userData);
    } catch (err) {
        console.error('createUser error:', err);
        throw err;
    }
}
```

#### `createTechnician(id_admin, data, id_pool)`
```javascript
export async function createTechnician(id_admin, data, id_pool) {
    try {
        if (!id_admin) throw erroStatus('ID do administrador é obrigatório', 400);

        const userRole = await getRoleUser(id_admin);
        if (userRole !== 'admin') throw erroStatus('Apenas administradores podem criar técnicos', 403);

        const poolExistente = await getPool(id_pool);
        if (!poolExistente) throw erroStatus('Pool não encontrado', 404);

        if (!data.nome || !data.email || !data.senha || !data.funcao) {
            throw erroStatus('Nome, email, senha e função obrigatórios', 400);
        }

        const userData = new User(data);

        validarEmail(userData.email);
        validarRole(userData.funcao, ['tecnico']);
        await checkEmailDuplicado(userData.email);

        userData.senha = await generateHashedPassword(userData.senha);

        const tecnicoId = await create('usuarios', userData);

        const relacaoTecId = await create('pool_tecnico', { id_pool, id_tecnico: tecnicoId.id });

        return { relacaoTecId, tecnicoId };
    } catch (err) {
        console.error('createTechnician error:', err);
        throw err;
    }
}
```

### Pool Service (`backend/services/poolService.js`)

#### `getPoolsWithTickets()`
```javascript
export async function getPoolsWithTickets() {
    try {
        const pools = await readAll('pool');
        const categoryPromises = pools.map(async (pool) => {
            const tickets = await readAll('chamados', `tipo_id = '${pool.id}'`);
            return {
                categoria: pool.titulo,
                quantidade: tickets.length,
            };
        });
        const dadosDoGrafico = await Promise.all(categoryPromises);
        return dadosDoGrafico;
    } catch (err) {
        console.error('Erro ao obter pools:', err);
        throw err;
    }
}
```

#### `getPool(id)`
```javascript
export async function getPool(id) {
    try {
        const pool = await read('pool', `id = '${id}'`);
        const poolTec = await readAll('pool_tecnico', `id_pool = '${id}'`);
        return { pool, poolTec };
    } catch (err) {
        console.error('Erro ao obter pool:', err);
        throw err;
    }
}
```

#### `getTicketsByPoolId(id_pool)`
```javascript
export const getTicketsByPoolId = async (id_pool) => {
    try {
        return await readAll('chamados', `tipo_id = '${id_pool}'`);
    } catch (err) {
        console.error('Erro ao obter tickets da pool:', err);
        throw err;
    }
};
```

### Reports Service (`backend/services/reportsService.js`)

#### `createReport(data)`
```javascript
export async function createReport(data) {
    try {
        // Validação de obrigatórios
        validarCamposObrigatorios(data, ["chamado_id", "tecnico_id", "descricao", "comeco", "fim"]);

        // Verifica se o chamado existe
        const chamadoExistente = await getTicket(data.chamado_id);
        if (!chamadoExistente) {
            throw erroStatus("Chamado não encontrado", 404);
        }

        // Verifica se o usuário é técnico
        await validarRole(data.tecnico_id, "tecnico");

        // Cria o apontamento
        const report = new Report(data);
        return await create("apontamentos", report);

    } catch (err) {
        console.error("Erro ao criar apontamento:", err);
        throw err;
    }
}
```

#### `gerarRelatorioChamado(chamadoId, caminhoSaida)`
```javascript
export async function gerarRelatorioChamado(chamadoId, caminhoSaida = `relatorio-${chamadoId}.pdf`) {
    const record = await getRecord(chamadoId);
    if (!record) {
        throw new Error("Chamado não encontrado");
    }

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(caminhoSaida));

    // Cabeçalho
    doc.fontSize(20).text("Relatório de Chamado", { align: "center" });
    doc.moveDown();

    // Dados do chamado
    doc.fontSize(14).text(`ID: ${record.chamado.id}`);
    doc.text(`Título: ${record.chamado.titulo}`);
    doc.text(`Descrição: ${record.chamado.descricao}`);
    doc.text(`Status: ${record.chamado.status}`);
    doc.text(`Criado em: ${new Date(record.chamado.criado_em).toLocaleString()}`);
    doc.moveDown();

    // Solicitante
    if (record.solicitante) {
        doc.fontSize(16).text("Solicitante:", { underline: true });
        doc.fontSize(12).text(`Nome: ${record.solicitante.nome}`);
        doc.text(`Email: ${record.solicitante.email}`);
        doc.moveDown();
    }

    // Técnico
    if (record.tecnico) {
        doc.fontSize(16).text("Técnico:", { underline: true });
        doc.fontSize(12).text(`Nome: ${record.tecnico.nome}`);
        doc.text(`Email: ${record.tecnico.email}`);
        doc.moveDown();
    }

    // Pool
    if (record.pool) {
        doc.fontSize(16).text("Tipo de Chamado:", { underline: true });
        doc.fontSize(12).text(`Título: ${record.pool.titulo}`);
        doc.text(`Descrição: ${record.pool.descricao}`);
        doc.moveDown();
    }

    // Apontamentos
    if (record.apontamentos.length > 0) {
        doc.fontSize(16).text("Apontamentos:", { underline: true });
        record.apontamentos.forEach((a, i) => {
            doc.fontSize(12).text(
                `${i + 1}. ${a.descricao} (Início: ${a.comeco}, Fim: ${a.fim}, Duração: ${a.duracao}min)`
            );
        });
    }

    // Finaliza o PDF
    doc.end();

    return caminhoSaida;
}
```

#### `gerarRelatorioTodosChamados(caminhoSaida)`
```javascript
export async function gerarRelatorioTodosChamados(caminhoSaida = "relatorio-chamados.pdf") {
  const ticketsRaw = await getTickets();

  // Normaliza possíveis formatos ({ rows: [...] } ou já array)
  const tickets = Array.isArray(ticketsRaw)
    ? ticketsRaw
    : (ticketsRaw?.rows ?? []);

  if (!isNonEmptyArray(tickets)) {
    throw new Error("Nenhum chamado encontrado");
  }

  // Busca todos os records em paralelo (mais rápido)
  const records = await Promise.all(
    tickets.map(t =>
      getRecord(t.id).catch(() => null) // evita quebrar o PDF por 1 registro com erro
    )
  );

  const doc = new PDFDocument({ margin: 50 });
  const out = fs.createWriteStream(caminhoSaida);
  doc.pipe(out);

  // Título principal
  doc.fontSize(22).text("Relatório de Chamados", { align: "center" });
  doc.moveDown(2);

  for (const record of records) {
    if (!record || !record.chamado) continue;

    doc.fontSize(16).text(`Chamado #${record.chamado.id}`, { underline: true });
    doc.moveDown(0.5);

    // Dados básicos
    doc.fontSize(12).text(`Título: ${record.chamado.titulo ?? "-"}`);
    doc.text(`Descrição: ${record.chamado.descricao ?? "-"}`);
    doc.text(`Status: ${record.chamado.status ?? "-"}`);
    const criadoEm = record.chamado.criado_em
      ? new Date(record.chamado.criado_em).toLocaleString()
      : "-";
    doc.text(`Criado em: ${criadoEm}`);
    doc.moveDown(0.5);

    // Solicitante
    if (record.solicitante) {
      doc.text(`Solicitante: ${record.solicitante.nome ?? "-"} (${record.solicitante.email ?? "-"})`);
    }

    // Técnico
    if (record.tecnico) {
      doc.text(`Técnico: ${record.tecnico.nome ?? "-"} (${record.tecnico.email ?? "-"})`);
    }

    // Pool
    if (record.pool) {
      doc.text(`Tipo: ${record.pool.titulo ?? "-"} - ${record.pool.descricao ?? "-"}`);
    }

    doc.moveDown(0.5);

    // Apontamentos
    if (isNonEmptyArray(record.apontamentos)) {
      doc.text("Apontamentos:");
      record.apontamentos.forEach((a, i) => {
        const inicio = a.comeco ?? "-";
        const fim = a.fim ?? "-";
        const dur = a.duracao ?? "-";
        doc.text(`  ${i + 1}. ${a.descricao ?? "-"} | Início: ${inicio} | Fim: ${fim} | Duração: ${dur} min`);
      });
    }

    // Linha separadora (respeita largura da página/margens)
    doc.moveDown(1);
    const left = doc.page.margins.left;
    const right = doc.page.width - doc.page.margins.right;
    doc.moveTo(left, doc.y).lineTo(right, doc.y).stroke();
    doc.moveDown(1);
  }

  // Finaliza e aguarda terminar a escrita do arquivo
  doc.end();

  await new Promise((resolve, reject) => {
    out.on("finish", resolve);
    out.on("error", reject);
  });

  return caminhoSaida;
}
```

### Padrões de Implementação dos Serviços

#### 1. Tratamento de Erros Consistente
```javascript
try {
    // Lógica do serviço
} catch (err) {
    console.error('Nome do serviço error:', err);
    throw err; // Re-throw para tratamento no controller
}
```

#### 2. Validações Centralizadas
```javascript
// Validação de campos obrigatórios
validarCamposObrigatorios(data, ['campo1', 'campo2']);

// Validação de roles
await validarRole(userId, ['admin', 'tecnico']);

// Validação de email
validarEmail(email);
await checkEmailDuplicado(email);
```

#### 3. Uso de Models
```javascript
const userData = new User(data);
userData.updateUser(updateData);
```

#### 4. Transações de Banco
```javascript
// Para operações que envolvem múltiplas tabelas
const tecnicoId = await create('usuarios', userData);
const relacaoTecId = await create('pool_tecnico', { id_pool, id_tecnico: tecnicoId.id });
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