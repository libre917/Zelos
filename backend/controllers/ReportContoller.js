import { getReport, getReports, createReport } from "../services/reportsService.js";

export async function getReportsController(req, res) {
    try {
        const reports = await getReports();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter apontamentos' });
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
        res.status(500).json({ error: 'Erro ao obter apontamento' });
    }
}

export async function createReportController(req, res) {
    try {
        const report = await createReport(req.body);
        res.status(201).json(report);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Erro ao criar apontamento' });
    }
}
