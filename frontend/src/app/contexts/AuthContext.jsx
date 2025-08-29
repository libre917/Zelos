'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '../services/authService';

// Criando o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const router = useRouter();

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await authService.checkAuth();
        setIsAuthenticated(result.authenticated);
        
        if (result.authenticated && result.user) {
          setUserType(result.user.tipo);
          setUser(result.user);
          
          // Redirecionar com base no tipo de usuário
          if (window.location.pathname === '/') {
            redirectBasedOnUserType(result.user.tipo);
          }
        } else if (window.location.pathname !== '/') {
          // Se não estiver autenticado e não estiver na página de login, redirecionar para login
          router.push('/');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Função para redirecionar com base no tipo de usuário
  const redirectBasedOnUserType = (tipo) => {
    if (tipo === 'admin') {
      router.push('/admin');
    } else if (tipo === 'tecnico') {
      router.push('/tecnico');
    } else if (tipo === 'usuario') {
      router.push('/usuario');
    }
  };

  // Função de login
  const login = async (email, senha) => {
    try {
      const result = await authService.login(email, senha);
      
      if (result.success) {
        setIsAuthenticated(true);
        
        if (result.user) {
          setUserType(result.user.tipo);
          setUser(result.user);
          
          // Redirecionar com base no tipo de usuário
          redirectBasedOnUserType(result.user.tipo);
        } else {
          // Se não tiver informações do usuário na resposta, buscar
          const userType = await authService.getUserType();
          setUserType(userType);
          setUser({ tipo: userType });
          redirectBasedOnUserType(userType);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.mensagem || 'Erro ao fazer login' 
      };
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setUserType(null);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Valor do contexto
  const value = {
    user,
    userType,
    loading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}