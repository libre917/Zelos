import { read, readAll, create, update } from '../config/database.js';
import { User } from '../model/User.js';
import { generateHashedPassword } from '../hashPassword.js';
import { getPool } from './poolService.js';
import erroStatus from '../utils/erroStatus.js';

export async function getUsers() {
    try {
        return await readAll('usuarios');
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        throw err;
    }
}

export async function getUser(id) {
    try {
        return await read('usuarios', `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        throw err;
    }
}

export async function getRoleUser(id) {
    try {
        const user = await getUser(id);
        if (!user) {
            throw erroStatus('Usuário não encontrado', 404);
        }
        return user.funcao;
    } catch (err) {
        console.error('Erro ao buscar função do usuário:', err);
        throw err;
    }
}

export async function createUser(id_admin, data) {
    try {
        if (!id_admin) {
            throw erroStatus('ID do administrador é obrigatório', 400);
        }
        const userRole = await getRoleUser(id_admin);
        if (userRole !== 'admin') {
            throw erroStatus('Apenas administradores podem criar usuários', 403);
        }
        if (!data.nome || !data.email || !data.senha || !data.funcao) {
            throw erroStatus('Nome, email, senha e função obrigatórios', 400);
        }
        let userData = new User(data);
        if (!userData.email.includes('@')) {
            throw erroStatus('Email inválido', 400);
        }
        const funcoesValidas = ['admin', 'usuario'];
        if (!funcoesValidas.includes(userData.funcao)) {
            throw erroStatus('Função inválida', 400);
        }
        const emailExistente = await read('usuarios', `email = '${userData.email}'`);
        if (emailExistente) {
            throw erroStatus('Email já cadastrado', 409);
        }

        userData.senha = await generateHashedPassword(userData.senha);

        return await create('usuarios', userData);
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        throw err;
    }
}

export async function createTechnician(id_admin, data, id_pool) {
    try {
        if (!id_admin) {
            throw erroStatus('ID do administrador é obrigatório', 400);
        }
        const userRole = await getRoleUser(id_admin);
        if (userRole !== 'admin') {
            throw erroStatus('Apenas administradores podem criar usuários', 403);
        }
        const poolExistente = await getPool(id_pool);
        if (!poolExistente) {
            throw erroStatus('Pool não encontrado', 404);
        }
        if (!data.nome || !data.email || !data.senha || !data.funcao) {
            throw erroStatus('Nome, email, senha e função obrigatórios', 400);
        }
        const userData = new User(data);
        if (!userData.email.includes('@')) {
            throw erroStatus('Email inválido', 400);
        }
        const funcoesValidas = ['tecnico'];
        if (!funcoesValidas.includes(userData.funcao)) {
            throw erroStatus('Função inválida', 400);
        }
        const emailExistente = await read('usuarios', `email = '${userData.email}'`);
        if (emailExistente) {
            throw erroStatus('Email já cadastrado', 409);
        }
        userData.senha = await generateHashedPassword(userData.senha);
        const tecnicoId = await create('usuarios', userData);

        const relacaoTecId = await create('pool_tecnico', { id_pool, id_tecnico: tecnicoId.id });
        return { relacaoTecId, tecnicoId };
    } catch (err) {
        console.error('Erro ao criar técnico:', err);
        throw err;
    }
}

export async function updateUser(id, data) {
    try {
        const usuarioExistente = await getUser(id);
        if (!usuarioExistente) {
            throw erroStatus('Usuário não encontrado', 404);
        }
        const user = new User(usuarioExistente);
        user.updateUser(data);
        if (data.email && data.email !== usuarioExistente.email) {
            const emailExistente = await read('usuarios', `email = '${data.email}'`);
            if (emailExistente) {
                throw erroStatus('Email já cadastrado', 409);
            }
        }
        if (data.senha) {
            user.senha = await generateHashedPassword(data.senha);
        }
        if (data.email) {
            if (!data.email.includes('@')) {
                throw erroStatus('Email inválido', 400);
            }
        }
        if (data.funcao) {
            const funcoesValidas = ['admin', 'user', 'tecnico'];
            if (!funcoesValidas.includes(data.funcao)) {
                throw erroStatus('Função inválida', 400);
            }
        }
        return await update('usuarios', user, `id = ${id}`);
    } catch (err) {
        console.error('Erro ao atualizar o usuário:', err);
        throw err;
    }
}

export async function setStatusUser(id, status) {
    try {
        const usuarioExistente = await getUser(id);
        if (!usuarioExistente) {
            throw erroStatus('Usuário não encontrado', 404);
        }
        if (status !== 'ativo' && status !== 'inativo') {
            throw erroStatus('Status deve ser "ativo" ou "inativo"', 400);
        }
        return await update('usuarios', { status }, `id = ${id}`);
    } catch (err) {
        console.error('Erro ao atualizar o status do usuário:', err);
        throw err;
    }
}
