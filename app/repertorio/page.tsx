'use client';

import { useState } from 'react';
import { Calendar, Music, Search, Filter, Plus } from 'lucide-react';

export default function RepertorioPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Dados mock do repertório
  const repertorios = [
    {
      id: 1,
      data: '2024-08-26',
      tempo: 'Tempo Comum',
      domingo: '21º Domingo do Tempo Comum',
      entrada: 'Vem, Espírito Santo',
      salmo: 'Salmo 33',
      ofertorio: 'Recebe, ó Deus',
      comunhao: 'Eu sou o pão da vida',
      final: 'Ide em paz'
    },
    {
      id: 2,
      data: '2024-09-02',
      tempo: 'Tempo Comum',
      domingo: '22º Domingo do Tempo Comum',
      entrada: 'Cantai ao Senhor',
      salmo: 'Salmo 62',
      ofertorio: 'Ofertório da Paz',
      comunhao: 'Pão da Vida',
      final: 'Benção Final'
    }
  ];

  const filteredRepertorios = repertorios.filter(rep => 
    rep.domingo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.tempo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Music className="text-blue-600" />
            Repertório Litúrgico
          </h1>
          <p className="text-gray-600">Gerencie o repertório musical das celebrações</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar repertório..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os tempos</option>
              <option value="advento">Advento</option>
              <option value="natal">Natal</option>
              <option value="quaresma">Quaresma</option>
              <option value="pascoa">Páscoa</option>
              <option value="comum">Tempo Comum</option>
            </select>

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Repertório
            </button>
          </div>
        </div>

        {/* Lista de Repertórios */}
        <div className="grid gap-6">
          {filteredRepertorios.map((repertorio) => (
            <div key={repertorio.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{repertorio.domingo}</h3>
                  <p className="text-gray-600">{repertorio.tempo} • {new Date(repertorio.data).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-50">
                    Editar
                  </button>
                  <button className="text-green-600 hover:text-green-800 px-3 py-1 rounded-lg border border-green-200 hover:bg-green-50">
                    Usar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Entrada</h4>
                  <p className="text-sm text-blue-600">{repertorio.entrada}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Salmo</h4>
                  <p className="text-sm text-green-600">{repertorio.salmo}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">Ofertório</h4>
                  <p className="text-sm text-yellow-600">{repertorio.ofertorio}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-1">Comunhão</h4>
                  <p className="text-sm text-purple-600">{repertorio.comunhao}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-1">Final</h4>
                  <p className="text-sm text-red-600">{repertorio.final}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRepertorios.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhum repertório encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar um novo repertório</p>
          </div>
        )}
      </div>
    </div>
  );
}
