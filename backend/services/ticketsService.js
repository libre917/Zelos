import { read, readAll, create, update } from "../config/database.js";

export async function getTickets() {
    try {
        return await readAll('chamados');
    } catch (err) {
        console.error('Erro ao obter chamados:', err);
        throw err;
    }
}

export async function getTicket(id) {
    try {
        return await read('chamados', `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao obter chamado:', err);
        throw err;
    }
}

export async function createTicket(data) {
    try {
        return await create('chamados', data);
    } catch (err) {
        console.error('Erro ao criar chamado:', err);
        throw err;
    }
}

export async function updateTicket(id, data) {
    try {
        return await update('chamados', data, `id = '${id}'`);
    } catch (err) {
        console.error('Erro ao atualizar chamado:', err);
        throw err;
    }
}

export async function getTicketsByUser(userId) {
    try {
        return await readAll('chamados', `usuario_id = '${userId}'`);
    } catch (err) {
        console.error('Erro ao obter chamados do usuário:', err);
        throw err;
    }
}

export async function getTicketsByTechnician(technicianId) {
    try {
        return await readAll('chamados', `tecnico_id = '${technicianId}'`);
    } catch (err) {
        console.error('Erro ao obter chamados do técnico:', err);
        throw err;
    }
}

export async function getTicketsByStatus(status) {
    try {
        return await readAll('chamados', `status = '${status}'`);
    } catch (err) {
        console.error('Erro ao obter chamados por status:', err);
        throw err;
    }
}