import { read, readAll, create } from "../config/database.js";
import { Report } from "../model/Report.js";
import { getTicket } from "./ticketsService.js";

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
        if (!data.chamado_id || !data.tecnico_id || !data.descricao || !data.comeco) {
            throw erroStatus('ID do chamado, ID do técnico, descrição e data de início são obrigatórios', 400);
        }
        const chamadoExistente = await getTicket(data.chamado_id);
        if (!chamadoExistente) {
            throw erroStatus('Chamado não encontrado', 404);
        }
        const userRole = await getRoleUser(data.tecnico_id);
        if (userRole !== 'tecnico') {
            throw erroStatus('Apenas técnicos podem criar apontamentos', 403);
        }
        const report = new Report(data)
        return await create('apontamentos', report);
    } catch (err) {
        console.error('Erro ao criar apontamento:', err);
        throw err;
    }
}
