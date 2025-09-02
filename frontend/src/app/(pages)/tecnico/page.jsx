'use client';

import { useState, useEffect } from 'react';
import { API } from '../../../config/routes';

import { Clock, CheckCircle, Filter, Calendar, Layers, Send, FileText, AlertCircle } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function Tecnico() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('pool');
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [reload, setReload] = useState(false);
    const [chamados, setChamados] = useState([]);
    const [apontamento, setApontamento] = useState('');
    const [loading, setLoading] = useState(false);

    // Busca chamados do técnico e, se necessário, os apontamentos
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

                // Buscar apontamentos para todos os chamados (não só concluídos)
                const chamadosComApontamentos = await Promise.all(
                    data.map(async (chamado) => {
                        try {
                            const apontamentosResponse = await fetch(API.GET_TICKET_NOTES(chamado.id), {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            let apontamentos = [];
                            if (apontamentosResponse.ok) {
                                apontamentos = await apontamentosResponse.json();
                            }
                            // Pega o último apontamento (mais recente)
                            const ultimoApontamento =
                                apontamentos.length > 0 ? apontamentos[apontamentos.length - 1] : null;
                            return {
                                ...chamado,
                                apontamentos: apontamentos,
                                apontamento: ultimoApontamento?.descricao || null,
                            };
                        } catch (err) {
                            // Se der erro, retorna o chamado sem apontamentos
                            console.error('Erro ao buscar apontamentos:', err);
                            return { ...chamado, apontamentos: [], apontamento: null };
                        }
                    })
                );
                setChamados(chamadosComApontamentos);
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

            // Limpa o apontamento e atualiza a lista
            setApontamento('');
            setReload(!reload);

            // Muda automaticamente para a aba em andamento
            setActiveTab('emProgresso');
            handleFecharDetalhes();
        } catch (err) {
            console.error('Erro ao atribuir técnico:', err);
        }
    };

    // Resolver chamado com apontamento
    const handleResolverChamado = async () => {
        if (!apontamento.trim()) {
            alert('Por favor, insira um apontamento antes de resolver o chamado.');
            return;
        }

        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) return router.push('/');

        setLoading(true);

        try {
            const response = await fetch(API.RESOLVE_TICKET(chamadoSelecionado.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    apontamento: apontamento,
                    status: 'concluido', // ✅ Corrigido: com acento
                }),
            });

            if (!response.ok) {
                console.error('Erro ao resolver chamado:', response.status);
                alert('Erro ao resolver chamado. Tente novamente.');
                return;
            }

            // Limpa o apontamento
            setApontamento('');

            // Atualiza a lista de chamados
            setReload(!reload);

            // Muda automaticamente para a aba de resolvidos
            setActiveTab('concluidos');

            // Fecha os detalhes
            handleFecharDetalhes();

            alert('Chamado concluido com sucesso!');
        } catch (err) {
            console.error('Erro ao resolver chamado:', err);
            alert('Erro ao resolver chamado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChamadoClick = (chamado) => {
        setChamadoSelecionado(chamado);
        // Limpa o apontamento ao selecionar um novo chamado
        setApontamento('');
    };

    const handleFecharDetalhes = () => {
        setChamadoSelecionado(null);
        setApontamento('');
    };

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
                            <span>Pool de Chamados</span>
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
                            <span>Em Andamento</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('concluidos')}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-gray-500 ${
                                activeTab === 'concluidos'
                                    ? 'bg-green-100 text-green-700 font-medium'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            <CheckCircle className="h-5 w-5" />
                            <span>Concluídos</span>
                        </button>
                    </nav>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                        {activeTab === 'pool' && <Layers className="h-5 w-5 mr-2 text-red-600" />}
                        {activeTab === 'emProgresso' && <Clock className="h-5 w-5 mr-2 text-yellow-600" />}
                        {activeTab === 'concluidos' && <CheckCircle className="h-5 w-5 mr-2 text-green-600" />}
                        {activeTab === 'pool' && 'Pool de Chamados'}
                        {activeTab === 'emProgresso' && 'Chamados Em Andamento'}
                        {activeTab === 'concluidos' && 'Chamados Concluidos'}
                    </h2>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div
                            className={`${
                                chamadoSelecionado ? 'lg:w-1/2' : 'w-full'
                            } bg-white rounded-lg border border-gray-200`}
                        >
                            <div className="space-y-4 p-4">
                                {chamados
                                    .filter((chamado) => {
                                        if (activeTab === 'pool')
                                            return chamado.status === 'pendente' && !chamado.tecnico_id;
                                        if (activeTab === 'emProgresso')
                                            return chamado.status === 'em andamento' && chamado.tecnico_id;
                                        if (activeTab === 'concluidos')
                                            return chamado.status === 'concluido' && chamado.tecnico_id; // ✅ Corrigido: com acento
                                        return false;
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

                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {chamado.descricao}
                                            </p>

                                            {/* Mostra preview do apontamento nos resolvidos */}
                                            {activeTab === 'concluidos' &&
                                                chamado.apontamentos &&
                                                chamado.apontamentos.length > 0 && (
                                                    <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 rounded">
                                                        <p className="text-xs text-green-600 font-medium flex items-center">
                                                            <FileText className="h-3 w-3 mr-1" />
                                                            Apontamentos:
                                                        </p>
                                                        {chamado.apontamentos.map((apontamento, index) => (
                                                            <div
                                                                key={apontamento.id}
                                                                className={
                                                                    index > 0
                                                                        ? 'mt-2 pt-2 border-t border-green-200'
                                                                        : ''
                                                                }
                                                            >
                                                                <p className="text-sm text-green-700 line-clamp-2">
                                                                    {apontamento.descricao}
                                                                </p>
                                                                <p className="text-xs text-green-600 mt-1">
                                                                    {new Date(apontamento.criado_em).toLocaleString(
                                                                        'pt-BR'
                                                                    )}
                                                                    {apontamento.duracao &&
                                                                        ` • Duração: ${Math.round(
                                                                            apontamento.duracao / 60
                                                                        )} min`}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                                <div className="flex items-center space-x-4">
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {new Date(chamado.criado_em).toLocaleString('pt-BR')}
                                                    </span>
                                                </div>
                                                {chamado.tipo && (
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                        {chamado.tipo}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                {chamados.filter((chamado) => {
                                    if (activeTab === 'pool')
                                        return chamado.status === 'pendente' && !chamado.tecnico_id;
                                    if (activeTab === 'emProgresso')
                                        return chamado.status === 'em andamento' && chamado.tecnico_id;
                                    if (activeTab === 'concluidos')
                                        return chamado.status === 'concluido' && chamado.tecnico_id; // ✅ Corrigido: com acento
                                    return false;
                                }).length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                        <p>Nenhum chamado encontrado nesta categoria</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {chamadoSelecionado && (
                            <div className="lg:w-1/2 bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Detalhes do Chamado</h2>
                                    <button
                                        onClick={handleFecharDetalhes}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {chamadoSelecionado.titulo}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    chamadoSelecionado.status === 'pendente'
                                                        ? 'bg-red-100 text-red-800'
                                                        : chamadoSelecionado.status === 'em andamento'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                            >
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
                                            <p className="font-medium text-gray-700">
                                                {chamadoSelecionado.usuario || 'Não informado'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Categoria</p>
                                            <p className="font-medium text-gray-700">
                                                {chamadoSelecionado.tipo || 'Não informado'}
                                            </p>
                                        </div>
                                        {chamadoSelecionado.tecnico && (
                                            <div>
                                                <p className="text-xs text-gray-500">Técnico Responsável</p>
                                                <p className="font-medium text-gray-700">
                                                    {chamadoSelecionado.tecnico}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Descrição</h4>
                                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                                            {chamadoSelecionado.descricao}
                                        </p>
                                    </div>

                                    {/* Mostra o apontamento completo se o chamado estiver resolvido */}
                                    {chamadoSelecionado.status === 'concluido' && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                <FileText className="h-4 w-4 mr-1" />
                                                Apontamentos da Resolução
                                            </h4>
                                            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                                                {chamadoSelecionado.apontamentos &&
                                                chamadoSelecionado.apontamentos.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {chamadoSelecionado.apontamentos.map((apontamento, index) => (
                                                            <div
                                                                key={apontamento.id}
                                                                className="border-b border-green-200 last:border-b-0 pb-2 last:pb-0"
                                                            >
                                                                <p className="text-green-700 whitespace-pre-wrap">
                                                                    {apontamento.descricao}
                                                                </p>
                                                                <p className="text-xs text-green-600 mt-1">
                                                                    {new Date(apontamento.criado_em).toLocaleString(
                                                                        'pt-BR'
                                                                    )}
                                                                    {apontamento.duracao &&
                                                                        ` • Duração: ${Math.round(
                                                                            apontamento.duracao / 60
                                                                        )} min`}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-green-700">Nenhum apontamento encontrado.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Área de apontamento - APENAS para chamados em andamento */}
                                    {chamadoSelecionado.status === 'em andamento' && activeTab === 'emProgresso' && (
                                        <>
                                            <div className="border-t pt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    Criar Apontamento para Resolução
                                                </h4>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                                    <p className="text-xs text-blue-600 flex items-center">
                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                        Descreva detalhadamente a solução aplicada para resolver este
                                                        chamado
                                                    </p>
                                                </div>
                                                <textarea
                                                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                                    id="apontamento"
                                                    rows="5"
                                                    value={apontamento}
                                                    onChange={(e) => setApontamento(e.target.value)}
                                                    maxLength={500}
                                                    placeholder="Descreva o que foi feito para resolver o chamado, incluindo as ações tomadas, problemas encontrados e a solução aplicada..."
                                                />
                                                <p className="text-xs text-gray-500 mt-1" >
                                                    {apontamento.length}/500 caracteres
                                                </p>
                                            </div>

                                            <div className="flex justify-end gap-3 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleResolverChamado}
                                                    disabled={loading || !apontamento.trim()}
                                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all
                                                        ${
                                                            loading || !apontamento.trim()
                                                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                                                : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                                                        }`}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                                            <span>Resolvendo...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle size={16} />
                                                            Resolver Chamado
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Botão para se atribuir ao chamado - APENAS no pool */}
                                    {activeTab === 'pool' && !chamadoSelecionado.tecnico_id && (
                                        <div className="border-t pt-4">
                                            <button
                                                onClick={handleCandidatar}
                                                className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <Send size={16} />
                                                Atribuir-se ao Chamado
                                            </button>
                                        </div>
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
