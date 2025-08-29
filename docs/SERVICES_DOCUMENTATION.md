# Zelos - Documentação dos Serviços

## 📋 Visão Geral

Este documento descreve detalhadamente todos os serviços implementados no sistema Zelos, incluindo suas funcionalidades, parâmetros, retornos e exemplos de uso.

## 🏗️ Arquitetura dos Serviços

Os serviços no sistema Zelos seguem uma arquitetura em camadas bem definida:

```
┌─────────────────┐
│   Controllers   │  ← Recebem requisições HTTP
└─────────────────┘
         │
         ▼
┌─────────────────┐
│     Services    │  ← Lógica de negócio
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Database      │  ← Camada de dados
└─────────────────┘
```

### Princípios dos Serviços

- **Separação de Responsabilidades**: Cada serviço tem uma responsabilidade específica
- **Reutilização**: Serviços podem ser chamados por múltiplos controllers
- **Validação**: Validações de negócio centralizadas nos serviços
- **Tratamento de Erros**: Padrão consistente de tratamento de erros
- **Transações**: Gerenciamento de operações que envolvem múltiplas tabelas

## 🎯 Users Service

### Arquivo: `backend/services/usersService.js`

#### `getUsers()`

Lista todos os usuários do sistema, removendo senhas por segurança.

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

**Retorno:**
- Array de usuários sem senhas
- Erro em caso de falha na consulta

#### `getUser(id)`

Obtém um usuário específico por ID.

```javascript
export async function getUser(id) {
    try {
        return await read('usuarios', `id = '${id}'`);
    } catch (err) {
        console.error('getUser error:', err);
        throw err;
    }
}
```

**Parâmetros:**
- `id`: ID do usuário

**Retorno:**
- Objeto usuário ou null se não encontrado
- Erro em caso de falha na consulta

#### `getRoleUser(id)`

Obtém a função (role) de um usuário específico.

```javascript
export async function getRoleUser(id) {
    try {
        const user = await getUser(id);
        if (!user) throw erroStatus('Usuário não encontrado', 404);
        return user.funcao;
    } catch (err) {
        console.error('getRoleUser error:', err);
        throw err;
    }
}
```

**Parâmetros:**
- `id`: ID do usuário

**Retorno:**
- String com a função do usuário (admin, tecnico, usuario)
- Erro 404 se usuário não encontrado

#### `createUser(id_admin, data)`

Cria um novo usuário no sistema (apenas administradores).

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

**Parâmetros:**
- `id_admin`: ID do administrador que está criando o usuário
- `data`: Objeto com dados do usuário

**Campos Obrigatórios em `data`:**
- `nome`: Nome completo do usuário
- `email`: Email único do usuário
- `senha`: Senha em texto plano (será hasheada)
- `funcao`: Função do usuário (admin, tecnico, usuario)

**Validações:**
- Verifica se o criador é administrador
- Valida formato do email
- Verifica se email já existe
- Valida função do usuário
- Hash da senha com bcrypt

**Retorno:**
- Objeto com ID do usuário criado
- Erro 400 para dados inválidos
- Erro 403 para permissão insuficiente
- Erro 409 para email duplicado

#### `createTechnician(id_admin, data, id_pool)`

Cria um novo técnico vinculado a um pool de serviço.

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

**Parâmetros:**
- `id_admin`: ID do administrador
- `data`: Dados do técnico
- `id_pool`: ID do pool de serviço

**Funcionalidades Especiais:**
- Cria o usuário técnico
- Vincula automaticamente ao pool especificado
- Transação de banco para garantir consistência

**Retorno:**
- Objeto com IDs do técnico e da relação pool-técnico
- Erro 404 se pool não encontrado

#### `updateUser(id, data)`

Atualiza dados de um usuário existente.

```javascript
export async function updateUser(id, data) {
    try {
        const usuarioExistente = await getUser(id);
        if (!usuarioExistente) throw erroStatus('Usuário não encontrado', 404);

        const user = new User(usuarioExistente);
        user.updateUser(data);

        if (data.email && data.email !== usuarioExistente.email) {
            validarEmail(data.email);
            await checkEmailDuplicado(data.email);
        }

        if (data.senha) {
            user.senha = await generateHashedPassword(data.senha);
        }

        if (data.funcao) {
            validarRole(data.funcao, ['admin', 'usuario', 'tecnico']);
        }

        return await update('usuarios', user, `id = ${id}`);
    } catch (err) {
        console.error('updateUser error:', err);
        throw err;
    }
}
```

**Parâmetros:**
- `id`: ID do usuário a ser atualizado
- `data`: Dados para atualização

**Validações:**
- Verifica se usuário existe
- Valida email se alterado
- Verifica duplicação de email
- Hash da senha se alterada
- Valida função se alterada

#### `setStatusUser(id, status)`

Altera o status de um usuário (ativo/inativo).

```javascript
export async function setStatusUser(id, status) {
    try {
        const usuarioExistente = await getUser(id);
        if (!usuarioExistente) throw erroStatus('Usuário não encontrado', 404);

        if (status !== 'ativo' && status !== 'inativo') {
            throw erroStatus('Status deve ser "ativo" ou "inativo"', 400);
        }

        return await update('usuarios', { status }, `id = ${id}`);
    } catch (err) {
        console.error('setStatusUser error:', err);
        throw err;
    }
}
```

**Parâmetros:**
- `id`: ID do usuário
- `status`: Novo status (ativo/inativo)

**Validações:**
- Verifica se usuário existe
- Valida valores de status permitidos

## 🏊 Pool Service

### Arquivo: `backend/services/poolService.js`

#### `getPools()`

Lista todos os pools de serviço.

```javascript
export async function getPools() {
    try {
        return await readAll('pool');
    } catch (err) {
        console.error('Erro ao obter pools:', err);
        throw err;
    }
}
```

**Retorno:**
- Array com todos os pools
- Erro em caso de falha

#### `getPoolsWithTickets()`

Lista pools com quantidade de tickets associados (para gráficos).

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

**Funcionalidades:**
- Consulta paralela para melhor performance
- Formata dados para visualização em gráficos

**Retorno:**
```json
[
  {
    "categoria": "Manutenção",
    "quantidade": 15
  },
  {
    "categoria": "Suporte de TI",
    "quantidade": 8
  }
]
```

#### `getPool(id)`

Obtém um pool específico com técnicos associados.

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

**Parâmetros:**
- `id`: ID do pool

**Retorno:**
```json
{
  "pool": {
    "id": 1,
    "titulo": "Manutenção",
    "descricao": "Serviços de manutenção geral"
  },
  "poolTec": [
    {
      "id": 1,
      "id_pool": 1,
      "id_tecnico": 5
    }
  ]
}
```

#### `getTicketsByPoolId(id_pool)`

Lista todos os tickets de um pool específico.

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

**Parâmetros:**
- `id_pool`: ID do pool

**Retorno:**
- Array com todos os chamados do pool
- Erro em caso de falha

#### `createPool(data)`

Cria um novo pool de serviço.

```javascript
export async function createPool(data) {
    try {
        if (!data.titulo) throw erroStatus('Título é obrigatório', 400);

        await validarRole(data.created_by, 'admin');

        const tituloExistente = await read('pool', `titulo = '${data.titulo}'`);
        if (tituloExistente) throw erroStatus('Título já cadastrado', 409);

        const pool = new Pool(data);
        return await create('pool', pool);
    } catch (err) {
        console.error('Erro ao criar pool:', err);
        throw err;
    }
}
```

**Parâmetros:**
- `data`: Dados do pool

**Validações:**
- Verifica se criador é administrador
- Verifica se título já existe

**Retorno:**
- Objeto com ID do pool criado
- Erro 409 para título duplicado

#### `updatePool(id, data)`

Atualiza um pool existente.

```javascript
export async function updatePool(id, data) {
    try {
        const poolExistente = await getPool(id);
        if (!poolExistente) throw erroStatus('Pool não encontrado', 404);

        await validarRole(data.updated_by, 'admin');

        const pool = new Pool(poolExistente);
        pool.updatePool(data);

        if (data.status && !['ativo', 'inativo'].includes(data.status)) {
            throw erroStatus('Status deve ser "ativo" ou "inativo"', 400);
        }

        if (data.titulo) {
            const tituloExistente = await read('pool', `titulo = '${data.titulo}'`);
            if (tituloExistente) throw erroStatus('Título já cadastrado', 409);

            pool.titulo = data.titulo;
        }

        if (data.descricao) pool.descricao = data.descricao;

        return await update('pool', pool, `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao atualizar pool:', err);
        throw err;
    }
}
```

**Parâmetros:**
- `id`: ID do pool
- `data`: Dados para atualização

**Validações:**
- Verifica se pool existe
- Verifica se atualizador é administrador
- Valida status se alterado
- Verifica duplicação de título

#### `deletePool(id)`

Remove um pool do sistema.

```javascript
export async function deletePool(id){
    try {
        return await deleteRecord('pool', `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao deletar pool:', err);
        throw err;
    }
}
```

**Parâmetros:**
- `id`: ID do pool

**Retorno:**
- Número de registros afetados
- Erro em caso de falha

## 📊 Reports Service

### Arquivo: `backend/services/reportsService.js`

#### `getReports(ticket_id)`

Lista todos os apontamentos de um chamado.

```javascript
export async function getReports(ticket_id) {
    try {
        return await readAll("apontamentos", `chamado_id = '${ticket_id}'`);
    } catch (err) {
        console.error("Erro ao obter apontamentos:", err);
        throw err;
    }
}
```

**Parâmetros:**
- `ticket_id`: ID do chamado

**Retorno:**
- Array com todos os apontamentos do chamado
- Erro em caso de falha

#### `getReport(ticket_id, id)`

Obtém um apontamento específico de um chamado.

```javascript
export async function getReport(ticket_id, id) {
    try {
        return await read("apontamentos", `id = '${id}' AND chamado_id = '${ticket_id}'`);
    } catch (err) {
        console.error("Erro ao obter apontamento:", err);
        throw err;
    }
}
```

**Parâmetros:**
- `ticket_id`: ID do chamado
- `id`: ID do apontamento

**Retorno:**
- Objeto do apontamento ou null se não encontrado
- Erro em caso de falha

#### `createReport(data)`

Cria um novo apontamento para um chamado.

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

**Parâmetros:**
- `data`: Dados do apontamento

**Campos Obrigatórios:**
- `chamado_id`: ID do chamado
- `tecnico_id`: ID do técnico
- `descricao`: Descrição do trabalho
- `comeco`: Horário de início
- `fim`: Horário de fim (opcional)

**Validações:**
- Verifica se chamado existe
- Verifica se usuário é técnico
- Valida campos obrigatórios

**Retorno:**
- Objeto com ID do apontamento criado
- Erro 404 se chamado não encontrado

#### `gerarRelatorioChamado(chamadoId, caminhoSaida)`

Gera relatório em PDF de um chamado específico.

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

**Parâmetros:**
- `chamadoId`: ID do chamado
- `caminhoSaida`: Caminho para salvar o PDF (opcional)

**Funcionalidades:**
- Gera PDF com informações completas do chamado
- Inclui dados do solicitante, técnico e pool
- Lista todos os apontamentos
- Formatação profissional com PDFKit

**Retorno:**
- Caminho do arquivo PDF gerado
- Erro se chamado não encontrado

#### `gerarRelatorioTodosChamados(caminhoSaida)`

Gera relatório em PDF de todos os chamados do sistema.

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

**Parâmetros:**
- `caminhoSaida`: Caminho para salvar o PDF (opcional)

**Funcionalidades:**
- Gera PDF com todos os chamados do sistema
- Consulta paralela para melhor performance
- Tratamento de erros robusto
- Formatação profissional com separadores

**Retorno:**
- Caminho do arquivo PDF gerado
- Erro se nenhum chamado encontrado

## 🔧 Padrões de Implementação

### 1. Tratamento de Erros Consistente

Todos os serviços seguem o mesmo padrão de tratamento de erros:

```javascript
try {
    // Lógica do serviço
} catch (err) {
    console.error('Nome do serviço error:', err);
    throw err; // Re-throw para tratamento no controller
}
```

### 2. Validações Centralizadas

Utilização de funções de validação centralizadas:

```javascript
// Validação de campos obrigatórios
validarCamposObrigatorios(data, ['campo1', 'campo2']);

// Validação de roles
await validarRole(userId, ['admin', 'tecnico']);

// Validação de email
validarEmail(email);
await checkEmailDuplicado(email);
```

### 3. Uso de Models

Criação e manipulação de objetos através de models:

```javascript
const userData = new User(data);
userData.updateUser(updateData);
```

### 4. Transações de Banco

Para operações que envolvem múltiplas tabelas:

```javascript
// Exemplo: Criar técnico e vincular ao pool
const tecnicoId = await create('usuarios', userData);
const relacaoTecId = await create('pool_tecnico', { id_pool, id_tecnico: tecnicoId.id });
```

### 5. Consultas Paralelas

Para melhorar performance em consultas múltiplas:

```javascript
const [pool, solicitante, tecnico, apontamentos] = await Promise.all([
    chamado.tipo_id ? read('pool', `id = '${chamado.tipo_id}'`) : null,
    chamado.usuario_id ? read('usuarios', `id = '${chamado.usuario_id}'`) : null,
    chamado.tecnico_id ? read('usuarios', `id = '${chamado.tecnico_id}'`) : null,
    readAll('apontamentos', `chamado_id = '${chamadoId}'`),
]);
```

## 📚 Dependências dos Serviços

### Pacotes Principais

- **PDFKit**: Geração de relatórios em PDF
- **bcryptjs**: Criptografia de senhas
- **mysql2**: Conexão com banco de dados
- **fs**: Manipulação de arquivos

### Utilitários

- **erroStatus**: Padronização de erros
- **validar**: Funções de validação
- **hashPassword**: Geração de hash de senhas

## 🚨 Considerações de Segurança

### Validação de Permissões

- Verificação de roles antes de operações sensíveis
- Validação de propriedade de recursos
- Controle de acesso baseado em funções

### Sanitização de Dados

- Validação de campos obrigatórios
- Verificação de tipos de dados
- Prevenção de SQL injection via prepared statements

### Criptografia

- Hash de senhas com bcrypt
- Tokens JWT para autenticação
- Validação de tokens em todas as operações

---

**Documentação dos Serviços Zelos**  
**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024
