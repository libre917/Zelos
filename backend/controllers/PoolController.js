import { getPool, getPools, createPool, updatePool, getTicketsByPoolId } from '../services/poolService.js';

export async function getPoolsController(req, res) {
    try {
        const pools = await getPools();
        res.status(200).json(pools);
    } catch (err) {
        console.error('Erro ao buscar pools:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function getPoolController(req, res) {
    try {
        const id = req.params.id;
        const pool = await getPool(id);

        if (!pool) {
            return res.status(404).json({ message: 'Pool não encontrado' });
        }

        res.status(200).json(pool);
    } catch (err) {
        console.error('Erro ao buscar pool:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function getTicketsByPoolIdController(req, res) {
    try {
        const id = req.params.id;
        const tickets = await getTicketsByPoolId(id);
        res.status(200).json(tickets);
    } catch (err) {
        console.error('Erro ao buscar tickets da pool:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function createPoolController(req, res) {
    try {
        const { titulo, descricao, status } = req.body;

        const data = {
            titulo,
            descricao: descricao || null,
            status: status || 'ativo',
            created_by: req.usuarioId,
        };

        const createdPool = await createPool(data);
        res.status(201).json({
            message: 'Pool criado com sucesso',
            id: createdPool,
        });
    } catch (err) {
        console.error('Erro ao criar pool:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}

export async function updatePoolController(req, res) {
    try {
        const id = req.params.id;
        const { titulo, descricao, status } = req.body;
        const data = {
            titulo,
            descricao: descricao || null,
            status: status || 'ativo',
            updated_by: req.usuarioId,
        };
        const updatedPool = await updatePool(id, data);
        res.status(200).json({ message: 'Pool atualizado com sucesso', id: updatedPool });
    } catch (err) {
        console.error('Erro ao atualizar pool:', err);
        const status = err.status || 500;
        const mensagem = err.message || 'Erro interno do servidor';
        res.status(status).json({ mensagem, status });
    }
}
