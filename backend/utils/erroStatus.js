export default function erroStatus(mensagem, status) {
    const erro = new Error(mensagem);
    erro.status = status;
    return erro;
}