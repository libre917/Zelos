import { getUser, getUsers, createUser, updateUser, createTechnician, setStatusUser, getRoleUser } from '../services/usersService.js';

export async function getUsersController(req, res) {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Erro:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem });
    }
}

export async function getUserController(req, res) {
    try {
        const id = req.params.id;
        const user = await getUser(id);
        res.status(200).json(user);
    } catch (err) {
        console.error('Erro:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem });
    }
}

export async function getRoleController(req, res) {
    try {
        const id = req.usuarioId;
        const role = await getRoleUser(id);
        if (!role) {
            return res.status(404).json({ mensagem: 'Função não encontrada para o usuário' });
        }
        res.status(200).json({ role });
    } catch (err) {
        console.error('Erro:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem });
    }
}

export async function createUserController(req, res) {
    try {
        const { nome, senha, email, funcao } = req.body;
        const id = req.usuarioId;

        const data = {
            nome: nome,
            senha: senha,
            email: email,
            funcao: funcao,
        };
        await createUser(id, data);
        res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    } catch (err) {
        console.error('Erro:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function createTechnicianController(req, res) {
    try {
        const { nome, senha, email, funcao, id_pool } = req.body;
        const id = req.usuarioId;

        const data = {
            nome: nome,
            senha: senha,
            email: email,
            funcao: funcao,
        };
        const createdTec = await createTechnician(id, data, id_pool);
        res.status(201).json(createdTec);
    } catch (err) {
        console.error('Erro:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function updateUserController(req, res) {
    try {
        const id = req.params.id;
        const { nome, senha, email, funcao, status } = req.body;

        const data = {
            nome: nome,
            senha: senha,
            email: email,
            funcao: funcao,
            status: status,
        };
        const updatedUser = await updateUser(id, data);
        res.status(200).json({ mensagem: 'Usuário atualizado com sucesso', userId: updatedUser });
    } catch (err) {
        console.error('Erro:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function setStatusUserController(req, res) {
    try {
        const id = req.params.id;
        const { status } = req.body;

        await setStatusUser(id, status);
        res.status(200).json({ mensagem: 'Status do usuário atualizado com sucesso' });
    } catch (err) {
        console.error('Erro:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}