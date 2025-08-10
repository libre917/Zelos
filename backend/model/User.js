export class User {
    constructor({ nome, email, senha, funcao }) {
        this.nome = nome;
        this.email = email.toLowerCase().trim();
        this.senha = senha;
        this.funcao = funcao;
    }

    updateUser({ nome, email, senha, funcao }) {

        if (nome !== undefined) {
            this.nome = nome;
        }
        if (email !== undefined) {
            this.email = email.toLowerCase().trim();
        }
        if (senha !== undefined) {
            this.senha = senha;
        }
        if (funcao !== undefined ) {
            this.funcao = funcao;
        }
    }
}
