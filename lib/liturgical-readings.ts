// Sistema de Leituras Litúrgicas
// Integra múltiplas fontes de leituras católicas

import { scrapeReadings, getCachedReadings, setCachedReadings } from './readings-scraper';
import { fetchCNBBReadings, validateReadings } from './cnbb-scraper';
import { fetchCNBBReadingsComplete } from './cnbb-api';
import { getCompleteReadingsFromDatabase, hasCompleteReadings } from './complete-readings-database';

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
    liturgicalDate: 'Natal do Senhor - Missa do Dia',
    season: 'Tempo do Natal',
    celebration: 'Solenidade do Natal',
    color: 'branco',
    readings: [
      {
        reference: 'Is 52,7-10',
        title: 'Primeira Leitura',
        text: 'Como são belos, sobre os montes, os pés do mensageiro que anuncia a paz, que traz boas notícias, que anuncia a salvação, que diz a Sião: "O teu Deus reina!" Escuta! Os teus vigias levantam a voz e juntos exultam de alegria, porque veem com os próprios olhos o Senhor que volta a Sião. Rompei em gritos de alegria, ruínas de Jerusalém! Porque o Senhor consolou o seu povo, resgatou Jerusalém. O Senhor mostrou o seu braço santo aos olhos de todas as nações, e todos os confins da terra verão a salvação do nosso Deus.',
        type: 'first'
      },
      {
        reference: 'Sl 97(98),1.2-3ab.3cd-4.5-6 (R. 3cd)',
        title: 'Salmo Responsorial',
        text: 'R. Os confins do universo contemplaram a salvação do nosso Deus.\n\nCantai ao Senhor Deus um canto novo, porque ele fez prodígios! Sua direita e seu braço santo alcançaram-lhe a vitória.\n\nO Senhor fez conhecer a salvação, revelou sua justiça às nações. Recordou-se de seu amor e fidelidade em favor da casa de Israel.\n\nOs confins do universo contemplaram a salvação do nosso Deus. Aclamai o Senhor Deus, ó terra inteira, alegrai-vos, exultai de alegria!\n\nCantai salmos ao Senhor ao som da harpa, da harpa e da lira sonora! Ao som da trombeta e da trompa, aclamai o Senhor, o nosso Rei!',
        type: 'psalm'
      },
      {
        reference: 'Hb 1,1-6',
        title: 'Segunda Leitura',
        text: 'Muitas vezes e de modos diversos falou Deus, outrora, aos pais pelos profetas; agora, nestes dias que são os últimos, falou-nos por meio do Filho, a quem constituiu herdeiro de todas as coisas, e por meio de quem fez o universo. Ele, que é o resplendor da glória e a imagem do ser de Deus, e sustenta o universo com o poder da sua palavra, depois de ter realizado a purificação dos pecados, sentou-se à direita da Majestade nas alturas, tornando-se tanto superior aos anjos quanto o nome que recebeu por herança supera o deles. Com efeito, a qual dos anjos disse jamais: "Tu és meu Filho, eu hoje te gerei"? E ainda: "Eu serei para ele um pai, e ele será para mim um filho"? E quando introduz o Primogênito no mundo, diz: "Adorem-no todos os anjos de Deus".',
        type: 'second'
      },
      {
        reference: 'Jo 1,1-18',
        title: 'Evangelho',
        text: 'No princípio era o Verbo, e o Verbo estava junto de Deus, e o Verbo era Deus. Ele estava no princípio junto de Deus. Tudo foi feito por meio dele, e sem ele nada foi feito. Nele havia vida, e a vida era a luz dos homens. A luz brilha nas trevas, e as trevas não a venceram. Houve um homem enviado por Deus; seu nome era João. Ele veio como testemunha, para dar testemunho da luz, a fim de que todos cressem por meio dele. Ele não era a luz, mas veio para dar testemunho da luz. O Verbo era a luz verdadeira que, vindo ao mundo, ilumina todo homem. Estava no mundo, e o mundo foi feito por meio dele, mas o mundo não o reconheceu. Veio para o que era seu, mas os seus não o receberam. Mas, a todos que o receberam, aos que creem no seu nome, deu-lhes o poder de se tornarem filhos de Deus. Estes não nasceram do sangue, nem da vontade da carne, nem da vontade do homem, mas de Deus. E o Verbo se fez carne e habitou entre nós. E nós vimos a sua glória, glória que ele tem junto do Pai como Filho único, cheio de graça e de verdade. João dá testemunho dele, clamando: "Este é aquele de quem eu disse: o que vem depois de mim passou à minha frente, porque existia antes de mim". Todos nós recebemos da sua plenitude graça sobre graça. Porque a Lei foi dada por meio de Moisés; a graça e a verdade vieram por Jesus Cristo. Ninguém jamais viu a Deus: o Filho único, que está voltado para o seio do Pai, este o deu a conhecer.',
        type: 'gospel'
      }
    ]
  },

  // Páscoa - 31/03/2024
  '2024-03-31': {
    date: '2024-03-31',
    liturgicalDate: 'Domingo de Páscoa - Ressurreição do Senhor',
    season: 'Tempo Pascal',
    celebration: 'Ressurreição do Senhor',
    color: 'branco',
    readings: [
      {
        reference: 'At 10,34a.37-43',
        title: 'Primeira Leitura',
        text: 'Naqueles dias, Pedro tomou a palavra e disse: "Vós conheceis a palavra que Deus enviou aos filhos de Israel, anunciando a paz por Jesus Cristo, que é o Senhor de todos. Essa palavra se espalhou por toda a Judeia, começando pela Galileia, depois do batismo pregado por João: como Deus ungiu Jesus de Nazaré com o Espírito Santo e com poder. Ele andou por toda parte, fazendo o bem e curando todos os oprimidos pelo demônio, porque Deus estava com ele. E nós somos testemunhas de tudo o que ele fez na terra dos judeus e em Jerusalém. Eles o mataram, suspendendo-o num madeiro. Mas Deus o ressuscitou no terceiro dia, e lhe concedeu manifestar-se não a todo o povo, mas às testemunhas que foram escolhidas de antemão por Deus: a nós, que comemos e bebemos com ele, depois que ressuscitou dos mortos. E ele nos mandou pregar ao povo, e testemunhar que ele é aquele que Deus constituiu juiz dos vivos e dos mortos. Dele todos os profetas dão testemunho: todo aquele que nele crê recebe, pelo seu nome, o perdão dos pecados".',
        type: 'first'
      },
      {
        reference: 'Sl 117(118),1-2.16ab-17.22-23 (R. 24)',
        title: 'Salmo Responsorial',
        text: 'R. Este é o dia que o Senhor fez para nós: alegremo-nos e exultemos!\n\nDai graças ao Senhor, porque ele é bom, porque é eterna a sua misericórdia! Diga a casa de Israel: "É eterna a sua misericórdia!"\n\nA direita do Senhor fez prodígios, a direita do Senhor me exaltou! Não morrerei, mas viverei para narrar as obras do Senhor!\n\nA pedra rejeitada pelos construtores tornou-se pedra angular. Isso foi feito pelo Senhor: é admirável aos nossos olhos!',
        type: 'psalm'
      },
      {
        reference: 'Cl 3,1-4',
        title: 'Segunda Leitura',
        text: 'Irmãos, se ressuscitastes com Cristo, procurai as coisas do alto, onde Cristo está sentado à direita de Deus. Pensai nas coisas do alto, não nas da terra. Pois morrestes, e a vossa vida está escondida com Cristo em Deus. Quando Cristo, que é a vossa vida, se manifestar, então também vós sereis manifestados com ele na glória.',
        type: 'second'
      },
      {
        reference: 'Jo 20,1-9',
        title: 'Evangelho',
        text: 'No primeiro dia da semana, Maria Madalena foi ao túmulo de madrugada, quando ainda estava escuro, e viu que a pedra tinha sido retirada do túmulo. Então correu ao encontro de Simão Pedro e do outro discípulo, aquele que Jesus amava, e lhes disse: "Tiraram o Senhor do túmulo, e não sabemos onde o colocaram!" Pedro saiu com o outro discípulo e foram ao túmulo. Os dois corriam juntos, mas o outro discípulo correu mais depressa que Pedro e chegou primeiro ao túmulo. Inclinando-se, viu as faixas de linho no chão, mas não entrou. Chegou também Simão Pedro, que vinha correndo atrás, e entrou no túmulo. Viu as faixas de linho deitadas no chão e o sudário, que tinha estado sobre a cabeça de Jesus, não posto com as faixas, mas dobrado num lugar à parte. Então entrou também o outro discípulo, que tinha chegado primeiro ao túmulo. Ele viu e creu. De fato, eles ainda não tinham compreendido a Escritura, segundo a qual ele devia ressuscitar dos mortos.',
        type: 'gospel'
      }
    ]
  },

  // Nota: Leituras dinâmicas são buscadas em tempo real da CNBB
  // Não usar leituras fixas para "hoje" pois podem estar incorretas
};

// Função principal para obter leituras do dia
export async function getDailyReadings(date: Date = new Date()): Promise<DailyReadings | null> {
  const dateKey = date.toISOString().split('T')[0];

  // 🎯 PRIORIDADE ABSOLUTA: Base de leituras COMPLETAS (SEMPRE PRIMEIRO)
  const completeReadings = getCompleteReadingsFromDatabase(date);
  if (completeReadings) {
    console.log(`📚 ✅ LEITURAS COMPLETAS ENCONTRADAS - USANDO BASE PRIORITÁRIA para ${dateKey}`);
    console.log(`📖 Primeira leitura preview:`, completeReadings.readings[0].text.substring(0, 100) + '...');
    setCachedReadings(date, completeReadings);
    return completeReadings;
  }

  // 2. Verificar cache em memória (APENAS se não há leituras completas)
  const cachedReadings = getCachedReadings(date);
  if (cachedReadings) {
    console.log(`📦 Usando cache (sem leituras completas disponíveis)`);
    return cachedReadings;
  }

  // 3. Verificar base de dados local (exemplos - backup)
  if (readingsDatabase[dateKey]) {
    console.log(`📖 Leituras encontradas na base local para ${dateKey}`);
    setCachedReadings(date, readingsDatabase[dateKey]);
    return readingsDatabase[dateKey];
  }

  // 3. NOVA API CNBB COMPLETA (PRIORIDADE MÁXIMA)
  try {
    console.log(`🎯 Tentando nova API CNBB COMPLETA para ${dateKey}`);

    const cnbbCompleteReadings = await fetchCNBBReadingsComplete(date);
    if (cnbbCompleteReadings && cnbbCompleteReadings.readings.length >= 2) {
      console.log('✅ Leituras COMPLETAS obtidas da nova API CNBB');
      setCachedReadings(date, cnbbCompleteReadings);
      return cnbbCompleteReadings;
    }
  } catch (error) {
    console.error('Erro na nova API CNBB completa:', error);
  }

  // 4. Tentar buscar diretamente da CNBB (método antigo como backup)
  try {
    console.log(`🔍 Buscando leituras da CNBB (método antigo) para ${dateKey}`);

    const cnbbReadings = await fetchCNBBReadings(date);
    if (cnbbReadings && validateReadings(cnbbReadings, date)) {
      setCachedReadings(date, cnbbReadings);
      return cnbbReadings;
    }

  } catch (error) {
    console.error('Erro no scraping da CNBB (método antigo):', error);
  }

  // 4. Tentar APIs alternativas como backup
  try {
    console.log(`🔍 Tentando APIs alternativas para ${dateKey}`);

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
    console.error('Erro nas APIs alternativas:', error);
  }

  // 5. Tentar web scraping genérico como último recurso
  try {
    console.log(`🕷️ Tentando web scraping genérico para ${dateKey}`);
    const scrapedReadings = await scrapeReadings(date);
    if (scrapedReadings) {
      setCachedReadings(date, scrapedReadings);
      return scrapedReadings;
    }
  } catch (error) {
    console.error('Erro no web scraping genérico:', error);
  }

  // 6. Fallback: Gerar leituras baseadas no calendário litúrgico
  console.log(`📝 Gerando fallback para ${dateKey}`);
  const fallbackReadings = generateFallbackReadings(date);
  setCachedReadings(date, fallbackReadings);
  return fallbackReadings;
}

// Função para buscar de API externa (usando nossa própria API)
async function fetchFromLiturgiaAPI(date: Date): Promise<DailyReadings | null> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    console.log('📖 Buscando leituras via nossa API para:', dateStr);

    // Usar nossa própria API que faz scraping
    const response = await fetch(`/api/readings/${dateStr}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Erro na nossa API:', error);

    // Tentar scraping direto
    try {
      return await fetchFromCNBBDirect(date);
    } catch (directError) {
      console.error('Erro no scraping direto:', directError);
      return null;
    }
  }
}

// Função para buscar diretamente do site da CNBB
async function fetchFromCNBBDirect(date: Date): Promise<DailyReadings | null> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    console.log('📖 Fazendo scraping direto da CNBB para:', dateStr);

    // URL real da CNBB para liturgia diária
    const url = `https://liturgiadiaria.cnbb.org.br/${dateStr.replace(/-/g, '/')}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return parseCNBBHTML(html, date);

  } catch (error) {
    console.error('Erro no scraping direto da CNBB:', error);
    return null;
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

// Parser para HTML da CNBB
function parseCNBBHTML(html: string, date: Date): DailyReadings | null {
  try {
    const readings: LiturgicalReading[] = [];

    // Extrair título litúrgico
    const titleMatch = html.match(/<h1[^>]*class="[^"]*titulo[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
                      html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const liturgicalTitle = titleMatch ? cleanHTML(titleMatch[1]) : 'Dia de Semana';

    // Extrair cor litúrgica
    const colorMatch = html.match(/cor[^>]*:\s*([^<\n]+)/i);
    const liturgicalColor = colorMatch ? colorMatch[1].trim().toLowerCase() : 'verde';

    // Buscar primeira leitura
    const firstReadingMatch = html.match(/<div[^>]*class="[^"]*primeira[^"]*leitura[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                             html.match(/primeira\s+leitura[^>]*>([\s\S]*?)(?=<div|<h[1-6]|salmo|evangelho)/i);

    if (firstReadingMatch) {
      const content = cleanHTML(firstReadingMatch[1]);
      const refMatch = content.match(/^([^:]+):/);
      const text = content.replace(/^[^:]+:\s*/, '').trim();

      if (text && text.length > 10) {
        readings.push({
          reference: refMatch ? refMatch[1].trim() : 'Primeira Leitura',
          title: 'Primeira Leitura',
          text: text,
          type: 'first'
        });
      }
    }

    // Buscar salmo responsorial
    const psalmMatch = html.match(/<div[^>]*class="[^"]*salmo[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                      html.match(/salmo\s+responsorial[^>]*>([\s\S]*?)(?=<div|<h[1-6]|segunda|evangelho)/i);

    if (psalmMatch) {
      const content = cleanHTML(psalmMatch[1]);
      const refMatch = content.match(/^([^:]+):/);
      const text = content.replace(/^[^:]+:\s*/, '').trim();

      if (text && text.length > 5) {
        readings.push({
          reference: refMatch ? refMatch[1].trim() : 'Salmo Responsorial',
          title: 'Salmo Responsorial',
          text: text,
          type: 'psalm'
        });
      }
    }

    // Buscar segunda leitura (opcional)
    const secondReadingMatch = html.match(/<div[^>]*class="[^"]*segunda[^"]*leitura[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                              html.match(/segunda\s+leitura[^>]*>([\s\S]*?)(?=<div|<h[1-6]|evangelho)/i);

    if (secondReadingMatch) {
      const content = cleanHTML(secondReadingMatch[1]);
      const refMatch = content.match(/^([^:]+):/);
      const text = content.replace(/^[^:]+:\s*/, '').trim();

      if (text && text.length > 10) {
        readings.push({
          reference: refMatch ? refMatch[1].trim() : 'Segunda Leitura',
          title: 'Segunda Leitura',
          text: text,
          type: 'second'
        });
      }
    }

    // Buscar evangelho
    const gospelMatch = html.match(/<div[^>]*class="[^"]*evangelho[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                       html.match(/evangelho[^>]*>([\s\S]*?)(?=<div|<h[1-6]|$)/i);

    if (gospelMatch) {
      const content = cleanHTML(gospelMatch[1]);
      const refMatch = content.match(/^([^:]+):/);
      const text = content.replace(/^[^:]+:\s*/, '').trim();

      if (text && text.length > 10) {
        readings.push({
          reference: refMatch ? refMatch[1].trim() : 'Evangelho',
          title: 'Evangelho',
          text: text,
          type: 'gospel'
        });
      }
    }

    if (readings.length === 0) {
      console.log('❌ Nenhuma leitura encontrada no HTML');
      return null;
    }

    console.log(`✅ Encontradas ${readings.length} leituras via scraping`);

    return {
      date: date.toISOString().split('T')[0],
      liturgicalDate: liturgicalTitle,
      season: extractSeason(liturgicalTitle),
      celebration: liturgicalTitle,
      color: mapLiturgicalColor(liturgicalColor),
      readings,
      saint: extractSaint(html)
    };

  } catch (error) {
    console.error('Erro ao fazer parse do HTML da CNBB:', error);
    return null;
  }
}

// Função para limpar HTML
function cleanHTML(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[\s\S]*?<\/style>/gi, '') // Remove styles
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/&nbsp;/g, ' ') // Remove &nbsp;
    .replace(/&amp;/g, '&') // Decodifica &amp;
    .replace(/&lt;/g, '<') // Decodifica &lt;
    .replace(/&gt;/g, '>') // Decodifica &gt;
    .replace(/&quot;/g, '"') // Decodifica &quot;
    .replace(/&#39;/g, "'") // Decodifica &#39;
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim();
}

// Função para extrair tempo litúrgico
function extractSeason(title: string): string {
  if (title.toLowerCase().includes('natal')) return 'Tempo do Natal';
  if (title.toLowerCase().includes('páscoa')) return 'Tempo Pascal';
  if (title.toLowerCase().includes('quaresma')) return 'Quaresma';
  if (title.toLowerCase().includes('advento')) return 'Advento';
  return 'Tempo Comum';
}

// Função para mapear cor litúrgica
function mapLiturgicalColor(color: string): string {
  const colorMap: Record<string, string> = {
    'verde': 'verde',
    'roxo': 'roxo',
    'violeta': 'roxo',
    'branco': 'branco',
    'vermelho': 'vermelho',
    'rosa': 'rosa'
  };

  return colorMap[color.toLowerCase()] || 'verde';
}

// Função para extrair santo do dia
function extractSaint(html: string): string | undefined {
  const saintMatch = html.match(/santo[^>]*:\s*([^<\n]+)/i) ||
                    html.match(/santa[^>]*:\s*([^<\n]+)/i) ||
                    html.match(/são[^>]*([^<\n]+)/i);

  return saintMatch ? cleanHTML(saintMatch[1]).trim() : undefined;
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
