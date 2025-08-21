'use client';

import Image from 'next/image';
import { Eye, EyeClosed } from 'lucide-react'; // Importando Icons do lucide-react para ícone de visibilidade
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showSenha, setShowSenha] = useState(false);
    const [emailErro, setEmailErro] = useState('');
    const [state, setState] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))?.split('=')[1];

        if (!token) return; // Se não tiver token, não faz nada

        console.log('Token encontrado:', token);

        (async () => {
            try {
                const response = await fetch('http://localhost:8081/users/me/role', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error('Erro ao buscar a role:', response.status);
                    return;
                }

                const data = await response.json();
                console.log('Role:', data.role);
                router.push(`/${data.role}`); // Redireciona para a página da role do usuário
                setState(true);

            } catch (err) {
                console.error('Erro na requisição:', err);
            }
        })();
    }, [state]);

    function emailValido(email) {
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailValido(email)) {
            setEmailErro('Digite um email válido.');
            return;
        }

        const autenticacao = await fetch('http://localhost:8081/auth/login ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
            credentials: 'include',
        });
        if (autenticacao.status !== 200) {
            console.log('Erro ao fazer login:', autenticacao.statusText);
        }

        setState(true);

        setEmailErro('');
    };


    return (
        <main className="flex min-h-screen bg-gradient-to-br from-red-100 via-white to-blue-100">
            {/* Coluna esquerda*/}
            <section className="relative w-1/3 hidden lg:block">
                <Image
                    src="/ImagensLogin/ImagemEsquerdaLogin.jpg"
                    alt="Crianças SESI"
                    fill
                    className="object-cover shadow-2xl shadow-red-200/60"
                />
            </section>

            {/* Coluna central - Login */}
            <section className="flex flex-col justify-center items-center w-full lg:w-1/3 p-6">
                <div className="max-w-sm w-full space-y-8 bg-white/90 rounded-2xl shadow-xl p-10 border border-gray-100 backdrop-blur-md">
                    {/* Essa div tem a parte superior da Coluna Central */}
                    <div className="flex flex-col items-center space-y-2">
                        {/* Texto Simples de Bem-vindo */}
                        <h2 className="text-base font-semibold text-gray-500 tracking-widest">Bem-Vindo Ao</h2>

                        <div className="flex flex-col items-center">
                            {/* Título do Sistema */}
                            <h1 className="text-3xl font-extrabold text-red-600 drop-shadow-sm text-center">
                                Sistema de Chamados
                            </h1>

                            {/* Imagem do Logo do Senai  */}
                            <span className="inline-block align-middle mt-3">
                                <Image
                                    src="/ImagensLogin/SenaiLogo.png"
                                    alt="Ícone de chamado"
                                    width={100}
                                    height={100}
                                    className="rounded-md shadow-lg shadow-red-200/60"
                                />
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-center">Faça Seu Login e Conheça Suas Novidades</p>

                    {/* Formulário de Login */}
                    <form className="space-y-5" onSubmit={(e) => {
                        handleSubmit(e);
                    }} autoComplete="off">
                        {/* Espaço para o usuário digitar o email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Digite o Email:
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition outline-none bg-gray-50 shadow-sm text-black"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailErro('');
                                }}
                                autoComplete="off"
                                required
                            />

                            {emailErro && <span className="text-red-500 text-xs">{emailErro}</span>}
                        </div>

                        {/* Espaço para o usuário digitar a senha */}
                        <div className="relative">
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                                Digite a Senha:
                            </label>
                            <input
                                id="senha"
                                type={showSenha ? 'text' : 'password'}
                                placeholder="• • • • • •"
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition outline-none bg-gray-50 shadow-sm text-black pr-10"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="new-password"
                                required
                            />

                            {/* Botão para mostrar e ocultar senha */}
                            <button
                                type="button"
                                onClick={() => setShowSenha((v) => !v)}
                                className="absolute top-9 right-3 text-gray-500 hover:text-red-500 focus:outline-none cursor-pointer"
                                tabIndex={-1}
                                aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showSenha ? <Eye /> : <EyeClosed />}
                            </button>
                        </div>

                        {/* Botão de Login */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-md cursor-pointer transition-all duration-200"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </section>

            {/* Coluna direita */}
            <section className="relative w-1/3 hidden lg:block">
                <Image
                    src="/ImagensLogin/SenaiDireitaLogin.jpg"
                    alt="Profissional SENAI"
                    fill
                    className="object-cover shadow-2xl shadow-blue-200/60"
                />
            </section>
        </main>
    );
}
