'use client';

import { Home, Plus, List, LogOut, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBarAdmin() {


  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }
  
  return (
    <aside className="w-64 h-full border-r bg-white shadow-md">
      <div className="flex flex-col h-full">
        {/* Logo e cabeçalho */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-red-600">Zelos</h1>
          </div>
        </div>
        
        {/* Seção principal */}
        <div className="flex-grow overflow-y-auto p-4">

          <nav className="flex flex-col space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">Principal</p>
            <Link
              href="/admin"
              className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/admin' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <div className="pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">Suporte</p>
              <Link
                href="#"
                className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Ajuda</span>
              </Link>
              
              <Link
                href="#"
                className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Configurações</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Seção inferior */}
        <div className="border-t p-4 bg-gray-50">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}

export { SideBarAdmin };
