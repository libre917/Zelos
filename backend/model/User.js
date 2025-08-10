import erroStatus from "../utils/erroStatus.js";

export class User{
    constructor({ nome, email, senha, funcao}){
        if (!nome || !email || !senha || !funcao) {
            throw erroStatus("Todos os campos são obrigatórios", 400);
        }
        if (!email.includes('@')) {
            throw erroStatus("Email inválido", 400);
        }

        this.nome = nome;
        this.email = email.toLowerCase().trim();
        this.senha = senha;
        this.funcao = funcao;
    }
}