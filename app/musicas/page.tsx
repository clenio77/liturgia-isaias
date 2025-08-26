'use client';

import { useState } from 'react';
import { Music, Search, Upload, Play, Pause, Download, Edit, Trash2 } from 'lucide-react';

export default function MusicasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [playingId, setPlayingId] = useState<number | null>(null);

  // Dados mock das músicas
  const musicas = [
    {
      id: 1,
      titulo: 'Vem, Espírito Santo',
      compositor: 'Pe. José Weber',
      categoria: 'Entrada',
      tempo: 'Pentecostes',
      tom: 'G',
      duracao: '3:45',
      arquivo: 'vem-espirito-santo.pdf',
      audio: 'vem-espirito-santo.mp3'
    },
    {
      id: 2,
      titulo: 'Salmo 33',
      compositor: 'Tradicional',
      categoria: 'Salmo',
      tempo: 'Tempo Comum',
      tom: 'D',
      duracao: '2:30',
      arquivo: 'salmo-33.pdf',
      audio: 'salmo-33.mp3'
    },
    {
      id: 3,
      titulo: 'Pão da Vida',
      compositor: 'Ir. Miria Kolling',
      categoria: 'Comunhão',
      tempo: 'Tempo Comum',
      tom: 'C',
      duracao: '4:12',
      arquivo: 'pao-da-vida.pdf',
      audio: 'pao-da-vida.mp3'
    }
  ];

  const filteredMusicas = musicas.filter(musica => 
    musica.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    musica.compositor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (selectedCategory === '' || musica.categoria === selectedCategory)
  );

  const handlePlay = (id: number) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Music className="text-purple-600" />
            Biblioteca Musical
          </h1>
          <p className="text-gray-600">Gerencie todas as músicas do repertório litúrgico</p>
        </div>

        {/* Filtros e Upload */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar música..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              <option value="Entrada">Entrada</option>
              <option value="Salmo">Salmo</option>
              <option value="Ofertório">Ofertório</option>
              <option value="Comunhão">Comunhão</option>
              <option value="Final">Final</option>
            </select>

            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Todos os tempos</option>
              <option value="advento">Advento</option>
              <option value="natal">Natal</option>
              <option value="quaresma">Quaresma</option>
              <option value="pascoa">Páscoa</option>
              <option value="comum">Tempo Comum</option>
            </select>

            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Nova Música
            </button>
          </div>
        </div>

        {/* Lista de Músicas */}
        <div className="grid gap-4">
          {filteredMusicas.map((musica) => (
            <div key={musica.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handlePlay(musica.id)}
                    className="bg-purple-100 hover:bg-purple-200 p-3 rounded-full transition-colors"
                  >
                    {playingId === musica.id ? (
                      <Pause className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Play className="h-5 w-5 text-purple-600" />
                    )}
                  </button>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{musica.titulo}</h3>
                    <p className="text-gray-600">{musica.compositor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Categoria</p>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                      {musica.categoria}
                    </span>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">Tom</p>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-mono">
                      {musica.tom}
                    </span>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">Duração</p>
                    <span className="text-gray-700 text-sm">{musica.duracao}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {playingId === musica.id && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="bg-purple-200 h-2 rounded-full">
                        <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
                      </div>
                    </div>
                    <span className="text-sm text-purple-600">1:15 / {musica.duracao}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredMusicas.length === 0 && (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhuma música encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou adicionar uma nova música</p>
          </div>
        )}
      </div>
    </div>
  );
}
