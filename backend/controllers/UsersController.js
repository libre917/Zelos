import { generateHashedPassword } from '../hashPassword.js';
import { getUser, getUsers, createUser, updateUser } from '../services/usersService.js';

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
        const id = req.usuarioId || req.params.id;
        const user = await getUser(id);
        res.status(200).json(user);
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
        const senhaHasheada = await generateHashedPassword(senha);

        const data = {
            nome: nome,
            senha: senhaHasheada,
            email: email,
            funcao: funcao,
        };
        await createUser(data);
        res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    } catch (err) {
        console.error('Erro:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem });
    }
}

export async function updateUserController(req, res) {
    try {
        const id = req.params.id;
        const { nome, senha, email, funcao, status } = req.body;

        const senhaHasheada = await generateHashedPassword(senha);

        const data = {
            nome: nome,
            senha: senhaHasheada,
            email: email,
            funcao: funcao,
            status: status,
        };
        const updatedUser = await updateUser(id, data);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Erro:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem });
    }
}
