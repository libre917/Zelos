import { read, readAll, create, update } from '../config/database.js';
import { User } from '../model/User.js';
import { getPool } from './poolService.js';
import erroStatus from '../utils/erroStatus.js';
import { generateHashedPassword } from '../hashPassword.js';
import { validarEmail, validarRole, checkEmailDuplicado } from '../utils/validar.js';

// Buscar todos os usuários
export async function getUsers() {
    const users = await readAll('usuarios');
    for (const user of users) {
        user.senha = undefined;
        user.id = undefined; 
    }
    return users;
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

    validarEmail(userData.email);
    validarRole(userData.funcao, ['admin', 'usuario', 'tecnico']);
    await checkEmailDuplicado(userData.email);

    userData.senha = await generateHashedPassword(userData.senha);

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

    validarEmail(userData.email);
    validarRole(userData.funcao, ['tecnico']);
    await checkEmailDuplicado(userData.email);

    userData.senha = await generateHashedPassword(userData.senha);

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
