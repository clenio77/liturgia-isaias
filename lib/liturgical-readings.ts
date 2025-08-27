// Sistema de Leituras Litúrgicas
// Integra múltiplas fontes de leituras católicas

import { scrapeReadings, getCachedReadings, setCachedReadings } from './readings-scraper';

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

  // 1. Verificar cache em memória primeiro
  const cachedReadings = getCachedReadings(date);
  if (cachedReadings) {
    return cachedReadings;
  }

  // 2. Verificar base de dados local (exemplos)
  if (readingsDatabase[dateKey]) {
    console.log(`📖 Leituras encontradas na base local para ${dateKey}`);
    setCachedReadings(date, readingsDatabase[dateKey]);
    return readingsDatabase[dateKey];
  }

  // 3. Tentar buscar de APIs externas
  try {
    console.log(`🔍 Buscando leituras online para ${dateKey}`);

    const apiReadings = await fetchFromLiturgiaAPI(date);
    if (apiReadings) {
      setCachedReadings(date, apiReadings);
      return apiReadings;
    }

    const vaticanReadings = await fetchFromVaticanAPI(date);
    if (vaticanReadings) {
      setCachedReadings(date, vaticanReadings);
      return vaticanReadings;
    }

  } catch (error) {
    console.error('Erro nas APIs:', error);
  }

  // 4. Tentar web scraping como último recurso
  try {
    console.log(`🕷️ Tentando web scraping para ${dateKey}`);
    const scrapedReadings = await scrapeReadings(date);
    if (scrapedReadings) {
      setCachedReadings(date, scrapedReadings);
      return scrapedReadings;
    }
  } catch (error) {
    console.error('Erro no web scraping:', error);
  }

  // 5. Fallback: Gerar leituras baseadas no calendário litúrgico
  console.log(`📝 Gerando fallback para ${dateKey}`);
  const fallbackReadings = generateFallbackReadings(date);
  setCachedReadings(date, fallbackReadings);
  return fallbackReadings;
}

// Função para buscar de API externa (CNBB)
async function fetchFromLiturgiaAPI(date: Date): Promise<DailyReadings | null> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    console.log('📖 Buscando leituras da CNBB para:', dateStr);

    // API da CNBB (não oficial, mas funcional)
    const response = await fetch(`https://liturgia.cnbb.org.br/api/liturgia/${dateStr}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LiturgiaIsaias/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return parseCNBBResponse(data, date);

  } catch (error) {
    console.error('Erro na API da CNBB:', error);

    // Tentar API alternativa (Aleteia)
    try {
      return await fetchFromAleteia(date);
    } catch (aleiteiaError) {
      console.error('Erro na API Aleteia:', aleiteiaError);
      return null;
    }
  }
}

// Função para buscar da Aleteia (API alternativa)
async function fetchFromAleteia(date: Date): Promise<DailyReadings | null> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    console.log('📖 Tentando API Aleteia para:', dateStr);

    const response = await fetch(`https://pt.aleteia.org/api/liturgy/${dateStr}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return parseAleiteiaResponse(data, date);

  } catch (error) {
    console.error('Erro na API Aleteia:', error);
    return null;
  }
}

// Parser para resposta da CNBB
function parseCNBBResponse(data: any, date: Date): DailyReadings {
  const readings: LiturgicalReading[] = [];

  // Primeira leitura
  if (data.primeira_leitura) {
    readings.push({
      reference: data.primeira_leitura.referencia || 'Primeira Leitura',
      title: 'Primeira Leitura',
      text: data.primeira_leitura.texto || 'Texto não disponível',
      type: 'first'
    });
  }

  // Salmo
  if (data.salmo) {
    readings.push({
      reference: data.salmo.referencia || 'Salmo Responsorial',
      title: 'Salmo Responsorial',
      text: data.salmo.texto || 'Texto não disponível',
      type: 'psalm'
    });
  }

  // Segunda leitura (se houver)
  if (data.segunda_leitura) {
    readings.push({
      reference: data.segunda_leitura.referencia || 'Segunda Leitura',
      title: 'Segunda Leitura',
      text: data.segunda_leitura.texto || 'Texto não disponível',
      type: 'second'
    });
  }

  // Evangelho
  if (data.evangelho) {
    readings.push({
      reference: data.evangelho.referencia || 'Evangelho',
      title: 'Evangelho',
      text: data.evangelho.texto || 'Texto não disponível',
      type: 'gospel'
    });
  }

  return {
    date: date.toISOString().split('T')[0],
    liturgicalDate: data.data_liturgica || 'Dia de Semana',
    season: data.tempo_liturgico || 'Tempo Comum',
    celebration: data.celebracao || 'Dia de Semana',
    color: data.cor_liturgica || 'verde',
    readings,
    saint: data.santo_do_dia
  };
}

// Parser para resposta da Aleteia
function parseAleiteiaResponse(data: any, date: Date): DailyReadings {
  const readings: LiturgicalReading[] = [];

  if (data.readings) {
    data.readings.forEach((reading: any) => {
      readings.push({
        reference: reading.reference || '',
        title: reading.title || '',
        text: reading.text || 'Texto não disponível',
        type: reading.type || 'first'
      });
    });
  }

  return {
    date: date.toISOString().split('T')[0],
    liturgicalDate: data.liturgicalDate || 'Dia de Semana',
    season: data.season || 'Tempo Comum',
    celebration: data.celebration || 'Dia de Semana',
    color: data.color || 'verde',
    readings,
    saint: data.saint
  };
}

// Função para buscar do Vatican News (RSS)
async function fetchFromVaticanAPI(date: Date): Promise<DailyReadings | null> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    console.log('📖 Tentando buscar do Vatican News...');

    // Vatican News não tem API pública, mas podemos tentar scraping
    const response = await fetch(`https://www.vatican.va/news_services/liturgy/libretti/fp_lit_${dateStr.replace(/-/g, '')}.html`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return parseVaticanHTML(html, date);

  } catch (error) {
    console.error('Erro na API do Vatican:', error);
    return null;
  }
}

// Parser para HTML do Vatican (básico)
function parseVaticanHTML(html: string, date: Date): DailyReadings | null {
  // Implementação básica de parsing HTML
  // Em produção, usaria uma biblioteca como Cheerio
  try {
    // Por enquanto, retorna null - implementação complexa
    return null;
  } catch (error) {
    console.error('Erro ao fazer parse do HTML do Vatican:', error);
    return null;
  }
}

// Função para gerar leituras de fallback
function generateFallbackReadings(date: Date): DailyReadings {
  const dateKey = date.toISOString().split('T')[0];
  const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, etc.

  // Leituras genéricas baseadas no dia da semana
  const weeklyReadings = {
    0: { // Domingo
      first: 'Is 55,10-11\n\nAssim como a chuva e a neve descem do céu e para lá não voltam sem ter regado a terra, sem tê-la fecundado e feito germinar, para dar semente ao semeador e pão ao que come, assim acontece com a palavra que sai da minha boca: ela não volta para mim vazia, mas realiza aquilo para que a enviei.',
      psalm: 'Sl 64(65),10.11.12-13.14 (R. Lc 8,8)\n\nR. A semente caiu em terra boa e deu fruto.\n\nVós cuidais da terra e a regais, e a cumulais de riquezas; os rios de Deus transbordam de água, e assim preparais o trigo dos homens.',
      gospel: 'Mt 13,1-23\n\nNaquele dia, Jesus saiu de casa e foi sentar-se à beira do mar. Uma grande multidão reuniu-se em volta dele. Por isso, Jesus subiu numa barca e sentou-se, enquanto a multidão ficava de pé, na praia. E disse-lhes muitas coisas em parábolas...'
    },
    1: { // Segunda
      first: '1Cor 2,1-5\n\nEu, irmãos, quando fui ter convosco para vos anunciar o mistério de Deus, não fui com sublimidade de palavra ou de sabedoria. Pois não quis saber de coisa alguma no meio de vós, a não ser de Jesus Cristo, e Jesus Cristo crucificado.',
      psalm: 'Sl 118(119),97.98.99.100.101.102 (R. 97a)\n\nR. Como amo a vossa lei, Senhor!\n\nComo amo a vossa lei, ó Senhor! Medito nela o dia inteiro.',
      gospel: 'Lc 4,16-30\n\nJesus veio a Nazaré, onde tinha sido criado. Conforme seu costume, entrou na sinagoga no dia de sábado e levantou-se para fazer a leitura...'
    },
    2: { // Terça
      first: '1Cor 2,10b-16\n\nO Espírito penetra tudo, até mesmo as profundezas de Deus. Com efeito, quem conhece o íntimo do homem, senão o espírito do homem que nele está? Assim também, ninguém conhece o íntimo de Deus, senão o Espírito de Deus.',
      psalm: 'Sl 144(145),8-9.10-11.12-13ab.13cd-14 (R. 1a)\n\nR. Eu vos louvarei, meu Deus e meu Rei!\n\nO Senhor é clemente e misericordioso, é paciente e cheio de amor.',
      gospel: 'Lc 4,31-37\n\nJesus desceu a Cafarnaum, cidade da Galileia, e aos sábados ensinava o povo. Ficavam admirados com o seu ensinamento, pois falava com autoridade...'
    },
    3: { // Quarta
      first: '1Cor 3,1-9\n\nEu, irmãos, não pude falar-vos como a pessoas espirituais, mas como a pessoas carnais, como a crianças em Cristo. Dei-vos leite a beber, não alimento sólido, pois não podíeis suportá-lo.',
      psalm: 'Sl 32(33),12-13.14-15.20-21 (R. 12b)\n\nR. Feliz o povo que o Senhor escolheu para sua herança!\n\nFeliz a nação cujo Deus é o Senhor, e o povo que ele escolheu para sua herança!',
      gospel: 'Lc 4,38-44\n\nJesus saiu da sinagoga e entrou na casa de Simão. A sogra de Simão estava com febre alta, e pediram a Jesus em favor dela...'
    },
    4: { // Quinta
      first: '1Cor 3,18-23\n\nNinguém se iluda. Se alguém dentre vós se julga sábio segundo este mundo, torne-se louco para ser sábio. Pois a sabedoria deste mundo é loucura diante de Deus.',
      psalm: 'Sl 23(24),1-2.3-4ab.5-6 (R. 1)\n\nR. Do Senhor é a terra e o que ela encerra!\n\nDo Senhor é a terra e o que ela encerra, o mundo inteiro com os que nele habitam.',
      gospel: 'Lc 5,1-11\n\nUm dia, Jesus estava na margem do lago de Genesaré e a multidão se apertava ao seu redor para ouvir a palavra de Deus...'
    },
    5: { // Sexta
      first: '1Cor 4,1-5\n\nQue todos nos considerem como servidores de Cristo e administradores dos mistérios de Deus. Ora, o que se exige dos administradores é que sejam fiéis.',
      psalm: 'Sl 36(37),3-4.5-6.27-28.39-40 (R. 5a)\n\nR. Entrega teu caminho ao Senhor!\n\nConfia no Senhor e pratica o bem, habita a terra e vive em segurança.',
      gospel: 'Lc 5,33-39\n\nOs fariseus disseram a Jesus: "Os discípulos de João jejuam frequentemente e fazem orações; os discípulos dos fariseus fazem a mesma coisa. Os teus, porém, comem e bebem"...'
    },
    6: { // Sábado
      first: '1Cor 4,6b-15\n\nIrmãos, aprendi isto para mim e para Apolo, a fim de que aprendais em nós a não ir além do que está escrito, para que ninguém se ensoberbeça em favor de um contra outro.',
      psalm: 'Sl 144(145),17-18.19-20.21 (R. 18a)\n\nR. Perto está o Senhor de quem o invoca!\n\nO Senhor é justo em todos os seus caminhos e santo em todas as suas obras.',
      gospel: 'Lc 6,1-5\n\nNum dia de sábado, Jesus estava atravessando as plantações de trigo. Seus discípulos arrancavam espigas, esfregavam-nas nas mãos e comiam os grãos...'
    }
  };

  const dayReadings = weeklyReadings[dayOfWeek as keyof typeof weeklyReadings];

  return {
    date: dateKey,
    liturgicalDate: `${getDayName(dayOfWeek)} da Semana`,
    season: 'Tempo Comum',
    celebration: 'Dia de Semana',
    color: 'verde',
    readings: [
      {
        reference: dayReadings.first.split('\n\n')[0],
        title: 'Primeira Leitura',
        text: dayReadings.first.split('\n\n')[1] || 'Texto não disponível',
        type: 'first'
      },
      {
        reference: dayReadings.psalm.split('\n\n')[0],
        title: 'Salmo Responsorial',
        text: dayReadings.psalm.split('\n\n').slice(1).join('\n\n') || 'R. Senhor, vós tendes palavras de vida eterna.',
        type: 'psalm'
      },
      {
        reference: dayReadings.gospel.split('\n\n')[0],
        title: 'Evangelho',
        text: dayReadings.gospel.split('\n\n')[1] || 'Texto não disponível',
        type: 'gospel'
      }
    ],
    saint: getSaintOfTheDay(date) || undefined
  };
}

function getDayName(dayOfWeek: number): string {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return days[dayOfWeek];
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
