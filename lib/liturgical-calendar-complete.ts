// Sistema Completo de Calendário Litúrgico
// Inclui santos, festas, cores litúrgicas e celebrações especiais

export interface LiturgicalSaint {
  name: string;
  title: string;
  category: 'saint' | 'blessed' | 'martyr' | 'doctor' | 'virgin' | 'confessor';
  feast: 'memorial' | 'feast' | 'solemnity' | 'optional';
  biography: string;
  patronOf: string[];
  prayer: string;
}

export interface LiturgicalFeast {
  name: string;
  type: 'solemnity' | 'feast' | 'memorial' | 'optional';
  color: 'white' | 'red' | 'green' | 'purple' | 'rose' | 'black';
  rank: number; // 1-10, sendo 1 a mais alta
  description: string;
  traditions: string[];
  specialReadings?: boolean;
}

export interface CompleteLiturgicalData {
  date: string;
  dayOfWeek: number;
  weekOfYear: number;
  liturgicalSeason: string;
  seasonWeek: number;
  color: string;
  rank: number;
  celebration: string;
  saint?: LiturgicalSaint;
  feast?: LiturgicalFeast;
  specialNotes: string[];
  fastingDay: boolean;
  holyDayOfObligation: boolean;
  ember: boolean;
  rogation: boolean;
}

// Base de dados de santos por data (MM-DD)
const saintsDatabase: Record<string, LiturgicalSaint> = {
  '01-01': {
    name: 'Santa Maria, Mãe de Deus',
    title: 'Mãe de Deus',
    category: 'virgin',
    feast: 'solemnity',
    biography: 'Maria, Mãe de Jesus Cristo, é venerada como Mãe de Deus e Mãe da Igreja.',
    patronOf: ['Humanidade', 'Igreja Católica', 'Mães'],
    prayer: 'Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte.'
  },
  '01-02': {
    name: 'Santos Basílio Magno e Gregório Nazianzeno',
    title: 'Bispos e Doutores da Igreja',
    category: 'doctor',
    feast: 'memorial',
    biography: 'Grandes teólogos e defensores da fé cristã no século IV.',
    patronOf: ['Teólogos', 'Estudantes'],
    prayer: 'Santos Basílio e Gregório, intercedei por nós junto ao Senhor.'
  },
  '01-03': {
    name: 'Santíssimo Nome de Jesus',
    title: 'Nome de Jesus',
    category: 'saint',
    feast: 'optional',
    biography: 'Celebração do santo nome de Jesus, dado pelo anjo Gabriel.',
    patronOf: ['Devotos do Nome de Jesus'],
    prayer: 'Jesus, que vosso santo nome seja sempre bendito e glorificado.'
  },
  '01-06': {
    name: 'Epifania do Senhor',
    title: 'Manifestação do Senhor',
    category: 'saint',
    feast: 'solemnity',
    biography: 'Celebração da manifestação de Jesus aos magos do Oriente.',
    patronOf: ['Missionários', 'Viajantes'],
    prayer: 'Senhor, que vos manifestastes aos magos, manifestai-vos também a nós.'
  },
  '03-19': {
    name: 'São José',
    title: 'Esposo da Virgem Maria',
    category: 'confessor',
    feast: 'solemnity',
    biography: 'Esposo de Maria e pai adotivo de Jesus, modelo de pai e trabalhador.',
    patronOf: ['Pais de família', 'Trabalhadores', 'Igreja Universal'],
    prayer: 'São José, pai e protetor, intercedei por nós junto a Jesus e Maria.'
  },
  '03-25': {
    name: 'Anunciação do Senhor',
    title: 'Anunciação',
    category: 'saint',
    feast: 'solemnity',
    biography: 'Celebração do anúncio do anjo Gabriel a Maria sobre a encarnação.',
    patronOf: ['Mães expectantes'],
    prayer: 'Ave Maria, cheia de graça, o Senhor é convosco.'
  },
  '06-24': {
    name: 'Nascimento de São João Batista',
    title: 'Precursor do Senhor',
    category: 'saint',
    feast: 'solemnity',
    biography: 'Precursor de Jesus Cristo, batizou o Senhor no rio Jordão.',
    patronOf: ['Batizados'],
    prayer: 'São João Batista, preparai nossos corações para receber o Senhor.'
  },
  '06-29': {
    name: 'Santos Pedro e Paulo',
    title: 'Apóstolos',
    category: 'martyr',
    feast: 'solemnity',
    biography: 'Pilares da Igreja primitiva, Pedro como primeiro papa e Paulo como apóstolo dos gentios.',
    patronOf: ['Igreja', 'Papas', 'Missionários'],
    prayer: 'Santos Pedro e Paulo, fundamentos da Igreja, intercedei por nós.'
  },
  '08-15': {
    name: 'Assunção de Nossa Senhora',
    title: 'Assunção da Virgem Maria',
    category: 'virgin',
    feast: 'solemnity',
    biography: 'Celebração da assunção de Maria ao céu em corpo e alma.',
    patronOf: ['Devotos de Maria'],
    prayer: 'Maria, assumpta ao céu, intercedei por nós que peregrinamos na terra.'
  },
  '10-12': {
    name: 'Nossa Senhora Aparecida',
    title: 'Padroeira do Brasil',
    category: 'virgin',
    feast: 'solemnity',
    biography: 'Aparição de Nossa Senhora nas águas do rio Paraíba em 1717.',
    patronOf: ['Brasil', 'Pescadores'],
    prayer: 'Nossa Senhora Aparecida, Padroeira do Brasil, rogai por nós.'
  },
  '11-01': {
    name: 'Todos os Santos',
    title: 'Todos os Santos',
    category: 'saint',
    feast: 'solemnity',
    biography: 'Celebração de todos os santos conhecidos e desconhecidos.',
    patronOf: ['Todos os fiéis'],
    prayer: 'Santos e santas de Deus, intercedei por nós.'
  },
  '11-02': {
    name: 'Finados',
    title: 'Comemoração dos Fiéis Defuntos',
    category: 'saint',
    feast: 'memorial',
    biography: 'Dia de oração pelos fiéis defuntos.',
    patronOf: ['Almas do purgatório'],
    prayer: 'Dai-lhes, Senhor, o descanso eterno, e brilhe para eles a luz perpétua.'
  },
  '12-08': {
    name: 'Imaculada Conceição',
    title: 'Imaculada Conceição de Maria',
    category: 'virgin',
    feast: 'solemnity',
    biography: 'Celebração da concepção imaculada de Maria, sem pecado original.',
    patronOf: ['Portugal', 'Estados Unidos'],
    prayer: 'Ó Maria concebida sem pecado, rogai por nós que recorremos a vós.'
  },
  '12-25': {
    name: 'Natal do Senhor',
    title: 'Nascimento de Jesus Cristo',
    category: 'saint',
    feast: 'solemnity',
    biography: 'Celebração do nascimento de Jesus Cristo em Belém.',
    patronOf: ['Humanidade'],
    prayer: 'Glória a Deus nas alturas e paz na terra aos homens de boa vontade.'
  }
};

// Festas móveis (baseadas na Páscoa)
const movableFeastsCalculator = {
  // Cálculo da Páscoa (algoritmo simplificado)
  getEasterDate(year: number): Date {
    // Algoritmo de Gauss para cálculo da Páscoa
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(year, month - 1, day);
  },

  // Outras festas baseadas na Páscoa
  getMovableFeasts(year: number): Record<string, Date> {
    const easter = this.getEasterDate(year);
    const feasts: Record<string, Date> = {};
    
    // Quaresma
    feasts.ashWednesday = new Date(easter.getTime() - 46 * 24 * 60 * 60 * 1000);
    feasts.palmSunday = new Date(easter.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Semana Santa
    feasts.holyThursday = new Date(easter.getTime() - 3 * 24 * 60 * 60 * 1000);
    feasts.goodFriday = new Date(easter.getTime() - 2 * 24 * 60 * 60 * 1000);
    feasts.holySaturday = new Date(easter.getTime() - 1 * 24 * 60 * 60 * 1000);
    
    // Tempo Pascal
    feasts.easter = easter;
    feasts.ascension = new Date(easter.getTime() + 39 * 24 * 60 * 60 * 1000);
    feasts.pentecost = new Date(easter.getTime() + 49 * 24 * 60 * 60 * 1000);
    feasts.trinity = new Date(easter.getTime() + 56 * 24 * 60 * 60 * 1000);
    feasts.corpusChristi = new Date(easter.getTime() + 60 * 24 * 60 * 60 * 1000);
    
    // Advento (4 domingos antes do Natal)
    const christmas = new Date(year, 11, 25);
    const christmasDay = christmas.getDay();
    const adventStart = new Date(christmas.getTime() - (22 + christmasDay) * 24 * 60 * 60 * 1000);
    feasts.adventStart = adventStart;
    
    return feasts;
  }
};

// Função principal para obter dados litúrgicos completos
export function getCompleteLiturgicalData(date: Date): CompleteLiturgicalData {
  const dateKey = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  const year = date.getFullYear();
  const movableFeasts = movableFeastsCalculator.getMovableFeasts(year);
  
  // Determinar tempo litúrgico
  const season = determineLiturgicalSeason(date, movableFeasts);
  
  // Buscar santo do dia
  const saint = saintsDatabase[dateKey];
  
  // Determinar cor litúrgica
  const color = determineLiturgicalColor(date, season, saint);
  
  // Determinar celebração principal
  const celebration = determineCelebration(date, season, saint, movableFeasts);
  
  return {
    date: date.toISOString().split('T')[0],
    dayOfWeek: date.getDay(),
    weekOfYear: getWeekOfYear(date),
    liturgicalSeason: season.name,
    seasonWeek: season.week,
    color: color,
    rank: saint?.feast === 'solemnity' ? 1 : saint?.feast === 'feast' ? 2 : 3,
    celebration: celebration,
    saint: saint,
    specialNotes: getSpecialNotes(date, season, saint),
    fastingDay: isFastingDay(date, season),
    holyDayOfObligation: isHolyDayOfObligation(date, saint),
    ember: false, // Implementar se necessário
    rogation: false // Implementar se necessário
  };
}

// Funções auxiliares
function determineLiturgicalSeason(date: Date, movableFeasts: Record<string, Date>) {
  const year = date.getFullYear();
  const christmas = new Date(year, 11, 25);
  const epiphany = new Date(year, 0, 6);
  
  // Tempo do Natal
  if (date >= christmas || date <= epiphany) {
    return { name: 'Tempo do Natal', week: 1 };
  }
  
  // Quaresma
  if (date >= movableFeasts.ashWednesday && date < movableFeasts.easter) {
    const weeksDiff = Math.floor((date.getTime() - movableFeasts.ashWednesday.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return { name: 'Quaresma', week: weeksDiff + 1 };
  }
  
  // Tempo Pascal
  if (date >= movableFeasts.easter && date <= movableFeasts.pentecost) {
    const weeksDiff = Math.floor((date.getTime() - movableFeasts.easter.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return { name: 'Tempo Pascal', week: weeksDiff + 1 };
  }
  
  // Advento
  if (date >= movableFeasts.adventStart) {
    const weeksDiff = Math.floor((date.getTime() - movableFeasts.adventStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return { name: 'Advento', week: weeksDiff + 1 };
  }
  
  // Tempo Comum
  return { name: 'Tempo Comum', week: 1 };
}

function determineLiturgicalColor(date: Date, season: any, saint?: LiturgicalSaint): string {
  if (saint?.feast === 'solemnity') {
    return saint.category === 'martyr' ? 'red' : 'white';
  }
  
  switch (season.name) {
    case 'Tempo do Natal':
    case 'Tempo Pascal':
      return 'white';
    case 'Quaresma':
    case 'Advento':
      return 'purple';
    default:
      return 'green';
  }
}

function determineCelebration(date: Date, season: any, saint?: LiturgicalSaint, movableFeasts?: Record<string, Date>): string {
  if (saint?.feast === 'solemnity') {
    return saint.name;
  }
  
  // Verificar festas móveis
  if (movableFeasts) {
    for (const [feastName, feastDate] of Object.entries(movableFeasts)) {
      if (date.toDateString() === feastDate.toDateString()) {
        return getFeastDisplayName(feastName);
      }
    }
  }
  
  if (saint) {
    return saint.name;
  }
  
  const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return `${dayNames[date.getDay()]} da ${season.week}ª Semana do ${season.name}`;
}

function getFeastDisplayName(feastKey: string): string {
  const names: Record<string, string> = {
    ashWednesday: 'Quarta-feira de Cinzas',
    palmSunday: 'Domingo de Ramos',
    holyThursday: 'Quinta-feira Santa',
    goodFriday: 'Sexta-feira Santa',
    holySaturday: 'Sábado Santo',
    easter: 'Domingo de Páscoa',
    ascension: 'Ascensão do Senhor',
    pentecost: 'Pentecostes',
    trinity: 'Santíssima Trindade',
    corpusChristi: 'Corpus Christi',
    adventStart: 'Primeiro Domingo do Advento'
  };
  
  return names[feastKey] || feastKey;
}

function getSpecialNotes(date: Date, season: any, saint?: LiturgicalSaint): string[] {
  const notes: string[] = [];
  
  if (saint?.feast === 'solemnity') {
    notes.push('Solenidade - precedência sobre o tempo litúrgico');
  }
  
  if (season.name === 'Quaresma') {
    notes.push('Tempo de penitência e preparação para a Páscoa');
  }
  
  if (season.name === 'Advento') {
    notes.push('Tempo de preparação para o Natal');
  }
  
  return notes;
}

function isFastingDay(date: Date, season: any): boolean {
  const dayOfWeek = date.getDay();
  
  // Quaresma: quartas e sextas
  if (season.name === 'Quaresma' && (dayOfWeek === 3 || dayOfWeek === 5)) {
    return true;
  }
  
  // Sexta-feira Santa sempre
  // (implementar verificação específica)
  
  return false;
}

function isHolyDayOfObligation(date: Date, saint?: LiturgicalSaint): boolean {
  const holyDays = [
    '01-01', // Santa Maria, Mãe de Deus
    '01-06', // Epifania (onde é dia santo de guarda)
    '08-15', // Assunção
    '11-01', // Todos os Santos
    '12-08', // Imaculada Conceição
    '12-25'  // Natal
  ];
  
  const dateKey = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  return holyDays.includes(dateKey);
}

function getWeekOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}
