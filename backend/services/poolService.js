import { read, readAll, create, update } from '../config/database.js';
import { Pool } from '../model/Pool.js';
import erroStatus from '../utils/erroStatus.js';
export async function getPools() {
    try {
        return await readAll('pool');
    } catch (err) {
        console.error('Erro ao obter pools:', err);
        throw err;
    }
}

export async function getPool(id) {
    try {
        return await read('pool', `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao obter pool:', err);
        throw err;
    }
}

export async function createPool(data) {
    try {
        if (!data.titulo) {
            throw erroStatus('Título é obrigatório', 400);
        }
        const tituloValido = ['externo', 'manutencao', 'apoio_tecnico', 'limpeza'];
        if (!tituloValido.includes(data.titulo)) {
            throw erroStatus('Título deve ser um dos seguintes: ' + tituloValido.join(', '), 400);
        }
        if (data.created_by === undefined || data.created_by === null) {
            throw erroStatus('ID do usuário criador é obrigatório', 400);
        }
        const pool = new Pool(data);

        return await create('pool', pool);
    } catch (err) {
        console.error('Erro ao criar pool:', err);
        throw err;
    }
}

export async function updatePool(id, data) {
    try {
        const poolExistente = await getPool(id);
        if (!poolExistente) {
            throw erroStatus('Pool não encontrado', 404);
        }
        const pool = new Pool(poolExistente);
        pool.updatePool(data);
        if (data.updated_by === undefined || data.updated_by === null) {
            throw erroStatus('ID do usuário atualizador é obrigatório', 400);
        }
        if (data.status && !['ativo', 'inativo'].includes(data.status)) {
            throw erroStatus('Status deve ser "ativo" ou "inativo"', 400);
        }
        if (data.titulo !== undefined && data.titulo !== null) {
            const tituloValido = ['externo', 'manutencao', 'apoio_tecnico', 'limpeza'];
            if (!tituloValido.includes(data.titulo)) {
                throw erroStatus('Título deve ser um dos seguintes: ' + tituloValido.join(', '), 400);
            }
            pool.titulo = data.titulo;
        }
        if (data.descricao) {
            pool.descricao = data.descricao ;
        }
        return await update('pool', pool, `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao atualizar pool:', err);
        throw err;
    }
}
