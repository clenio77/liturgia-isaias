'use client';

import { useState } from 'react';
import { BarChart3, Calendar, Download, TrendingUp, Music, Users, FileText } from 'lucide-react';

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [selectedReport, setSelectedReport] = useState('geral');

  // Dados mock para relatórios
  const stats = {
    musicasUsadas: 45,
    repertoriosCriados: 12,
    usuariosAtivos: 8,
    celebracoes: 16
  };

  const musicasPopulares = [
    { nome: 'Vem, Espírito Santo', usos: 8, categoria: 'Entrada' },
    { nome: 'Pão da Vida', usos: 6, categoria: 'Comunhão' },
    { nome: 'Salmo 33', usos: 5, categoria: 'Salmo' },
    { nome: 'Recebe, ó Deus', usos: 4, categoria: 'Ofertório' }
  ];

  const celebracoesPorTempo = [
    { tempo: 'Tempo Comum', quantidade: 10 },
    { tempo: 'Advento', quantidade: 3 },
    { tempo: 'Natal', quantidade: 2 },
    { tempo: 'Quaresma', quantidade: 1 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <BarChart3 className="text-green-600" />
            Relatórios e Estatísticas
          </h1>
          <p className="text-gray-600">Acompanhe o uso do sistema e performance do repertório</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="semana">Última Semana</option>
              <option value="mes">Último Mês</option>
              <option value="trimestre">Último Trimestre</option>
              <option value="ano">Último Ano</option>
            </select>

            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="geral">Relatório Geral</option>
              <option value="musicas">Músicas Mais Usadas</option>
              <option value="usuarios">Atividade de Usuários</option>
              <option value="celebracoes">Celebrações por Tempo</option>
            </select>

            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Músicas Utilizadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.musicasUsadas}</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% vs mês anterior
                </p>
              </div>
              <Music className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Repertórios Criados</p>
                <p className="text-2xl font-bold text-blue-600">{stats.repertoriosCriados}</p>
                <p className="text-xs text-blue-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% vs mês anterior
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-purple-600">{stats.usuariosAtivos}</p>
                <p className="text-xs text-purple-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +25% vs mês anterior
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Celebrações</p>
                <p className="text-2xl font-bold text-orange-600">{stats.celebracoes}</p>
                <p className="text-xs text-orange-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% vs mês anterior
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Músicas Mais Populares */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Músicas Mais Utilizadas</h2>
            <div className="space-y-4">
              {musicasPopulares.map((musica, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{musica.nome}</h3>
                    <p className="text-sm text-gray-600">{musica.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{musica.usos}</p>
                    <p className="text-xs text-gray-500">usos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Celebrações por Tempo Litúrgico */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Celebrações por Tempo Litúrgico</h2>
            <div className="space-y-4">
              {celebracoesPorTempo.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.tempo}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.quantidade / 16) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8">{item.quantidade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de Atividade (Simulado) */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Atividade do Sistema (Últimos 30 dias)</h2>
          <div className="h-64 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-end justify-center p-4">
            <div className="flex items-end gap-2 h-full">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="bg-green-500 rounded-t"
                  style={{ 
                    height: `${Math.random() * 80 + 20}%`, 
                    width: '8px' 
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>30 dias atrás</span>
            <span>Hoje</span>
          </div>
        </div>
      </div>
    </div>
  );
}
