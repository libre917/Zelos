import { getReport, getReports, createReport, updateReport } from "../models/Reports.js";

export async function getReportsController(req, res) {
    try {
        const reports = await getReports();
        res.status(200).json(reports)
    } catch (err) {
        console.error("Erro fodase:", err);
        res.status(500).json({ menage: "Erro" })
    };
}

export async function getReportController(req, res) {
    try {
        const id = req.params.id
        const reports = await getReport(id);
        res.status(200).json(reports)
    } catch (err) {
        console.error("Erro fodase:", err);
        res.status(500).json({ menage: "Erro" })
    }
}

export async function createReportController(req, res) {
    try {
        const { chamado_id, tecnico_id, descricao } = req.body;
        const data = {
            chamado_id, tecnico_id, descricao
        }
        const createdReport = await createReport(data);
        res.status(201).json(createdReport);
    } catch (err) {
        console.error("Erro fodase:", err);
        res.status(500).json({ menage: "Erro" })
    }
}

export async function updateReportController(req, res) {
    try {
        const id = req.params.id
        const { chamado_id, tecnico_id, descricao } = req.body;

        const data = {
            chamado_id, tecnico_id, descricao
        }
        const updatedReport = await updateReport(id, data);
        res.status(200).json(updatedReport)
    } catch (err) {
        console.error('Erro:', err);
        res.status(500).json({ mensagem: "Erro ao atualizar a porra do apontamento, burro do cacete" })
    }
}