'use client';

import { useState, useEffect } from 'react';
import { API } from '../../../config/routes';

import {
    Clock,
    CheckCircle,
    Filter,
    Calendar,
    Layers,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function Tecnico() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('pool');
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [reload, setReload] = useState(false);
    const [chamados, setChamados] = useState([]);

    // Busca chamados do técnico
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) router.push('/');
        (async () => {
            try {
                const response = await fetch(API.GET_TECHNICIAN_TICKETS, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    console.error('Erro ao buscar chamados:', response.status);
                    return;
                }
                const data = await response.json();
                setChamados(data);
            } catch (err) {
                console.error('Erro na requisição:', err);
            }
        })();
    }, [reload]);

    // Atribuir-se ao chamado
    const handleCandidatar = async () => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) return router.push('/');

        try {
            const response = await fetch(API.SET_TECHNICIAN(chamadoSelecionado.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ tecnicoId: token }),
            });

            if (!response.ok) {
                console.error('Erro ao atribuir técnico:', response.status);
                return;
            }
            setReload(!reload);
            handleFecharDetalhes();
        } catch (err) {
            console.error('Erro ao atribuir técnico:', err);
        }
    };

    const handleChamadoClick = (chamado) => setChamadoSelecionado(chamado);
    const handleFecharDetalhes = () => setChamadoSelecionado(null);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">Área do Técnico</h1>
                    <p className="text-red-100">Gerencie os chamados técnicos de forma eficiente</p>
                </div>
            </header>

            <div className="container mx-auto p-6 flex-1 overflow-auto">
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <nav className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setActiveTab('pool')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${
                                activeTab === 'pool' ? 'bg-red-100 text-red-700 font-medium' : 'hover:bg-gray-100'
                            }`}
                        >
                            <Layers className="h-5 w-5" />
                            <span>Chamados</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('emProgresso')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${
                                activeTab === 'emProgresso'
                                    ? 'bg-yellow-100 text-yellow-700 font-medium'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <Clock className="h-5 w-5" />
                            <span>Em andamento</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('resolvidos')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${
                                activeTab === 'resolvidos'
                                    ? 'bg-green-100 text-green-700 font-medium'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <CheckCircle className="h-5 w-5" />
                            <span>Resolvidos</span>
                        </button>
                    </nav>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        {activeTab === 'pool' && <Layers className="h-5 w-5 mr-2 text-red-600" />}
                        {activeTab === 'emProgresso' && <Clock className="h-5 w-5 mr-2 text-yellow-600" />}
                        {activeTab === 'resolvidos' && <CheckCircle className="h-5 w-5 mr-2 text-green-600" />}
                        {activeTab === 'pool' && 'Pool de Chamados'}
                        {activeTab === 'emProgresso' && 'Chamados Em Progresso'}
                        {activeTab === 'resolvidos' && 'Chamados Resolvidos'}
                    </h2>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className={`${chamadoSelecionado ? 'lg:w-1/2' : 'w-full'} bg-white rounded-lg border border-gray-200`}>
                            <div className="space-y-4 p-4">
                                {chamados
                                    .filter((chamado) => {
                                        if (activeTab === 'pool')
                                            return chamado.status === 'pendente' && !chamado.tecnico_id;
                                        if (activeTab === 'emProgresso')
                                            return chamado.status === 'em andamento' && chamado.tecnico_id;
                                        if (activeTab === 'resolvidos')
                                            return chamado.status === 'resolvido' && chamado.tecnico_id;
                                        return true;
                                    })
                                    .map((chamado) => (
                                        <div
                                            key={chamado.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                chamadoSelecionado?.id === chamado.id
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                                            }`}
                                            onClick={() => handleChamadoClick(chamado)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-gray-800">{chamado.titulo}</h3>
                                                <div
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        chamado.status === 'pendente'
                                                            ? 'bg-red-100 text-red-800'
                                                            : chamado.status === 'em andamento'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}
                                                >
                                                    {chamado.status}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{chamado.descricao}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center space-x-4">
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {new Date(chamado.criado_em).toLocaleString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {chamadoSelecionado && (
                            <div className="lg:w-1/2 bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Detalhes do Chamado</h2>
                                    <button onClick={handleFecharDetalhes} className="text-gray-500 hover:text-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-medium text-gray-800">{chamadoSelecionado.titulo}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                chamadoSelecionado.status === 'pendente'
                                                    ? 'bg-red-100 text-red-800'
                                                    : chamadoSelecionado.status === 'em andamento'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {chamadoSelecionado.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {new Date(chamadoSelecionado.criado_em).toLocaleString('pt-BR')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-500">Solicitante</p>
                                            <p className="font-medium text-gray-700">{chamadoSelecionado.usuario}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Categoria</p>
                                            <p className="font-medium text-gray-700">{chamadoSelecionado.tipo}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Descrição</h4>
                                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{chamadoSelecionado.descricao}</p>
                                    </div>

                                    {activeTab === 'pool' && !chamadoSelecionado.tecnico_id && (
                                        <button
                                            onClick={handleCandidatar}
                                            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                                        >
                                            Atribuir-se ao Chamado
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
