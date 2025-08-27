'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Upload,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Database
} from 'lucide-react';

interface MusicRecord {
  id: number;
  title: string;
  composer: string;
  category: string;
  liturgical_season: string;
  musical_key: string;
  tempo: string;
  difficulty: string;
  audio_url?: string;
  sheet_url?: string;
  lyrics_url?: string;
  chords_url?: string;
  tags: string[];
  status: string;
  verified: boolean;
  created_at: string;
}

export default function MusicasPage() {
  const [musics, setMusics] = useState<MusicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadMusics();
  }, [searchQuery, selectedCategory, selectedSeason]);

  const loadMusics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSeason) params.append('season', selectedSeason);

      const response = await fetch(`/api/musics?${params}`);
      const data = await response.json();

      if (data.success) {
        setMusics(data.musics);
      }
    } catch (error) {
      console.error('Erro ao carregar músicas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (id: number, audioUrl?: string) => {
    if (!audioUrl) return;
    
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setPlayingId(null);
    }
  };

  const categories = ['Entrada', 'Salmo', 'Aclamação', 'Ofertório', 'Comunhão', 'Final', 'Adoração'];
  const seasons = ['Tempo Comum', 'Advento', 'Natal', 'Quaresma', 'Páscoa', 'Todos'];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Database className="h-6 w-6" />
              Banco de Músicas SQLite
            </h1>
            <p className="text-gray-600">
              Gerencie seu repertório litúrgico completo • {musics.length} músicas cadastradas
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={loadMusics}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Atualizar
            </Button>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Música
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Músicas</p>
                <p className="text-2xl font-bold">{musics.length}</p>
              </div>
              <Music className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Com Áudio</p>
                <p className="text-2xl font-bold">{musics.filter(m => m.audio_url).length}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verificadas</p>
                <p className="text-2xl font-bold">{musics.filter(m => m.verified).length}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">{musics.filter(m => !m.verified).length}</p>
              </div>
              <Upload className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h3 className="font-medium">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar músicas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os tempos</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Músicas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando músicas do SQLite...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {musics.map((music) => (
              <div key={music.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {music.title}
                      </h3>
                      {music.verified && (
                        <Badge className="bg-green-100 text-green-800">
                          Verificada
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {music.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      <strong>Compositor:</strong> {music.composer}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>Tom: {music.musical_key}</span>
                      <span>Tempo: {music.tempo}</span>
                      <span>Dificuldade: {music.difficulty}</span>
                      <span>Tempo Litúrgico: {music.liturgical_season}</span>
                    </div>
                    
                    {music.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {music.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {music.audio_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlay(music.id, music.audio_url)}
                      >
                        {playingId === music.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    
                    {music.sheet_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(music.sheet_url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Arquivos disponíveis */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-gray-500">
                  <span>Arquivos:</span>
                  {music.audio_url && <Badge variant="outline">Áudio</Badge>}
                  {music.sheet_url && <Badge variant="outline">Partitura</Badge>}
                  {music.lyrics_url && <Badge variant="outline">Letra</Badge>}
                  {music.chords_url && <Badge variant="outline">Cifras</Badge>}
                  {!music.audio_url && !music.sheet_url && !music.lyrics_url && !music.chords_url && (
                    <span className="text-gray-400">Nenhum arquivo</span>
                  )}
                </div>
              </div>
            ))}
            
            {musics.length === 0 && (
              <div className="bg-white rounded-lg border p-12 text-center">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Banco SQLite Vazio
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedCategory || selectedSeason
                    ? 'Nenhuma música encontrada com os filtros aplicados.'
                    : 'Comece adicionando suas primeiras músicas ao banco de dados.'}
                </p>
                <Button onClick={() => setShowUploadModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Música
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Modal de Upload */}
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="🎵 Adicionar Nova Música ao SQLite"
          size="lg"
        >
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Como Funciona:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Faça upload dos arquivos (áudio, partitura, cifra, letra)</li>
                <li>2. Preencha as informações da música</li>
                <li>3. A música será salva no banco SQLite</li>
                <li>4. Estará disponível para uso nas missas</li>
              </ol>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
              <p className="text-sm text-gray-500">Suporta: MP3, WAV, PDF, TXT</p>
              <Button className="mt-4">
                Selecionar Arquivos
              </Button>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancelar
              </Button>
              <Button>
                Salvar no SQLite
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
