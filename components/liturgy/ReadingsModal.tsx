'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { DailyReadings, getDailyReadings, getSaintOfTheDay, getLiturgicalColorName } from '@/lib/liturgical-readings';
import { PastoralResourcesModal } from './PastoralResourcesModal';
import { BookOpen, Calendar, Palette, User, Copy, ExternalLink, RefreshCw, MessageSquare } from 'lucide-react';

interface ReadingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date?: Date;
}

export function ReadingsModal({ isOpen, onClose, date = new Date() }: ReadingsModalProps) {
  const [readings, setReadings] = useState<DailyReadings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReading, setSelectedReading] = useState<string>('first');
  const [showPastoralResources, setShowPastoralResources] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReadings();
    }
  }, [isOpen, date]);

  const loadReadings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dailyReadings = await getDailyReadings(date);
      setReadings(dailyReadings);
    } catch (err) {
      setError('Erro ao carregar leituras');
      console.error('Erro ao carregar leituras:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Texto copiado para a área de transferência!');
  };

  const openCNBB = () => {
    window.open('https://www.cnbb.org.br/liturgia-diaria/', '_blank');
  };

  const openVatican = () => {
    window.open('https://www.vatican.va/news_services/liturgy/libretti/index.htm', '_blank');
  };

  const saint = getSaintOfTheDay(date);

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Carregando Leituras..." size="lg">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Buscando leituras litúrgicas...</span>
        </div>
      </Modal>
    );
  }

  if (error || !readings) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Erro ao Carregar Leituras" size="lg">
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || 'Leituras não disponíveis'}</p>
          <div className="flex justify-center gap-3">
            <Button onClick={loadReadings} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={openCNBB} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              CNBB
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  const currentReading = readings.readings.find(r => r.type === selectedReading) || readings.readings[0];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="📖 Leituras Litúrgicas" 
      size="xl"
    >
      <div className="space-y-6">
        {/* Header com informações do dia */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-900">
                  {date.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600">{readings.liturgicalDate}</p>
              <p className="text-sm font-medium text-purple-700">{readings.celebration}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  Cor Litúrgica: <span className="text-green-700">{getLiturgicalColorName(readings.color)}</span>
                </span>
              </div>
              
              {saint && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">{saint}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navegação das leituras */}
        <div className="flex flex-wrap gap-2">
          {readings.readings.map((reading) => (
            <Button
              key={reading.type}
              variant={selectedReading === reading.type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedReading(reading.type)}
              className="text-xs"
            >
              {reading.title}
            </Button>
          ))}
        </div>

        {/* Leitura selecionada */}
        {currentReading && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{currentReading.title}</h3>
                <p className="text-sm text-blue-600 font-medium">{currentReading.reference}</p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`${currentReading.title}\n${currentReading.reference}\n\n${currentReading.text}`)}
                className="flex items-center gap-2"
              >
                <Copy className="h-3 w-3" />
                Copiar
              </Button>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {currentReading.text}
              </div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={openCNBB}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              CNBB
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={openVatican}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              Vatican
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPastoralResources(true)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Recursos Pastorais
            </Button>
            <Button
              variant="outline"
              onClick={loadReadings}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>

        {/* Rodapé informativo */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t space-y-1">
          <p>
            📖 Leituras obtidas de fontes católicas confiáveis
          </p>
          <p>
            🔍 Fontes: CNBB (scraping), Base Local, Fallback Inteligente •
            Para leituras oficiais, consulte sempre o Missal Romano
          </p>
          {readings.readings.length > 0 && readings.readings[0].text.length < 100 && (
            <p className="text-yellow-600">
              ⚠️ Leituras resumidas - Para texto completo, acesse CNBB ou Vatican
            </p>
          )}
          {readings.readings.length > 0 && readings.readings[0].text.length > 500 && (
            <p className="text-green-600">
              ✅ Leituras completas obtidas com sucesso
            </p>
          )}
        </div>
      </div>

      {/* Modal de Recursos Pastorais */}
      {readings && (
        <PastoralResourcesModal
          isOpen={showPastoralResources}
          onClose={() => setShowPastoralResources(false)}
          readings={readings}
          date={date}
        />
      )}
    </Modal>
  );
}
