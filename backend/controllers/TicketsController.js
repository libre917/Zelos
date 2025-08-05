import { getTickets, getTicket, createTicket, updateTicket } from "../models/Tickets.js";

export async function getTicketsController(req, res) {
    try {
        const tickets = await getTickets();
        res.status(200).json(tickets)
    } catch (err) {
        console.error("Erro fodase:", err);
        res.status(500).json({ menage: "Erro" })
    };
}

export async function getTicketController(req, res) {
    try {
        const id = req.params.id
        const tickets = await getTicket(id);
        res.status(200).json(tickets)
    } catch (err) {
        console.error("Erro fodase:", err);
        res.status(500).json({ menage: "Erro" })
    }
}

export async function createTicketController(req, res) {
    try {
        const { titulo, descricao, tipo_id, tecnico_id, status } = req.body;
        const data = {
            titulo, descricao, tipo_id, tecnico_id, status
        }
    } catch (err) {
        console.error("Erro fodase:", err);
        res.status(500).json({ menage: "Erro" })
    }
}