'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLiturgicalData } from '@/lib/liturgical-calendar';
import { getCompleteMassSuggestions } from '@/lib/music-suggestions';
import { Calendar, Music, Sparkles, Clock } from 'lucide-react';

export function LiturgicalDemo() {
  const [selectedDate, setSelectedDate] = useState('');
  const [liturgicalData, setLiturgicalData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [showDemo, setShowDemo] = useState(false);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    
    if (date) {
      // 1. DETECTAR TEMPO LITÚRGICO
      const liturgical = getLiturgicalData(new Date(date));
      setLiturgicalData(liturgical);
      
      // 2. GERAR SUGESTÕES DE MÚSICAS
      const musicSuggestions = getCompleteMassSuggestions(liturgical);
      setSuggestions(musicSuggestions);
      
      setShowDemo(true);
    } else {
      setShowDemo(false);
    }
  };

  const getColorClass = (color: string) => {
    const colors = {
      'green': 'bg-green-100 text-green-800 border-green-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200',
      'white': 'bg-gray-100 text-gray-800 border-gray-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'rose': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Sparkles className="text-blue-600" />
          Demonstração: IA Litúrgica
        </h1>
        <p className="text-gray-600">
          Selecione uma data e veja a mágica acontecer!
        </p>
      </div>

      {/* Input de Data */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            1. Selecione uma Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
              className="max-w-xs"
            />
            <div className="text-sm text-gray-500">
              Experimente: 25/12/2024 (Natal), 01/04/2024 (Páscoa), 08/12/2024 (Imaculada)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detecção Automática */}
      {liturgicalData && (
        <Card className="border-2 border-green-200 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              2. Detecção Automática do Tempo Litúrgico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Celebração:</label>
                  <p className="text-lg font-semibold text-gray-900">{liturgicalData.celebration}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Tempo Litúrgico:</label>
                  <p className="text-lg font-semibold text-gray-900">{liturgicalData.seasonName}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Cor Litúrgica:</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getColorClass(liturgicalData.color)}`}>
                    {liturgicalData.color} ({liturgicalData.color === 'green' ? 'Verde' : 
                                           liturgicalData.color === 'purple' ? 'Roxo' :
                                           liturgicalData.color === 'white' ? 'Branco' :
                                           liturgicalData.color === 'red' ? 'Vermelho' : 'Rosa'})
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Rank:</label>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{liturgicalData.rank}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sugestões de Músicas */}
      {suggestions && (
        <Card className="border-2 border-purple-200 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-600" />
              3. Sugestões Inteligentes de Músicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(suggestions).map(([categoria, sugestoes]: [string, any]) => (
                <div key={categoria} className="space-y-3">
                  <h4 className="font-semibold text-gray-800 capitalize border-b pb-2">
                    {categoria === 'ofertorio' ? 'Ofertório' : categoria}
                  </h4>
                  
                  <div className="space-y-2">
                    {sugestoes.slice(0, 2).map((sugestao: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {sugestao.musicas[0].titulo}
                            </p>
                            <p className="text-xs text-gray-600">
                              {sugestao.musicas[0].compositor}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              ✨ Score: {sugestao.score}%
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Tom: {sugestao.musicas[0].tom}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2 italic">
                          💡 {sugestao.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explicação */}
      {showDemo && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-yellow-800 mb-2">🎯 Como Funciona a IA</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <p><strong>1.</strong> Você seleciona uma data</p>
                <p><strong>2.</strong> Sistema calcula automaticamente o tempo litúrgico</p>
                <p><strong>3.</strong> IA analisa e sugere músicas com score de adequação</p>
                <p><strong>4.</strong> Resultado: Repertório inteligente pronto!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      {!showDemo && (
        <Card className="border-2 border-gray-200 bg-gray-50">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">
              👆 Selecione uma data acima para ver a IA em ação!
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleDateSelect('2024-12-25')}
              >
                Testar Natal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDateSelect('2024-03-31')}
              >
                Testar Páscoa
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDateSelect(new Date().toISOString().split('T')[0])}
              >
                Testar Hoje
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// CSS para animação
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
`;

// Adicionar estilos ao head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
