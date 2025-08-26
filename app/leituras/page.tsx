'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DailyReadings, getDailyReadings, getWeeklyReadings, getSaintOfTheDay, getLiturgicalColorName } from '@/lib/liturgical-readings';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, RefreshCw, ExternalLink, Copy } from 'lucide-react';

export default function LeiturasPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [readings, setReadings] = useState<DailyReadings | null>(null);
  const [weeklyReadings, setWeeklyReadings] = useState<DailyReadings[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReading, setSelectedReading] = useState<string>('first');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  useEffect(() => {
    loadReadings();
  }, [selectedDate]);

  const loadReadings = async () => {
    setLoading(true);
    
    try {
      if (viewMode === 'day') {
        const dailyReadings = await getDailyReadings(selectedDate);
        setReadings(dailyReadings);
      } else {
        const weekly = await getWeeklyReadings(selectedDate);
        setWeeklyReadings(weekly);
      }
    } catch (error) {
      console.error('Erro ao carregar leituras:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Texto copiado para a área de transferência!');
  };

  const saint = getSaintOfTheDay(selectedDate);
  const currentReading = readings?.readings.find(r => r.type === selectedReading) || readings?.readings[0];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <BookOpen className="text-purple-600" />
              Leituras Litúrgicas
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Leituras diárias da liturgia católica
            </p>
          </div>

          {/* Controles de Data */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-auto"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                >
                  Hoje
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadReadings}
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Carregando leituras...</span>
            </div>
          ) : readings ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informações do Dia */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Informações Litúrgicas
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Data:</span>
                      <p className="text-gray-900">
                        {selectedDate.toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Celebração:</span>
                      <p className="text-purple-700 font-medium">{readings.celebration}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Tempo:</span>
                      <p className="text-gray-900">{readings.season}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Cor Litúrgica:</span>
                      <p className="text-green-700 font-medium">{getLiturgicalColorName(readings.color)}</p>
                    </div>
                    
                    {saint && (
                      <div>
                        <span className="font-medium text-gray-700">Santo do Dia:</span>
                        <p className="text-yellow-700 font-medium">{saint}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://www.cnbb.org.br/liturgia-diaria/', '_blank')}
                        className="flex items-center gap-2 text-xs"
                      >
                        <ExternalLink className="h-3 w-3" />
                        CNBB
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://www.vatican.va/', '_blank')}
                        className="flex items-center gap-2 text-xs"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Vatican
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leituras */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border">
                  {/* Navegação das leituras */}
                  <div className="p-4 border-b">
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
                  </div>

                  {/* Leitura selecionada */}
                  {currentReading && (
                    <div className="p-6">
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
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Leituras não disponíveis para esta data</p>
              <Button onClick={loadReadings} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
