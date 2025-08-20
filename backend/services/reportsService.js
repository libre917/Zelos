import { read, readAll, create } from "../config/database.js";
import { Report } from "../model/Report.js";
import { getTicket } from "./ticketsService.js";
import erroStatus from "../utils/erroStatus.js";
import { validarCamposObrigatorios, validarRole } from "../utils/validar.js";

// Services
export async function getReports(ticket_id) {
    try {
        return await readAll("apontamentos", `chamado_id = '${ticket_id}'`);
    } catch (err) {
        console.error("Erro ao obter apontamentos:", err);
        throw err;
    }
}

export async function getReport(ticket_id,id) {
    try {
        return await read("apontamentos", `id = '${id}' AND chamado_id = '${ticket_id}'`);
    } catch (err) {
        console.error("Erro ao obter apontamento:", err);
        throw err;
    }
}

export async function createReport(data) {
    try {
        // Validação de obrigatórios
        validarCamposObrigatorios(data, ["chamado_id", "tecnico_id", "descricao", "comeco", "fim"]);

        // Verifica se o chamado existe
        const chamadoExistente = await getTicket(data.chamado_id);
        if (!chamadoExistente) {
            throw erroStatus("Chamado não encontrado", 404);
        }

        // Verifica se o usuário é técnico
        await validarRole(data.tecnico_id, "tecnico");

        // Cria o apontamento
        const report = new Report(data);
        return await create("apontamentos", report);

    } catch (err) {
        console.error("Erro ao criar apontamento:", err);
        throw err;
    }
}
