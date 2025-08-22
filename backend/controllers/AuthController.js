import jwt from 'jsonwebtoken';
import { read, compare } from '../config/database.js';

export const loginController = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verificar se o usuário existe no banco de dados
        const usuario = await read('usuarios', `email = '${email}'`);

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        if (usuario.status === 'inativo') {
            return res.status(403).json({ mensagem: 'Usuário inativo' });
        }

        // Verificar se a senha está correta (comparar a senha enviada com o hash armazenado)
        const senhaCorreta = await compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: 'Senha incorreta' });
        }

        // Gerar o token JWT
        const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.cookie('token', token, {
            sameSite: 'strict',
            maxAge: 3600000,
        });
 

        res.json({ mensagem: 'Login realizado com sucesso', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ mensagem: 'Erro ao fazer login' });
    }
};

export const logoutController = async (req, res) => {
    try {
        // Remover o token do cookie
        res.clearCookie('token');
        res.json({ mensagem: 'Logout realizado com sucesso' });
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        res.status(500).json({ mensagem: 'Erro ao fazer logout' });
    }
};