import { read, readAll, create, update } from '../config/database.js';
import { User } from '../model/User.js';
import { getPool } from './poolService.js';
import erroStatus from '../utils/erroStatus.js';
import { generateHashedPassword } from '../hashPassword.js';
import { validarEmail, validarRole, checkEmailDuplicado } from '../utils/validar.js';

// Buscar todos os usuários
export async function getUsers() {
    try {
        const users = await readAll('usuarios');
        for (const user of users) {
            user.senha = undefined;
            user.id = undefined;
        }
        return users;
    } catch (err) {
        console.error('getUsers error:', err);
        throw err;
    }
}

// Buscar usuário pelo ID
export async function getUser(id) {
    try {
        return await read('usuarios', `id = '${id}'`);
    } catch (err) {
        console.error('getUser error:', err);
        throw err;
    }
}

// Buscar função (role) do usuário
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

// Criar um usuário (somente admin pode criar)
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

// Criar técnico vinculado a um pool
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

// Atualizar usuário
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

// Alterar status do usuário (ativo/inativo)
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
