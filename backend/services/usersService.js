import { read, readAll, create, update } from '../config/database.js';
import { User } from '../model/User.js';
import { generateHashedPassword } from '../hashPassword.js';
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

export async function createUser(data) {
    try {
        if (!data.nome || !data.email || !data.senha || !data.funcao) {
            throw erroStatus('Nome, email, senha e função obrigatórios', 400);
        }
        let userData = new User(data);
        if (!userData.email.includes('@')) {
            throw erroStatus('Email inválido', 400);
        }
        const funcoesValidas = ['admin', 'user', 'tecnico'];
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
