// Sistema Real de Scraping da CNBB
// Busca leituras diretamente do site oficial da CNBB

import { DailyReadings, LiturgicalReading } from './liturgical-readings';

// URLs da CNBB para diferentes formatos
const CNBB_URLS = {
  liturgiadiaria: (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `https://liturgiadiaria.cnbb.org.br/${year}/${month}/${day}`;
  },
  
  cnbbMain: (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return `https://www.cnbb.org.br/liturgia-diaria/?data=${dateStr}`;
  }
};

// Headers para evitar bloqueios
const SCRAPING_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1'
};

// Função principal para buscar leituras da CNBB
export async function fetchCNBBReadings(date: Date): Promise<DailyReadings | null> {
  console.log(`🔍 Buscando leituras da CNBB para ${date.toISOString().split('T')[0]}`);
  
  // Tentar múltiplas URLs da CNBB
  const urls = [
    CNBB_URLS.liturgiadiaria(date),
    CNBB_URLS.cnbbMain(date)
  ];
  
  for (const url of urls) {
    try {
      console.log(`📡 Tentando URL: ${url}`);
      const readings = await scrapeCNBBFromURL(url, date);
      if (readings && readings.readings.length > 0) {
        console.log(`✅ Leituras encontradas via ${url}`);
        return readings;
      }
    } catch (error) {
      console.error(`❌ Erro na URL ${url}:`, error);
      continue;
    }
  }
  
  console.log('❌ Nenhuma leitura encontrada nas URLs da CNBB');
  return null;
}

// Função para fazer scraping de uma URL específica
async function scrapeCNBBFromURL(url: string, date: Date): Promise<DailyReadings | null> {
  try {
    const response = await fetch(url, {
      headers: SCRAPING_HEADERS,
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Verificar se o HTML contém conteúdo litúrgico
    if (!html.includes('leitura') && !html.includes('evangelho') && !html.includes('salmo')) {
      console.log('❌ HTML não contém conteúdo litúrgico');
      return null;
    }
    
    return parseCNBBHTML(html, date);
    
  } catch (error) {
    console.error('Erro no scraping:', error);
    throw error;
  }
}

// Parser melhorado para HTML da CNBB
function parseCNBBHTML(html: string, date: Date): DailyReadings | null {
  try {
    console.log('🔍 Fazendo parse do HTML da CNBB...');
    
    const readings: LiturgicalReading[] = [];
    
    // Extrair título litúrgico com múltiplos padrões
    const titlePatterns = [
      /<h1[^>]*class="[^"]*titulo[^"]*"[^>]*>([\s\S]*?)<\/h1>/i,
      /<h1[^>]*>([\s\S]*?)<\/h1>/i,
      /<title[^>]*>([\s\S]*?)<\/title>/i,
      /data-liturgica[^>]*>([\s\S]*?)</i
    ];
    
    let liturgicalTitle = 'Dia de Semana';
    for (const pattern of titlePatterns) {
      const match = html.match(pattern);
      if (match) {
        liturgicalTitle = cleanHTML(match[1]).replace(/\s*-\s*CNBB.*$/i, '').trim();
        if (liturgicalTitle.length > 5) break;
      }
    }
    
    // Padrões para buscar leituras
    const readingPatterns = {
      first: [
        /primeira\s+leitura[^>]*>([\s\S]*?)(?=segunda\s+leitura|salmo|evangelho|<\/div>|<div[^>]*class)/i,
        /1[aª]?\s*leitura[^>]*>([\s\S]*?)(?=2[aª]?\s*leitura|salmo|evangelho|<\/div>)/i,
        /<div[^>]*class="[^"]*primeira[^"]*leitura[^"]*"[^>]*>([\s\S]*?)<\/div>/i
      ],
      psalm: [
        /salmo\s+responsorial[^>]*>([\s\S]*?)(?=segunda\s+leitura|evangelho|<\/div>|<div[^>]*class)/i,
        /salmo[^>]*>([\s\S]*?)(?=segunda\s+leitura|evangelho|<\/div>)/i,
        /<div[^>]*class="[^"]*salmo[^"]*"[^>]*>([\s\S]*?)<\/div>/i
      ],
      second: [
        /segunda\s+leitura[^>]*>([\s\S]*?)(?=evangelho|<\/div>|<div[^>]*class)/i,
        /2[aª]?\s*leitura[^>]*>([\s\S]*?)(?=evangelho|<\/div>)/i,
        /<div[^>]*class="[^"]*segunda[^"]*leitura[^"]*"[^>]*>([\s\S]*?)<\/div>/i
      ],
      gospel: [
        /evangelho[^>]*>([\s\S]*?)(?=<\/div>|<div[^>]*class|$)/i,
        /<div[^>]*class="[^"]*evangelho[^"]*"[^>]*>([\s\S]*?)<\/div>/i
      ]
    };
    
    // Extrair cada tipo de leitura
    for (const [type, patterns] of Object.entries(readingPatterns)) {
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) {
          const content = cleanHTML(match[1]);
          
          // Extrair referência bíblica
          const refMatch = content.match(/^([^:.\n]+(?:\d+[,.\d\-\s]*)+)[:.]?\s*/);
          const reference = refMatch ? refMatch[1].trim() : getDefaultReference(type);
          
          // Extrair texto (remover referência do início)
          let text = content.replace(/^[^:.]+[:.]?\s*/, '').trim();
          
          // Validar se o texto tem conteúdo suficiente
          if (text.length > 20) {
            readings.push({
              reference,
              title: getReadingTitle(type),
              text,
              type: type as any
            });
            
            console.log(`✅ ${getReadingTitle(type)} encontrada: ${reference}`);
            break; // Parar no primeiro padrão que funcionar
          }
        }
      }
    }
    
    if (readings.length === 0) {
      console.log('❌ Nenhuma leitura extraída do HTML');
      return null;
    }
    
    // Extrair informações adicionais
    const season = extractSeason(liturgicalTitle, html);
    const color = extractLiturgicalColor(html, season);
    const saint = extractSaint(html);
    
    console.log(`✅ Parse concluído: ${readings.length} leituras encontradas`);
    
    return {
      date: date.toISOString().split('T')[0],
      liturgicalDate: liturgicalTitle,
      season: season,
      celebration: liturgicalTitle,
      color: color,
      readings,
      saint: saint
    };
    
  } catch (error) {
    console.error('Erro no parse do HTML:', error);
    return null;
  }
}

// Função melhorada para limpar HTML
function cleanHTML(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[\s\S]*?<\/style>/gi, '') // Remove styles
    .replace(/<[^>]*>/g, ' ') // Remove tags HTML
    .replace(/&nbsp;/g, ' ') // Remove &nbsp;
    .replace(/&amp;/g, '&') // Decodifica &amp;
    .replace(/&lt;/g, '<') // Decodifica &lt;
    .replace(/&gt;/g, '>') // Decodifica &gt;
    .replace(/&quot;/g, '"') // Decodifica &quot;
    .replace(/&#39;/g, "'") // Decodifica &#39;
    .replace(/&apos;/g, "'") // Decodifica &apos;
    .replace(/\s+/g, ' ') // Remove espaços extras
    .replace(/\n\s*\n/g, '\n') // Remove linhas vazias extras
    .trim();
}

// Funções auxiliares
function getReadingTitle(type: string): string {
  const titles: Record<string, string> = {
    'first': 'Primeira Leitura',
    'psalm': 'Salmo Responsorial',
    'second': 'Segunda Leitura',
    'gospel': 'Evangelho'
  };
  return titles[type] || 'Leitura';
}

function getDefaultReference(type: string): string {
  const defaults: Record<string, string> = {
    'first': 'Primeira Leitura',
    'psalm': 'Salmo Responsorial',
    'second': 'Segunda Leitura',
    'gospel': 'Evangelho'
  };
  return defaults[type] || 'Leitura';
}

function extractSeason(title: string, html: string): string {
  const titleLower = title.toLowerCase();
  const htmlLower = html.toLowerCase();
  
  if (titleLower.includes('natal') || htmlLower.includes('tempo do natal')) {
    return 'Tempo do Natal';
  }
  if (titleLower.includes('páscoa') || titleLower.includes('pascal') || htmlLower.includes('tempo pascal')) {
    return 'Tempo Pascal';
  }
  if (titleLower.includes('quaresma') || htmlLower.includes('quaresma')) {
    return 'Quaresma';
  }
  if (titleLower.includes('advento') || htmlLower.includes('advento')) {
    return 'Advento';
  }
  
  return 'Tempo Comum';
}

function extractLiturgicalColor(html: string, season: string): string {
  const htmlLower = html.toLowerCase();
  
  // Buscar cor explícita no HTML
  if (htmlLower.includes('cor litúrgica') || htmlLower.includes('cor:')) {
    if (htmlLower.includes('branco') || htmlLower.includes('white')) return 'branco';
    if (htmlLower.includes('vermelho') || htmlLower.includes('red')) return 'vermelho';
    if (htmlLower.includes('roxo') || htmlLower.includes('violeta') || htmlLower.includes('purple')) return 'roxo';
    if (htmlLower.includes('verde') || htmlLower.includes('green')) return 'verde';
    if (htmlLower.includes('rosa') || htmlLower.includes('rose')) return 'rosa';
  }
  
  // Cor baseada no tempo litúrgico
  switch (season) {
    case 'Tempo do Natal':
    case 'Tempo Pascal':
      return 'branco';
    case 'Quaresma':
    case 'Advento':
      return 'roxo';
    default:
      return 'verde';
  }
}

function extractSaint(html: string): string | undefined {
  const patterns = [
    /santo[^>]*:\s*([^<\n]+)/i,
    /santa[^>]*:\s*([^<\n]+)/i,
    /são\s+([^<\n]+)/i,
    /santa?\s+([^<\n,]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const saint = cleanHTML(match[1]).trim();
      if (saint.length > 3 && saint.length < 100) {
        return saint;
      }
    }
  }
  
  return undefined;
}

// Função para validar se as leituras estão corretas
export function validateReadings(readings: DailyReadings, date: Date): boolean {
  // Verificações básicas
  if (!readings || readings.readings.length === 0) {
    return false;
  }
  
  // Deve ter pelo menos primeira leitura e evangelho
  const hasFirst = readings.readings.some(r => r.type === 'first');
  const hasGospel = readings.readings.some(r => r.type === 'gospel');
  
  if (!hasFirst || !hasGospel) {
    console.log('❌ Leituras incompletas: falta primeira leitura ou evangelho');
    return false;
  }
  
  // Verificar se os textos têm tamanho razoável
  const hasValidTexts = readings.readings.every(r => r.text.length > 50);
  
  if (!hasValidTexts) {
    console.log('❌ Textos das leituras muito curtos');
    return false;
  }
  
  console.log('✅ Leituras validadas com sucesso');
  return true;
}
