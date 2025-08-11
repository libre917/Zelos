import { read, readAll, create, update } from '../config/database.js';
import { Ticket } from '../model/Ticket.js';
import erroStatus from '../utils/erroStatus.js';
import { getPool, getPoolTechniciansById } from './poolService.js';
import { getRoleUser } from './usersService.js';

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
        return await read('chamados', `tecnico_id = '${technicianId}'`);
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

export async function createTicket(data) {
    try {
        if (!data.titulo || !data.descricao || !data.usuario_id) {
            throw erroStatus('Título, descrição e ID do usuário são obrigatórios', 400);
        }
        const ticketData = new Ticket(data);
        
        if (ticketData.status) {
            const validStatuses = ['pendente', 'em_andamento', 'concluido'];
            if (!validStatuses.includes(ticketData.status)) {
                throw erroStatus('Status inválido', 400);
            }
        }
        const role = await getRoleUser(ticketData.usuario_id);
        
        if (role !== 'usuario') { 
            throw erroStatus('Apenas usuários podem criar chamados', 403);
        }
        if (ticketData.tecnico_id) {
            const technician = await getRoleUser(ticketData.tecnico_id);
            if (technician !== 'tecnico') {
                throw erroStatus('ID do técnico inválido', 400);
            }
        }
        if (ticketData.tipo_id) {
            const tipoExistente = await read('pool', `id = '${ticketData.tipo_id}'`);
            if (!tipoExistente) {
                throw erroStatus('Tipo de chamado inválido', 400);
            }
        }
        return await create('chamados', ticketData);
    } catch (err) {
        console.error('Erro ao criar chamado:', err);
        throw err;
    }
}

export async function setTechnicianToTicket(ticketId, technicianId) {
    try{
        if (!ticketId || !technicianId) {
            throw erroStatus('ID do chamado e ID do técnico são obrigatórios', 400);
        }
        const ticket = await getTicket(ticketId);
        if (!ticket) {
            throw erroStatus('Chamado não encontrado', 404);
        }
        if (ticket.tipo_id === null) {
            return await update('chamados', { tecnico_id: technicianId }, `id = '${ticketId}'`);
        }
        const pool = await getPoolTechniciansById(ticket.tipo_id);
        console.log(pool, technicianId);
        
        if (pool.id_tecnico !== technicianId) {
            throw erroStatus('Técnico não autorizado para este tipo de chamado', 403);
        }
        return await update('chamados', { tecnico_id: technicianId }, `id = '${ticketId}'`);

    } catch (err) {
        console.error('Erro ao atribuir técnico ao chamado:', err);
        throw err;
    }
}

