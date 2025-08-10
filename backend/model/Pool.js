export class Pool {
    constructor({titulo, descricao, status = 'ativo', created_by, updated_by = null}) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.status = status; // 'ativo' ou 'inativo'
        this.created_by = created_by; // ID do usuário que criou
        this.updated_by = updated_by; // ID do usuário que fez a última atualização
    }
    
    updatePool({titulo, descricao, status, updated_by}) {
        if (titulo !== undefined) {
            this.titulo = titulo;
        }
        if (descricao !== undefined) {
            this.descricao = descricao;
        }
        if (status !== undefined) {
            this.status = status;
        }
        if (updated_by !== undefined) {
            this.updated_by = updated_by;
        }
    }
}