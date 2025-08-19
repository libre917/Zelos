import { read, readAll, create, update } from '../config/database.js';
import { User } from '../model/User.js';
import { getPool } from './poolService.js';
import erroStatus from '../utils/erroStatus.js';
import { generateHashedPassword } from '../hashPassword.js';

// HELPERS

// Verifica se email é válido
function validateEmail(email) {
    if (!email || !email.includes('@')) {
        throw erroStatus('Email inválido', 400);
    }
}

// Verifica se a função é válida
function validateRole(funcao, funcoesValidas) {
    if (!funcoesValidas.includes(funcao)) {
        throw erroStatus('Função inválida', 400);
    }
}

// Verifica se email já está cadastrado
async function checkDuplicateEmail(email) {
    const emailExistente = await read('usuarios', `email = '${email}'`);
    if (emailExistente) {
        throw erroStatus('Email já cadastrado', 409);
    }
}

// Hash da senha (se houver)
async function processPassword(senha) {
    if (!senha) return null;
    return await generateHashedPassword(senha);
}

// SERVICES 

// Buscar todos os usuários
export async function getUsers() {
    return await readAll('usuarios');
}

// Buscar usuário pelo ID
export async function getUser(id) {
    return await read('usuarios', `id = '${id}'`);
}

// Buscar função (role) do usuário
export async function getRoleUser(id) {
    const user = await getUser(id);
    if (!user) throw erroStatus('Usuário não encontrado', 404);
    return user.funcao;
}

// Criar um usuário (somente admin pode criar)
export async function createUser(id_admin, data) {
    if (!id_admin) throw erroStatus('ID do administrador é obrigatório', 400);

    const userRole = await getRoleUser(id_admin);
    if (userRole !== 'admin') throw erroStatus('Apenas administradores podem criar usuários', 403);

    if (!data.nome || !data.email || !data.senha || !data.funcao) {
        throw erroStatus('Nome, email, senha e função obrigatórios', 400);
    }

    const userData = new User(data);

    validateEmail(userData.email);
    validateRole(userData.funcao, ['admin', 'usuario', 'tecnico']);
    await checkDuplicateEmail(userData.email);

    userData.senha = await processPassword(userData.senha);

    return await create('usuarios', userData);
}

// Criar técnico vinculado a um pool
export async function createTechnician(id_admin, data, id_pool) {
    if (!id_admin) throw erroStatus('ID do administrador é obrigatório', 400);

    const userRole = await getRoleUser(id_admin);
    if (userRole !== 'admin') throw erroStatus('Apenas administradores podem criar técnicos', 403);

    const poolExistente = await getPool(id_pool);
    if (!poolExistente) throw erroStatus('Pool não encontrado', 404);

    if (!data.nome || !data.email || !data.senha || !data.funcao) {
        throw erroStatus('Nome, email, senha e função obrigatórios', 400);
    }

    const userData = new User(data);

    validateEmail(userData.email);
    validateRole(userData.funcao, ['tecnico']);
    await checkDuplicateEmail(userData.email);

    userData.senha = await processPassword(userData.senha);

    const tecnicoId = await create('usuarios', userData);

    const relacaoTecId = await create('pool_tecnico', { id_pool, id_tecnico: tecnicoId.id });

    return { relacaoTecId, tecnicoId };
}

// Atualizar usuário
export async function updateUser(id, data) {
    const usuarioExistente = await getUser(id);
    if (!usuarioExistente) throw erroStatus('Usuário não encontrado', 404);

    const user = new User(usuarioExistente);
    user.updateUser(data);

    if (data.email && data.email !== usuarioExistente.email) {
        validateEmail(data.email);
        await checkDuplicateEmail(data.email);
    }

    if (data.senha) {
        user.senha = await processPassword(data.senha);
    }

    if (data.funcao) {
        validateRole(data.funcao, ['admin', 'usuario', 'tecnico']);
    }

    return await update('usuarios', user, `id = ${id}`);
}

// Alterar status do usuário (ativo/inativo)
export async function setStatusUser(id, status) {
    const usuarioExistente = await getUser(id);
    if (!usuarioExistente) throw erroStatus('Usuário não encontrado', 404);

    if (status !== 'ativo' && status !== 'inativo') {
        throw erroStatus('Status deve ser "ativo" ou "inativo"', 400);
    }

    return await update('usuarios', { status }, `id = ${id}`);
}
