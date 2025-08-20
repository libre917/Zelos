import { read, readAll, create, update } from '../config/database.js';
import { Pool } from '../model/Pool.js';
import erroStatus from '../utils/erroStatus.js';
import { validarTitulo, validarRole } from '../utils/validar.js';

// Services
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
        const pool = await read('pool', `id = '${id}'`);
        const poolTec = await readAll('pool_tecnico', `id_pool = '${id}'`);
        return { pool, poolTec };
    } catch (err) {
        console.error('Erro ao obter pool:', err);
        throw err;
    }
}

export async function getCreatorPool(poolId) {
    try {
        const pool = await getPool(poolId);
        if (!pool) throw erroStatus('Pool não encontrada', 404);
        return pool.created_by;
    } catch (err) {
        console.error('Erro ao obter criador da pool:', err);
        throw err;
    }
}

export async function getPoolbyTitle(title) {
    try {
        return await readAll('pool', `titulo = '${title}'`);
    } catch (err) {
        console.error('Erro ao obter pools por título:', err);
        throw err;
    }
}

export async function getPoolTechniciansById(id_pool, technicianId) {
    try {
         return await readAll('pool_tecnico', `id_pool = '${id_pool}' AND id_tecnico = '${technicianId}'`);
        
    } catch (err) {
        console.error('Erro ao obter técnicos da pool:', err);
        throw err;
    }
}

export const getTicketsByPoolId = async (id_pool) => {
    try {
        return await readAll('chamados', `tipo_id = '${id_pool}'`);
    } catch (err) {
        console.error('Erro ao obter tickets da pool:', err);
        throw err;
    }
};

export async function createPool(data) {
    try {
        if (!data.titulo) throw erroStatus('Título é obrigatório', 400);

        validarTitulo(data.titulo);
        await validarRole(data.created_by, "admin");

        const tituloExistente = await read('pool', `titulo = '${data.titulo}'`);
        if (tituloExistente) throw erroStatus('Título já cadastrado', 409);

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
        if (!poolExistente) throw erroStatus('Pool não encontrado', 404);

        await validarRole(data.updated_by, "admin");

        const pool = new Pool(poolExistente);
        pool.updatePool(data);

        if (data.status && !['ativo', 'inativo'].includes(data.status)) {
            throw erroStatus('Status deve ser "ativo" ou "inativo"', 400);
        }

        if (data.titulo) {
            validarTitulo(data.titulo);

            const tituloExistente = await read('pool', `titulo = '${data.titulo}'`);
            if (tituloExistente) throw erroStatus('Título já cadastrado', 409);

            pool.titulo = data.titulo;
        }

        if (data.descricao) pool.descricao = data.descricao;

        return await update('pool', pool, `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao atualizar pool:', err);
        throw err;
    }
}
