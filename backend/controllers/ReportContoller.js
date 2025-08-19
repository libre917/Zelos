import { getReport, getReports, createReport } from "../services/reportsService.js";

export async function getReportsController(req, res) {
    try {
        const ticketId = req.params.ticket_id;
        const reports = await getReports(ticketId);
        res.json(reports);
    } catch (err) {
        const status = err.status || 500;
        const mensagem = err.message || 'Erro ao obter apontamentos';
        res.status(status).json({ mensagem, status });
    }
}

export async function getReportController(req, res) {
    try {
        const ticketId = req.params.ticket_id;
        const report = await getReport(ticketId, req.params.id);
        res.json(report);
    } catch (err) {
        const status = err.status || 500;
        const mensagem = err.message || 'Erro ao obter apontamento';
        res.status(status).json({ mensagem, status });
    }
}

export async function createReportController(req, res) {
    try {
        // aaaa-mm-dd hh:mm:ss
        const {descricao, comeco, fim} = req.body
        const ticketId = req.params.ticket_id;
        const id = req.usuarioId;
        const data = {
            chamado_id: ticketId,
            tecnico_id: id,
            descricao,
            comeco,
            fim,
        }
        const report = await createReport(data);
        res.status(201).json(report);
    } catch (err) {
        const status = err.status || 500;
        const mensagem = err.message || 'Erro ao criar apontamento';
        res.status(status).json({ mensagem, status });
    }
}
