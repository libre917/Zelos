import { read, readAll, create, update } from "../config/database.js";

export async function getReports() {
    try {
        return await readAll('apontamentos');
    } catch (err) {
        console.error('Erro ao obter apontamentos:', err);
        throw err;
    }
}

export async function getReport(id) {
    try {
        return await read('apontamentos', `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao obter apontamento:', err);
        throw err;
    }
}

export async function createReport(data) {
    try {
        return await create('apontamentos', data);
    } catch (err) {
        console.error('Erro ao criar apontamento:', err);
        throw err;
    }
}

export async function updateReport(id, data) {
    try {
        return await update('apontamentos', data, `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao atualizar apontamento:', err);
        throw err;
    }
}