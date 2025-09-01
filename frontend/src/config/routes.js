export const API = {
    // url base da api
    BASE_URL: process.env.NEXT_PUBLIC_API_URL,

    //caminho de login da API
    LOGIN: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,

    //caminho para logout do usuário
    LOGOUT: `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,

    //caminho para buscar ou criar usuários, irá variar conforme a implementação
    USERS: `${process.env.NEXT_PUBLIC_API_URL}/users`,

    //caminhos para buscar tecnicos
    GET_TECHNICIANS: `${process.env.NEXT_PUBLIC_API_URL}/users?filter=tecnicos`,

    // caminho para mudar status de usuário para ativo ou inativo
    CHANGE_STATUS_USER: (id) => `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/status`,

    // caminho para criar um tecnico e associar a uma pool
    CREATE_TECHNICIAN: `${process.env.NEXT_PUBLIC_API_URL}/users/tecnico`,

    //caminho de busca de função de usuário da API
    GET_USER_ROLE: `${process.env.NEXT_PUBLIC_API_URL}/users/me/role`,

    //caminho para buscar informações necessárias do usuário
    GET_USER_INFO: `${process.env.NEXT_PUBLIC_API_URL}/users/me/info`,

    //caminho para busca ou criação de categorias
    POOL: `${process.env.NEXT_PUBLIC_API_URL}/pool`,

    //caminho para busca de pools com quantidade de tickets relacionados ao pool
    GET_POOL_WITH_TICKETS: `${process.env.NEXT_PUBLIC_API_URL}/pool/with-tickets`,

    //caminho para busca ou criação de chamados
    TICKET: `${process.env.NEXT_PUBLIC_API_URL}/ticket`,

    //caminho para buscar chamados do usuário
    GET_USER_TICKETS: `${process.env.NEXT_PUBLIC_API_URL}/ticket/info/user`,

    //caminho para buscar chamados que o técnico pode acessar
    GET_TECHNICIAN_TICKETS: `${process.env.NEXT_PUBLIC_API_URL}/ticket/info/tecnico`,

    //caminho para setar o técnico ao chamado
    SET_TECHNICIAN: (id) => `${process.env.NEXT_PUBLIC_API_URL}/ticket/${id}/tecnico`,

    //caminho para resolver o chamado
    RESOLVE_TICKET: (id) => `${process.env.NEXT_PUBLIC_API_URL}/ticket/${id}/tecnico/resolve`,
};
