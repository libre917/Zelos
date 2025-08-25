export const API = {
    // url base da api
    BASE_URL: process.env.NEXT_PUBLIC_API_URL,

    //caminho de login da API
    LOGIN: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,

    //caminho para logout do usuário
    LOGOUT: `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,

    //caminho para buscar ou criar usuários, irá variar conforme a implementação
    USERS: `${process.env.NEXT_PUBLIC_API_URL}/users`,

    // caminho para mudar status de usuário para ativo ou inativo
    CHANGE_STATUS_USER: (id) => `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/status`,

    //caminho de busca de função de usuário da API
    GET_USER_ROLE: `${process.env.NEXT_PUBLIC_API_URL}/users/me/role`,

    //caminho para buscar informações necessárias do usuário
    GET_USER_INFO: `${process.env.NEXT_PUBLIC_API_URL}/users/me/info`,

    //caminho para busca ou criação de categorias
    POOL: `${process.env.NEXT_PUBLIC_API_URL}/pool`
};
