'use client';

import { Bell, User } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null); // <- novo estado

  // Monitora cookies a cada 500ms (ou intervalo desejado)
  useEffect(() => {
    const interval = setInterval(() => {
      const t = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (t && t !== token) {
        setToken(t); // atualiza o estado quando o token aparece
      }

      if (!t && token) {
        setToken(null); // remove token se cookie sumiu
        setUserInfo(null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [token]);

  // Busca dados do usuário sempre que o token mudar
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const response = await fetch('http://localhost:8081/users/me/info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Erro ao buscar a role:', response.status);
          return;
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error('Erro na requisição:', err);
      }
    })();
  }, [token]);

  const handleLogout = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8081/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Erro ao fazer logout:', response.status);
        return;
      }

      document.cookie = 'token=; Max-Age=0; path=/';
      setToken(null);
      router.push('/');
    } catch (err) {
      console.error('Erro na requisição:', err);
    }
  };

  if (pathname === '/') return null;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center space-x-3">
        <Image src="/ImagensLogin/SenaiLogo.png" alt="Logo SENAI" width={40} height={40} />
        <h1 className="text-lg font-semibold text-red-600 hidden sm:block">Sistema de Chamados</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 rounded-full px-3 py-1.5 hover:bg-gray-100">
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{userInfo?.nome}</span>
          <User className="h-5 w-5 text-gray-500" />
          <button onClick={handleLogout} className="text-sm font-medium text-red-600">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
