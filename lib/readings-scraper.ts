// Sistema de Web Scraping para Leituras Litúrgicas
// Busca leituras de fontes confiáveis quando APIs não estão disponíveis

import { DailyReadings, LiturgicalReading } from './liturgical-readings';

// Função principal de scraping
export async function scrapeReadings(date: Date): Promise<DailyReadings | null> {
  const sources = [
    () => scrapeCNBB(date),
    () => scrapeAleteia(date),
    () => scrapePauline(date),
    () => scrapeCanção(date)
  ];

  for (const scraper of sources) {
    try {
      const result = await scraper();
      if (result) {
        console.log('✅ Leituras obtidas via scraping');
        return result;
      }
    } catch (error) {
      console.error('Erro no scraping:', error);
      continue;
    }
  }

  return null;
}

// Scraping do site da CNBB
async function scrapeCNBB(date: Date): Promise<DailyReadings | null> {
  try {
    const dateStr = formatDateForCNBB(date);
    const url = `https://www.cnbb.org.br/liturgia-diaria/?data=${dateStr}`;
    
    console.log('🔍 Fazendo scraping da CNBB:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LiturgiaIsaias/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return parseCNBBHTML(html, date);

  } catch (error) {
    console.error('Erro no scraping da CNBB:', error);
    return null;
  }
}

// Scraping do Aleteia
async function scrapeAleteia(date: Date): Promise<DailyReadings | null> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    const url = `https://pt.aleteia.org/daily-prayer/liturgy-of-the-day/?date=${dateStr}`;
    
    console.log('🔍 Fazendo scraping do Aleteia:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LiturgiaIsaias/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return parseAleiteiaHTML(html, date);

  } catch (error) {
    console.error('Erro no scraping do Aleteia:', error);
    return null;
  }
}

// Scraping da Editora Paulus
async function scrapePauline(date: Date): Promise<DailyReadings | null> {
  try {
    const dateStr = formatDateForPaulus(date);
    const url = `https://www.paulus.com.br/liturgia-diaria/${dateStr}`;
    
    console.log('🔍 Fazendo scraping da Paulus:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const html = await response.text();
    return parsePaulusHTML(html, date);

  } catch (error) {
    console.error('Erro no scraping da Paulus:', error);
    return null;
  }
}

// Scraping do Canção Nova
async function scrapeCanção(date: Date): Promise<DailyReadings | null> {
  try {
    const dateStr = formatDateForCancao(date);
    const url = `https://liturgiadiaria.cancaonova.com/${dateStr}`;
    
    console.log('🔍 Fazendo scraping do Canção Nova:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const html = await response.text();
    return parseCancaoHTML(html, date);

  } catch (error) {
    console.error('Erro no scraping do Canção Nova:', error);
    return null;
  }
}

// Parsers HTML (implementação básica - em produção usaria Cheerio)
function parseCNBBHTML(html: string, date: Date): DailyReadings | null {
  try {
    // Implementação básica usando regex (não ideal, mas funcional)
    const readings: LiturgicalReading[] = [];
    
    // Buscar primeira leitura
    const firstReadingMatch = html.match(/<div[^>]*class="[^"]*primeira-leitura[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (firstReadingMatch) {
      const text = cleanHTML(firstReadingMatch[1]);
      const refMatch = text.match(/^([^:]+):/);
      readings.push({
        reference: refMatch ? refMatch[1].trim() : 'Primeira Leitura',
        title: 'Primeira Leitura',
        text: text.replace(/^[^:]+:\s*/, ''),
        type: 'first'
      });
    }

    // Buscar salmo
    const psalmMatch = html.match(/<div[^>]*class="[^"]*salmo[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (psalmMatch) {
      const text = cleanHTML(psalmMatch[1]);
      readings.push({
        reference: 'Salmo Responsorial',
        title: 'Salmo Responsorial',
        text: text,
        type: 'psalm'
      });
    }

    // Buscar evangelho
    const gospelMatch = html.match(/<div[^>]*class="[^"]*evangelho[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (gospelMatch) {
      const text = cleanHTML(gospelMatch[1]);
      const refMatch = text.match(/^([^:]+):/);
      readings.push({
        reference: refMatch ? refMatch[1].trim() : 'Evangelho',
        title: 'Evangelho',
        text: text.replace(/^[^:]+:\s*/, ''),
        type: 'gospel'
      });
    }

    if (readings.length === 0) {
      return null;
    }

    return {
      date: date.toISOString().split('T')[0],
      liturgicalDate: extractLiturgicalDate(html) || 'Dia de Semana',
      season: 'Tempo Comum',
      celebration: 'Dia de Semana',
      color: 'verde',
      readings
    };

  } catch (error) {
    console.error('Erro ao fazer parse do HTML da CNBB:', error);
    return null;
  }
}

function parseAleiteiaHTML(html: string, date: Date): DailyReadings | null {
  // Implementação similar para Aleteia
  return null;
}

function parsePaulusHTML(html: string, date: Date): DailyReadings | null {
  // Implementação similar para Paulus
  return null;
}

function parseCancaoHTML(html: string, date: Date): DailyReadings | null {
  // Implementação similar para Canção Nova
  return null;
}

// Funções utilitárias
function formatDateForCNBB(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateForPaulus(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatDateForCancao(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}/${month}/${day}`;
}

function cleanHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/&nbsp;/g, ' ') // Remove &nbsp;
    .replace(/&amp;/g, '&') // Decodifica &amp;
    .replace(/&lt;/g, '<') // Decodifica &lt;
    .replace(/&gt;/g, '>') // Decodifica &gt;
    .replace(/&quot;/g, '"') // Decodifica &quot;
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim();
}

function extractLiturgicalDate(html: string): string | null {
  const match = html.match(/<h[1-6][^>]*>(.*?domingo.*?)<\/h[1-6]>/i);
  return match ? cleanHTML(match[1]) : null;
}

// Sistema de cache para evitar muitas requisições
const readingsCache = new Map<string, { data: DailyReadings; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

export function getCachedReadings(date: Date): DailyReadings | null {
  const key = date.toISOString().split('T')[0];
  const cached = readingsCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📖 Leituras obtidas do cache');
    return cached.data;
  }
  
  return null;
}

export function setCachedReadings(date: Date, readings: DailyReadings): void {
  const key = date.toISOString().split('T')[0];
  readingsCache.set(key, {
    data: readings,
    timestamp: Date.now()
  });
  console.log('💾 Leituras salvas no cache');
}

// Função para limpar cache (para debug e atualizações)
export function clearReadingsCache(): void {
  readingsCache.clear();
  console.log('🧹 Cache de leituras limpo!');
}
