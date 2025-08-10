import { getPool, getPools, createPool, updatePool } from '../services/poolService.js';

export async function getPoolsController(req, res) {
    try {
        const pools = await getPools();
        res.status(200).json(pools);
    } catch (err) {
        console.error('Erro ao buscar pools:', err);
        res.status(500).json({ message: 'Erro ao buscar pools' });
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
        res.status(500).json({ message: 'Erro ao buscar pool' });
    }
}

export async function createPoolController(req, res) {
    try {
        const { titulo, descricao, status } = req.body;

        if (!titulo) {
            return res.status(400).json({ message: 'Título é obrigatório' });
        }

        const validTitulos = ['externo', 'manutencao', 'apoio_tecnico', 'limpeza'];
        if (!validTitulos.includes(titulo)) {
            return res.status(400).json({
                message: 'Título deve ser um dos seguintes: ' + validTitulos.join(', '),
            });
        }

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
        res.status(500).json({ message: 'Erro ao criar pool' });
    }
}

export async function updatePoolController(req, res) {
    try {
        const id = req.params.id;
        const { titulo, descricao, status } = req.body;

        const existingPool = await getPool(id);
        if (!existingPool) {
            return res.status(404).json({ message: 'Pool não encontrado' });
        }

        const data = { updated_by: req.usuarioId };

        if (titulo !== undefined) {
            const validTitulos = ['externo', 'manutencao', 'apoio_tecnico', 'limpeza'];
            if (!validTitulos.includes(titulo)) {
                return res.status(400).json({
                    message: 'Título deve ser um dos seguintes: ' + validTitulos.join(', '),
                });
            }
            data.titulo = titulo;
        }

        if (descricao !== undefined) data.descricao = descricao;
        if (status !== undefined) data.status = status;

        const updatedRows = await updatePool(id, data);

        if (updatedRows === 0) {
            return res.status(400).json({ message: 'Nenhuma alteração foi feita' });
        }

        res.status(200).json({ message: 'Pool atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar pool:', err);
        res.status(500).json({ message: 'Erro ao atualizar pool' });
    }
}
