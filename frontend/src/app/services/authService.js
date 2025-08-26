'use client';

import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const authService = {
  // Função para fazer login
  login: async (email, senha) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, senha }, {
        withCredentials: true
      });
      
      // Armazenar o token no cookie
      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 1 }); // expira em 1 dia
      }
      
      // Armazenar informações básicas do usuário no localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { mensagem: 'Erro ao fazer login' };
    }
  },

  // Função para verificar se o usuário está autenticado
  isAuthenticated: () => {
    return !!Cookies.get('token');
  },

  // Função para obter o token
  getToken: () => {
    return Cookies.get('token');
  },

  // Função para fazer logout
  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      Cookies.remove('token');
    }
  },

  // Função para obter o tipo de usuário (admin, usuario, tecnico)
  getUserType: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      return user.tipo || null;
    } catch (error) {
      console.error('Erro ao obter tipo de usuário:', error);
      return null;
    }
  }
};

export default authService;