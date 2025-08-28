// Sistema Real de API da CNBB para Leituras Completas
// Busca diretamente da API oficial da CNBB

import { DailyReadings, LiturgicalReading } from './liturgical-readings';

// URLs oficiais da CNBB
const CNBB_API_URLS = {
  // API oficial da CNBB (se disponível)
  official: (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `https://liturgiadiaria.cnbb.org.br/api/${year}/${month}/${day}`;
  },
  
  // Site principal da CNBB
  main: (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `https://liturgiadiaria.cnbb.org.br/${year}/${month}/${day}`;
  },
  
  // Site alternativo
  alternative: (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return `https://www.cnbb.org.br/liturgia-diaria/?data=${dateStr}`;
  }
};

// Headers para requisições
const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none'
};

// Função principal para buscar leituras da CNBB
export async function fetchCNBBReadingsComplete(date: Date): Promise<DailyReadings | null> {
  console.log(`🔍 Buscando leituras COMPLETAS da CNBB para ${date.toISOString().split('T')[0]}`);
  
  // Tentar múltiplas URLs em ordem de prioridade
  const urls = [
    CNBB_API_URLS.main(date),
    CNBB_API_URLS.alternative(date)
  ];
  
  for (const url of urls) {
    try {
      console.log(`📡 Tentando URL: ${url}`);
      const readings = await fetchFromURL(url, date);
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

// Função para buscar de uma URL específica
async function fetchFromURL(url: string, date: Date): Promise<DailyReadings | null> {
  try {
    const response = await fetch(url, {
      headers: REQUEST_HEADERS,
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Verificar se o HTML contém conteúdo litúrgico
    if (!containsLiturgicalContent(html)) {
      console.log('❌ HTML não contém conteúdo litúrgico válido');
      return null;
    }
    
    return parseAdvancedHTML(html, date);
    
  } catch (error) {
    console.error('Erro no fetch:', error);
    throw error;
  }
}

// Verificar se HTML contém conteúdo litúrgico
function containsLiturgicalContent(html: string): boolean {
  const liturgicalKeywords = [
    'leitura', 'evangelho', 'salmo', 'responsorial',
    'primeira', 'segunda', 'gospel', 'reading',
    'liturgia', 'missa', 'celebração'
  ];
  
  const htmlLower = html.toLowerCase();
  return liturgicalKeywords.some(keyword => htmlLower.includes(keyword));
}

// Parser avançado para HTML da CNBB
function parseAdvancedHTML(html: string, date: Date): DailyReadings | null {
  try {
    console.log('🔍 Fazendo parse avançado do HTML da CNBB...');
    
    const readings: LiturgicalReading[] = [];
    
    // Extrair título litúrgico
    const liturgicalTitle = extractLiturgicalTitle(html);
    
    // Extrair cada tipo de leitura com múltiplas estratégias
    const readingTypes = [
      { key: 'first', title: 'Primeira Leitura', patterns: getFirstReadingPatterns() },
      { key: 'psalm', title: 'Salmo Responsorial', patterns: getPsalmPatterns() },
      { key: 'second', title: 'Segunda Leitura', patterns: getSecondReadingPatterns() },
      { key: 'gospel', title: 'Evangelho', patterns: getGospelPatterns() }
    ];
    
    for (const readingType of readingTypes) {
      const extractedReading = extractReading(html, readingType);
      if (extractedReading) {
        readings.push(extractedReading);
        console.log(`✅ ${readingType.title} extraída com sucesso`);
      } else {
        console.log(`⚠️ ${readingType.title} não encontrada`);
      }
    }
    
    if (readings.length === 0) {
      console.log('❌ Nenhuma leitura extraída do HTML');
      return null;
    }
    
    // Extrair informações adicionais
    const season = extractSeason(liturgicalTitle, html);
    const color = extractLiturgicalColor(html, season);
    
    console.log(`✅ Parse concluído: ${readings.length} leituras encontradas`);
    
    return {
      date: date.toISOString().split('T')[0],
      liturgicalDate: liturgicalTitle,
      season: season,
      celebration: liturgicalTitle,
      color: color,
      readings
    };
    
  } catch (error) {
    console.error('Erro no parse do HTML:', error);
    return null;
  }
}

// Extrair título litúrgico
function extractLiturgicalTitle(html: string): string {
  const titlePatterns = [
    /<h1[^>]*>(.*?)<\/h1>/i,
    /<title[^>]*>(.*?)<\/title>/i,
    /<h2[^>]*class="[^"]*titulo[^"]*"[^>]*>(.*?)<\/h2>/i,
    /<div[^>]*class="[^"]*celebracao[^"]*"[^>]*>(.*?)<\/div>/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = html.match(pattern);
    if (match) {
      const title = cleanHTML(match[1]).replace(/\s*-\s*CNBB.*$/i, '').trim();
      if (title.length > 5) {
        return title;
      }
    }
  }
  
  return 'Dia de Semana';
}

// Extrair uma leitura específica
function extractReading(html: string, readingType: any): LiturgicalReading | null {
  for (const pattern of readingType.patterns) {
    const match = html.match(pattern);
    if (match) {
      const fullContent = cleanHTML(match[1]);
      
      if (fullContent.length < 50) continue; // Muito pequeno
      
      // Separar referência e texto
      const { reference, text } = separateReferenceAndText(fullContent);
      
      if (text.length > 100) { // Texto deve ter pelo menos 100 caracteres
        return {
          reference: reference || `${readingType.title} - Consulte CNBB`,
          title: readingType.title,
          text: text,
          type: readingType.key
        };
      }
    }
  }
  
  return null;
}

// Separar referência bíblica do texto
function separateReferenceAndText(content: string): { reference: string; text: string } {
  // Padrões para identificar referências bíblicas
  const refPatterns = [
    /^([A-Za-z0-9\s]+\d+[,.\d\-\s]*[a-z]?)[:.]?\s*/,  // Ex: "Mt 5,1-12:"
    /^([^(]+\([^)]+\))[:.]?\s*/,                        // Ex: "Sl 23(24),1-6:"
    /^([^—]+)—\s*/,                                     // Ex: "Isaías 55,10-11 —"
    /^([^–]+)–\s*/                                      // Ex: "Lucas 4,16-30 –"
  ];
  
  for (const pattern of refPatterns) {
    const match = content.match(pattern);
    if (match && match[1].trim().length > 3) {
      const reference = match[1].trim();
      const text = content.replace(pattern, '').trim();
      
      if (text.length > 50) {
        return { reference, text };
      }
    }
  }
  
  // Se não conseguir separar, usar conteúdo completo como texto
  return {
    reference: 'Referência não identificada',
    text: content
  };
}

// Padrões para primeira leitura
function getFirstReadingPatterns(): RegExp[] {
  return [
    /<div[^>]*class="[^"]*primeira[^"]*leitura[^"]*"[^>]*>(.*?)<\/div>/is,
    /<section[^>]*class="[^"]*leitura[^"]*1[^"]*"[^>]*>(.*?)<\/section>/is,
    /primeira\s+leitura[^>]*>(.*?)(?=segunda\s+leitura|salmo\s+responsorial|evangelho)/is,
    /<h[23][^>]*>primeira\s+leitura<\/h[23]>(.*?)(?=<h[23]|$)/is,
    /1[aª]?\s*leitura[^>]*>(.*?)(?=2[aª]?\s*leitura|salmo|evangelho)/is
  ];
}

// Padrões para salmo
function getPsalmPatterns(): RegExp[] {
  return [
    /<div[^>]*class="[^"]*salmo[^"]*"[^>]*>(.*?)<\/div>/is,
    /<section[^>]*class="[^"]*responsorial[^"]*"[^>]*>(.*?)<\/section>/is,
    /salmo\s+responsorial[^>]*>(.*?)(?=segunda\s+leitura|evangelho|aclamação)/is,
    /<h[23][^>]*>salmo\s+responsorial<\/h[23]>(.*?)(?=<h[23]|$)/is,
    /responsorial[^>]*>(.*?)(?=segunda\s+leitura|evangelho)/is
  ];
}

// Padrões para segunda leitura
function getSecondReadingPatterns(): RegExp[] {
  return [
    /<div[^>]*class="[^"]*segunda[^"]*leitura[^"]*"[^>]*>(.*?)<\/div>/is,
    /<section[^>]*class="[^"]*leitura[^"]*2[^"]*"[^>]*>(.*?)<\/section>/is,
    /segunda\s+leitura[^>]*>(.*?)(?=evangelho|aclamação)/is,
    /<h[23][^>]*>segunda\s+leitura<\/h[23]>(.*?)(?=<h[23]|$)/is,
    /2[aª]?\s*leitura[^>]*>(.*?)(?=evangelho|aclamação)/is
  ];
}

// Padrões para evangelho
function getGospelPatterns(): RegExp[] {
  return [
    /<div[^>]*class="[^"]*evangelho[^"]*"[^>]*>(.*?)<\/div>/is,
    /<section[^>]*class="[^"]*gospel[^"]*"[^>]*>(.*?)<\/section>/is,
    /evangelho[^>]*>(.*?)(?=<\/(?:div|section|article|body)>|$)/is,
    /<h[23][^>]*>evangelho<\/h[23]>(.*?)(?=<h[23]|$)/is,
    /gospel[^>]*>(.*?)(?=<\/(?:div|section|article)>|$)/is
  ];
}

// Função para limpar HTML
function cleanHTML(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

// Extrair tempo litúrgico
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

// Extrair cor litúrgica
function extractLiturgicalColor(html: string, season: string): string {
  const htmlLower = html.toLowerCase();
  
  // Buscar cor explícita no HTML
  if (htmlLower.includes('branco') || htmlLower.includes('white')) return 'branco';
  if (htmlLower.includes('vermelho') || htmlLower.includes('red')) return 'vermelho';
  if (htmlLower.includes('roxo') || htmlLower.includes('violeta') || htmlLower.includes('purple')) return 'roxo';
  if (htmlLower.includes('verde') || htmlLower.includes('green')) return 'verde';
  if (htmlLower.includes('rosa') || htmlLower.includes('rose')) return 'rosa';
  
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
