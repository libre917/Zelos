export class Report{
    constructor({ chamado_id, tecnico_id, descricao, comeco }) {
        this.chamado_id = chamado_id;
        this.tecnico_id = tecnico_id;
        this.descricao = descricao;
        this.comeco = comeco;
        this.fim = new Date();
    }
}