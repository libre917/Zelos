export class Ticket {
    constructor({ titulo, descricao, tipo_id = null, tecnico_id = null, usuario_id, status = 'pendente' }) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.tipo_id = tipo_id;
        this.tecnico_id = tecnico_id;
        this.usuario_id = usuario_id;
        this.status = status; // 'pendente', 'em_andamento', 'concluido'
    }
}
