import { generateHashedPassword } from "../hashPassword.js";
import { getUser, getUsers, createUser, updateUser } from "../models/Users.js";

export async function getUsersController(req, res) {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Erro:', err);
        res.status(500).json({ mensagem: "Erro ao buscar usuarios" })
    }
}

export async function getUserController(req, res) {
    try {
        const id = req.usuarioId || req.params.id;
        const user = await getUser(id);
        res.status(200).json(user)
    } catch (err) {
        console.error('Erro:', err);
        res.status(500).json({ mensagem: "Erro ao buscar usuario" })
    }
}

export async function createUserController(req, res) {
    try {
        const { nome, senha, email, funcao, status } = req.body;
        const senhaHasheada = await generateHashedPassword(senha);

        const data = {
            nome: nome,
            senha: senhaHasheada,
            email: email,
            funcao: funcao
        }
        const createdUser = await createUser(data);
        res.status(201).json("Usuario criado com sucesso");
    } catch (err) {
        console.error('Erro:', err);
        res.status(500).json({ mensagem: "Erro ao criar a porra do usuario burro do cacete" })
    }
}

export async function updateUserController(req, res) {
    try {
        const id = req.params.id
        const { nome, senha, email, funcao, status } = req.body;

        const senhaHasheada = await generateHashedPassword(senha);

        const data = {
            nome: nome,
            senha: senhaHasheada,
            email: email,
            funcao: funcao,
            status: status
        }
        const updatedUser = await updateUser(id, data);
        res.status(200).json(updatedUser)
    } catch (err) {
        console.error('Erro:', err);
        res.status(500).json({ mensagem: "Erro ao atualizar a porra do usuario burro do cacete" })
    }
}