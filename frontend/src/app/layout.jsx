import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header/Header.jsx";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Sistema de Chamados SENAI",
  description: "Sistema de gerenciamento de chamados técnicos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body className="min-h-screen bg-gray-50">
        <Header />
      
          {children}
       
      </body>
    </html>
  );
}
