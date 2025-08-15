'use client';

import { Home, Plus, List, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }
  
  return (
    <aside className="w-64 h-full border-r bg-white shadow-sm">
      <div className="flex flex-col h-full">
        {/* Seção principal */}
        <div className="flex-grow overflow-y-auto p-4">
          <div className="mb-6">
            <button className="w-full btn btn-primary flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Novo Chamado</span>
            </button>
          </div>

          <nav className="flex flex-col space-y-1">
            <Link
              href="/usuario"
              className={`flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/usuario' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="#"
              className="flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <List className="h-5 w-5" />
              <span>Meus Chamados</span>
            </Link>
          </nav>
        </div>

        {/* Seção inferior */}
        <div className="border-t p-4">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className="flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
