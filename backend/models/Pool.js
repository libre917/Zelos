import { read, readAll, create, update } from "../config/database.js";

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
        return await create('pool', data);
    } catch (err) {
        console.error('Erro ao criar pool:', err);
        throw err;
    }
}

export async function updatePool(id, data) {
    try {
        return await update('pool', data, `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao atualizar pool:', err);
        throw err;
    }
}