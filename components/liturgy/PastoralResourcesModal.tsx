'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { DailyReadings } from '@/lib/liturgical-readings';
import { PastoralResources, getPastoralResources, HomilySuggestion } from '@/lib/homily-system';
import { 
  BookOpen, 
  MessageSquare, 
  Heart, 
  Lightbulb, 
  Music, 
  Palette, 
  GraduationCap,
  Copy,
  RefreshCw,
  Clock,
  Users
} from 'lucide-react';

interface PastoralResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  readings: DailyReadings;
  date: Date;
}

export function PastoralResourcesModal({ isOpen, onClose, readings, date }: PastoralResourcesModalProps) {
  const [resources, setResources] = useState<PastoralResources | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'homilies' | 'exegesis' | 'prayers' | 'music' | 'decoration' | 'catechesis'>('homilies');
  const [selectedHomily, setSelectedHomily] = useState<HomilySuggestion | null>(null);

  useEffect(() => {
    if (isOpen && readings) {
      loadResources();
    }
  }, [isOpen, readings, date]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const pastoralResources = await getPastoralResources(date, readings);
      setResources(pastoralResources);
      if (pastoralResources.homilySuggestions.length > 0) {
        setSelectedHomily(pastoralResources.homilySuggestions[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar recursos pastorais:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Texto copiado para a área de transferência!');
  };

  const tabs = [
    { id: 'homilies', label: 'Homilias', icon: MessageSquare },
    { id: 'exegesis', label: 'Exegese', icon: BookOpen },
    { id: 'prayers', label: 'Orações', icon: Heart },
    { id: 'music', label: 'Música', icon: Music },
    { id: 'decoration', label: 'Decoração', icon: Palette },
    { id: 'catechesis', label: 'Catequese', icon: GraduationCap }
  ];

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Carregando Recursos..." size="xl">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Preparando recursos pastorais...</span>
        </div>
      </Modal>
    );
  }

  if (!resources) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Erro" size="xl">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Erro ao carregar recursos pastorais</p>
          <Button onClick={loadResources}>Tentar Novamente</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="🛠️ Recursos Pastorais" 
      size="xl"
    >
      <div className="space-y-6">
        {/* Header com informações da data */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-2">
            {date.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <p className="text-sm text-purple-700">{readings.celebration}</p>
        </div>

        {/* Navegação por abas */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <div className="min-h-[400px]">
          {activeTab === 'homilies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Sugestões de Homilia</h3>
                <span className="text-sm text-gray-500">
                  {resources.homilySuggestions.length} sugestão(ões)
                </span>
              </div>

              {resources.homilySuggestions.length > 1 && (
                <div className="flex gap-2 mb-4">
                  {resources.homilySuggestions.map((homily, index) => (
                    <Button
                      key={homily.id}
                      variant={selectedHomily?.id === homily.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedHomily(homily)}
                    >
                      Opção {index + 1}
                    </Button>
                  ))}
                </div>
              )}

              {selectedHomily && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedHomily.theme.title}
                      </h4>
                      <p className="text-gray-600 mb-3">{selectedHomily.theme.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {selectedHomily.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {selectedHomily.targetAudience === 'general' ? 'Geral' : selectedHomily.targetAudience}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`${selectedHomily.theme.title}\n\n${selectedHomily.introduction}\n\n${selectedHomily.mainPoints.join('\n\n')}\n\n${selectedHomily.conclusion}`)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Introdução</h5>
                      <p className="text-gray-700 leading-relaxed">{selectedHomily.introduction}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Pontos Principais</h5>
                      <ul className="space-y-2">
                        {selectedHomily.mainPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Conclusão</h5>
                      <p className="text-gray-700 leading-relaxed">{selectedHomily.conclusion}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Aplicação Prática</h5>
                        <p className="text-gray-700 text-sm">{selectedHomily.practicalApplication}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Sugestão de Oração</h5>
                        <p className="text-gray-700 text-sm italic">{selectedHomily.prayerSuggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'exegesis' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Comentários Exegéticos</h3>
              <div className="space-y-4">
                {resources.exegeticalComments.map((comment, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {comment.reading === 'first' ? 'Primeira Leitura' :
                         comment.reading === 'psalm' ? 'Salmo Responsorial' :
                         comment.reading === 'second' ? 'Segunda Leitura' : 'Evangelho'} - {comment.reference}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${comment.reference}\n\nContexto: ${comment.historicalContext}\nMensagem: ${comment.keyMessage}\nAplicação: ${comment.pastoralApplication}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Contexto Histórico:</p>
                        <p className="text-gray-600">{comment.historicalContext}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Gênero Literário:</p>
                        <p className="text-gray-600">{comment.literaryGenre}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Mensagem Principal:</p>
                        <p className="text-gray-600">{comment.keyMessage}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Aplicação Pastoral:</p>
                        <p className="text-gray-600">{comment.pastoralApplication}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prayers' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Orações Litúrgicas</h3>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Oração da Coleta</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(resources.prayers.collectPrayer)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-700 italic">{resources.prayers.collectPrayer}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Oração dos Fiéis</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(resources.prayers.prayerOfTheFaithful.join('\n\n'))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {resources.prayers.prayerOfTheFaithful.map((prayer, index) => (
                      <li key={index} className="text-gray-700">
                        <span className="font-medium">{index + 1}.</span> {prayer}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Oração sobre as Oferendas</h4>
                    <p className="text-gray-700 text-sm italic">{resources.prayers.offertoryPrayer}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Oração após a Comunhão</h4>
                    <p className="text-gray-700 text-sm italic">{resources.prayers.communionPrayer}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Sugestões Musicais</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 mb-2">🎵 Integração com Sistema de Músicas</p>
                <p className="text-blue-700 text-sm">
                  As sugestões musicais estão integradas com o sistema de IA litúrgica. 
                  Use a função "Nova Missa" para obter sugestões personalizadas.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'decoration' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Ideias de Decoração</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.decorationIdeas.map((idea, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Palette className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-medium text-gray-900">{idea}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'catechesis' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Pontos para Catequese</h3>
              <div className="space-y-3">
                {resources.catechesisPoints.map((point, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <GraduationCap className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-gray-500">
            <p>🛠️ Recursos pastorais baseados nas leituras litúrgicas</p>
            <p>Para uso em preparação de celebrações e catequese</p>
          </div>
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
}
