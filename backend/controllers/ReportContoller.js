import { getReport, getReports, createReport } from "../services/reportsService.js";

export async function getReportsController(req, res) {
    try {
        const reports = await getReports();
        res.json(reports);
    } catch (err) {
        const status = err.status || 500;
        const mensagem = err.message || 'Erro ao obter apontamentos';
        res.status(status).json({ mensagem, status });
    }
}

export async function getReportController(req, res) {
    try {
        const report = await getReport(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Apontamento não encontrado' });
        }
        res.json(report);
    } catch (err) {
        const status = err.status || 500;
        const mensagem = err.message || 'Erro ao obter apontamento';
        res.status(status).json({ mensagem, status });
    }
}

export async function createReportController(req, res) {
    try {
        const report = await createReport(req.body);
        res.status(201).json(report);
    } catch (err) {
        const status = err.status || 500;
        const mensagem = err.message || 'Erro ao criar apontamento';
        res.status(status).json({ mensagem, status });
    }
}
