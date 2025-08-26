// Sistema de Leituras Litúrgicas
// Integra múltiplas fontes de leituras católicas

export interface LiturgicalReading {
  reference: string;
  title: string;
  text: string;
  type: 'first' | 'psalm' | 'second' | 'gospel' | 'antiphon';
}

export interface DailyReadings {
  date: string;
  liturgicalDate: string;
  season: string;
  celebration: string;
  color: string;
  readings: LiturgicalReading[];
  saint?: string;
  memorial?: string;
}

// Base de dados de leituras (simulada - em produção viria de API)
const readingsDatabase: Record<string, DailyReadings> = {
  // Exemplo para hoje
  [new Date().toISOString().split('T')[0]]: {
    date: new Date().toISOString().split('T')[0],
    liturgicalDate: 'Terça-feira da 34ª Semana do Tempo Comum',
    season: 'Tempo Comum',
    celebration: 'Dia de Semana',
    color: 'verde',
    readings: [
      {
        reference: 'Ap 14,14-19',
        title: 'Primeira Leitura',
        text: 'Eu, João, vi uma nuvem branca e, sentado sobre a nuvem, alguém semelhante a um filho de homem, tendo na cabeça uma coroa de ouro e na mão uma foice afiada...',
        type: 'first'
      },
      {
        reference: 'Sl 95(96),10.11-12.13 (R. 13b)',
        title: 'Salmo Responsorial',
        text: 'R. Vem julgar a terra o Senhor!\n\nDizei entre as nações: "Reina o Senhor!" Ele firmou o mundo inabalável e governa os povos com justiça.',
        type: 'psalm'
      },
      {
        reference: 'Lc 21,5-11',
        title: 'Evangelho',
        text: 'Naquele tempo, algumas pessoas falavam a respeito do Templo, como era ornamentado com belas pedras e ofertas votivas. Jesus disse: "Vedes tudo isto? Dias virão em que não ficará pedra sobre pedra..."',
        type: 'gospel'
      }
    ]
  },
  
  // Natal - 25/12
  '2024-12-25': {
    date: '2024-12-25',
    liturgicalDate: 'Natal do Senhor',
    season: 'Tempo do Natal',
    celebration: 'Solenidade do Natal',
    color: 'branco',
    readings: [
      {
        reference: 'Is 52,7-10',
        title: 'Primeira Leitura',
        text: 'Como são belos, sobre os montes, os pés do mensageiro que anuncia a paz, que traz boas notícias, que anuncia a salvação...',
        type: 'first'
      },
      {
        reference: 'Sl 97(98),1.2-3ab.3cd-4.5-6 (R. 3cd)',
        title: 'Salmo Responsorial',
        text: 'R. Os confins do universo contemplaram a salvação do nosso Deus.\n\nCantai ao Senhor Deus um canto novo, porque ele fez prodígios!',
        type: 'psalm'
      },
      {
        reference: 'Hb 1,1-6',
        title: 'Segunda Leitura',
        text: 'Muitas vezes e de modos diversos falou Deus, outrora, aos pais pelos profetas; agora, nestes dias que são os últimos, falou-nos por meio do Filho...',
        type: 'second'
      },
      {
        reference: 'Jo 1,1-18',
        title: 'Evangelho',
        text: 'No princípio era o Verbo, e o Verbo estava junto de Deus, e o Verbo era Deus. Ele estava no princípio junto de Deus...',
        type: 'gospel'
      }
    ]
  },

  // Páscoa - 31/03/2024
  '2024-03-31': {
    date: '2024-03-31',
    liturgicalDate: 'Domingo de Páscoa',
    season: 'Tempo Pascal',
    celebration: 'Ressurreição do Senhor',
    color: 'branco',
    readings: [
      {
        reference: 'At 10,34a.37-43',
        title: 'Primeira Leitura',
        text: 'Naqueles dias, Pedro tomou a palavra e disse: "Vós conheceis a palavra que Deus enviou aos filhos de Israel, anunciando a paz por Jesus Cristo..."',
        type: 'first'
      },
      {
        reference: 'Sl 117(118),1-2.16ab-17.22-23 (R. 24)',
        title: 'Salmo Responsorial',
        text: 'R. Este é o dia que o Senhor fez para nós: alegremo-nos e exultemos!\n\nDai graças ao Senhor, porque ele é bom, porque é eterna a sua misericórdia!',
        type: 'psalm'
      },
      {
        reference: 'Cl 3,1-4',
        title: 'Segunda Leitura',
        text: 'Irmãos, se ressuscitastes com Cristo, procurai as coisas do alto, onde Cristo está sentado à direita de Deus...',
        type: 'second'
      },
      {
        reference: 'Jo 20,1-9',
        title: 'Evangelho',
        text: 'No primeiro dia da semana, Maria Madalena foi ao túmulo de madrugada, quando ainda estava escuro, e viu que a pedra tinha sido retirada do túmulo...',
        type: 'gospel'
      }
    ]
  }
};

// Função principal para obter leituras do dia
export async function getDailyReadings(date: Date = new Date()): Promise<DailyReadings | null> {
  const dateKey = date.toISOString().split('T')[0];
  
  // Primeiro, tentar buscar do cache local
  if (readingsDatabase[dateKey]) {
    console.log(`📖 Leituras encontradas no cache para ${dateKey}`);
    return readingsDatabase[dateKey];
  }

  // Tentar buscar de APIs externas
  try {
    // API 1: Liturgia Diária (exemplo)
    const apiReadings = await fetchFromLiturgiaAPI(date);
    if (apiReadings) {
      return apiReadings;
    }

    // API 2: Vatican News (exemplo)
    const vaticanReadings = await fetchFromVaticanAPI(date);
    if (vaticanReadings) {
      return vaticanReadings;
    }

    // Fallback: Gerar leituras baseadas no calendário litúrgico
    return generateFallbackReadings(date);

  } catch (error) {
    console.error('Erro ao buscar leituras:', error);
    return generateFallbackReadings(date);
  }
}

// Função para buscar de API externa (exemplo)
async function fetchFromLiturgiaAPI(date: Date): Promise<DailyReadings | null> {
  try {
    // Exemplo de integração com API real
    // const response = await fetch(`https://api.liturgia.com/readings/${date.toISOString().split('T')[0]}`);
    // const data = await response.json();
    // return parseAPIResponse(data);
    
    console.log('📖 Tentando buscar de API externa...');
    return null; // Por enquanto, retorna null
  } catch (error) {
    console.error('Erro na API externa:', error);
    return null;
  }
}

// Função para buscar do Vatican News (exemplo)
async function fetchFromVaticanAPI(date: Date): Promise<DailyReadings | null> {
  try {
    // Exemplo de integração com Vatican News
    console.log('📖 Tentando buscar do Vatican News...');
    return null; // Por enquanto, retorna null
  } catch (error) {
    console.error('Erro na API do Vatican:', error);
    return null;
  }
}

// Função para gerar leituras de fallback
function generateFallbackReadings(date: Date): DailyReadings {
  const dateKey = date.toISOString().split('T')[0];
  
  return {
    date: dateKey,
    liturgicalDate: 'Dia de Semana do Tempo Comum',
    season: 'Tempo Comum',
    celebration: 'Dia de Semana',
    color: 'verde',
    readings: [
      {
        reference: 'Leitura não disponível',
        title: 'Primeira Leitura',
        text: 'As leituras para este dia não estão disponíveis no momento. Por favor, consulte seu missal ou acesse o site da CNBB.',
        type: 'first'
      },
      {
        reference: 'Salmo não disponível',
        title: 'Salmo Responsorial',
        text: 'R. Senhor, vós tendes palavras de vida eterna.',
        type: 'psalm'
      },
      {
        reference: 'Evangelho não disponível',
        title: 'Evangelho',
        text: 'As leituras para este dia não estão disponíveis no momento. Por favor, consulte seu missal ou acesse o site da CNBB.',
        type: 'gospel'
      }
    ]
  };
}

// Função para buscar leituras de uma semana
export async function getWeeklyReadings(startDate: Date): Promise<DailyReadings[]> {
  const readings: DailyReadings[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const dailyReading = await getDailyReadings(date);
    if (dailyReading) {
      readings.push(dailyReading);
    }
  }
  
  return readings;
}

// Função para buscar santo do dia
export function getSaintOfTheDay(date: Date): string | null {
  const dateKey = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  
  const saints: Record<string, string> = {
    '01-01': 'Santa Maria, Mãe de Deus',
    '01-06': 'Epifania do Senhor',
    '03-19': 'São José',
    '03-25': 'Anunciação do Senhor',
    '06-24': 'Nascimento de São João Batista',
    '06-29': 'Santos Pedro e Paulo',
    '08-15': 'Assunção de Nossa Senhora',
    '10-12': 'Nossa Senhora Aparecida',
    '11-01': 'Todos os Santos',
    '11-02': 'Finados',
    '12-08': 'Imaculada Conceição',
    '12-25': 'Natal do Senhor'
  };
  
  return saints[dateKey] || null;
}

// Função para formatar leituras para exibição
export function formatReadingForDisplay(reading: LiturgicalReading): string {
  return `${reading.reference}\n\n${reading.text}`;
}

// Função para obter cor litúrgica em português
export function getLiturgicalColorName(color: string): string {
  const colors: Record<string, string> = {
    'green': 'Verde',
    'purple': 'Roxo',
    'white': 'Branco',
    'red': 'Vermelho',
    'rose': 'Rosa'
  };
  
  return colors[color] || 'Verde';
}
