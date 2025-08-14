
'use client';

import { Bell, User, Menu, Search } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    if (pathname === "/") {
        return null;
    }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
      {/* Logo e Menu */}
      <div className="flex items-center space-x-4">
        <button className="lg:hidden rounded-full p-2 hover:bg-gray-100">
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md shadow-sm">
            <Image
              src="/ImagensLogin/SenaiLogo.png"
              alt="Logo SENAI"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-lg font-semibold text-red-600 hidden sm:block">Sistema de Chamados</h1>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className={`absolute left-0 top-full w-full bg-white p-3 shadow-md transition-all duration-300 ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'} md:relative md:top-0 md:w-1/3 md:translate-y-0 md:opacity-100 md:shadow-none md:p-0 md:pointer-events-auto`}>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar chamados..." 
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center space-x-1 sm:space-x-4">
        {/* Botão de pesquisa mobile */}
        <button 
          className="md:hidden rounded-full p-2 hover:bg-gray-100"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="h-5 w-5 text-gray-700" />
        </button>
        
        {/* Notificações */}
        <button className="relative rounded-full p-2 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-700" />
          {/* Badge de notificações */}
          <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* Perfil */}
        <button className="flex items-center space-x-2 rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200">
            <User className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-gray-500" />
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">Usuário</span>
        </button>
      </div>
    </header>
  );
}
