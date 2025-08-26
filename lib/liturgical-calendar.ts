// Sistema de Calendário Litúrgico Católico
// Baseado no Calendário Romano Geral

export interface LiturgicalData {
  season: 'ADVENT' | 'CHRISTMAS' | 'ORDINARY' | 'LENT' | 'EASTER' | 'SPECIAL';
  seasonName: string;
  week: number;
  celebration: string;
  color: 'green' | 'purple' | 'white' | 'red' | 'rose';
  rank: 'solemnity' | 'feast' | 'memorial' | 'optional' | 'weekday';
  readings?: {
    first: string;
    psalm: string;
    second?: string;
    gospel: string;
  };
}

// Função para calcular a Páscoa (Algoritmo de Gauss)
function calculateEaster(year: number): Date {
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
}

// Celebrações fixas do ano litúrgico
const fixedCelebrations: Record<string, Partial<LiturgicalData>> = {
  '01-01': { celebration: 'Santa Maria, Mãe de Deus', season: 'CHRISTMAS', color: 'white', rank: 'solemnity' },
  '01-06': { celebration: 'Epifania do Senhor', season: 'CHRISTMAS', color: 'white', rank: 'solemnity' },
  '02-02': { celebration: 'Apresentação do Senhor', season: 'ORDINARY', color: 'white', rank: 'feast' },
  '03-19': { celebration: 'São José', season: 'ORDINARY', color: 'white', rank: 'solemnity' },
  '03-25': { celebration: 'Anunciação do Senhor', season: 'ORDINARY', color: 'white', rank: 'solemnity' },
  '06-24': { celebration: 'Nascimento de São João Batista', season: 'ORDINARY', color: 'white', rank: 'solemnity' },
  '06-29': { celebration: 'Santos Pedro e Paulo', season: 'ORDINARY', color: 'red', rank: 'solemnity' },
  '08-15': { celebration: 'Assunção de Nossa Senhora', season: 'ORDINARY', color: 'white', rank: 'solemnity' },
  '09-07': { celebration: 'Independência do Brasil', season: 'ORDINARY', color: 'green', rank: 'optional' },
  '10-12': { celebration: 'Nossa Senhora Aparecida', season: 'ORDINARY', color: 'white', rank: 'solemnity' },
  '11-01': { celebration: 'Todos os Santos', season: 'ORDINARY', color: 'white', rank: 'solemnity' },
  '11-02': { celebration: 'Finados', season: 'ORDINARY', color: 'purple', rank: 'memorial' },
  '11-15': { celebration: 'Proclamação da República', season: 'ORDINARY', color: 'green', rank: 'optional' },
  '12-08': { celebration: 'Imaculada Conceição', season: 'ADVENT', color: 'white', rank: 'solemnity' },
  '12-25': { celebration: 'Natal do Senhor', season: 'CHRISTMAS', color: 'white', rank: 'solemnity' },
};

// Função principal para obter dados litúrgicos de uma data
export function getLiturgicalData(date: Date): LiturgicalData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Verificar celebrações fixas
  const dateKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  if (fixedCelebrations[dateKey]) {
    const fixed = fixedCelebrations[dateKey];
    return {
      season: fixed.season!,
      seasonName: getSeasonName(fixed.season!),
      week: 1,
      celebration: fixed.celebration!,
      color: fixed.color!,
      rank: fixed.rank!,
      ...fixed
    };
  }

  // Calcular datas móveis baseadas na Páscoa
  const easter = calculateEaster(year);
  const easterDay = Math.floor((easter.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Determinar tempo litúrgico
  if (dayOfYear >= easterDay - 46 && dayOfYear < easterDay) {
    // Quaresma (46 dias antes da Páscoa)
    const week = Math.ceil((dayOfYear - (easterDay - 46)) / 7);
    return {
      season: 'LENT',
      seasonName: 'Quaresma',
      week,
      celebration: week === 1 ? 'Quarta-feira de Cinzas' : `${week}ª Semana da Quaresma`,
      color: week === 4 ? 'rose' : 'purple',
      rank: 'weekday'
    };
  }
  
  if (dayOfYear >= easterDay && dayOfYear < easterDay + 50) {
    // Tempo Pascal (50 dias)
    const week = Math.ceil((dayOfYear - easterDay + 1) / 7);
    return {
      season: 'EASTER',
      seasonName: 'Tempo Pascal',
      week,
      celebration: dayOfYear === easterDay ? 'Domingo de Páscoa' : 
                  dayOfYear === easterDay + 49 ? 'Pentecostes' :
                  `${week}ª Semana da Páscoa`,
      color: 'white',
      rank: dayOfYear === easterDay || dayOfYear === easterDay + 49 ? 'solemnity' : 'weekday'
    };
  }

  // Advento (4 domingos antes do Natal)
  const christmas = new Date(year, 11, 25);
  const christmasDay = Math.floor((christmas.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const adventStart = christmasDay - 28; // Aproximadamente 4 semanas
  
  if (dayOfYear >= adventStart) {
    const week = Math.ceil((dayOfYear - adventStart + 1) / 7);
    return {
      season: 'ADVENT',
      seasonName: 'Advento',
      week,
      celebration: `${week}º Domingo do Advento`,
      color: week === 3 ? 'rose' : 'purple',
      rank: 'weekday'
    };
  }

  // Tempo do Natal (até Batismo do Senhor)
  if (dayOfYear >= christmasDay || dayOfYear <= 20) {
    return {
      season: 'CHRISTMAS',
      seasonName: 'Tempo do Natal',
      week: 1,
      celebration: 'Tempo do Natal',
      color: 'white',
      rank: 'weekday'
    };
  }

  // Tempo Comum (resto do ano)
  const ordinaryWeek = Math.ceil((dayOfYear - 20) / 7);
  return {
    season: 'ORDINARY',
    seasonName: 'Tempo Comum',
    week: ordinaryWeek,
    celebration: `${ordinaryWeek}ª Semana do Tempo Comum`,
    color: 'green',
    rank: 'weekday'
  };
}

function getSeasonName(season: string): string {
  const names = {
    'ADVENT': 'Advento',
    'CHRISTMAS': 'Tempo do Natal',
    'ORDINARY': 'Tempo Comum',
    'LENT': 'Quaresma',
    'EASTER': 'Tempo Pascal',
    'SPECIAL': 'Celebração Especial'
  };
  return names[season as keyof typeof names] || 'Tempo Comum';
}

// Função para obter sugestões de músicas baseadas no tempo litúrgico
export function getMusicSuggestions(liturgicalData: LiturgicalData): {
  entrada: string[];
  salmo: string[];
  ofertorio: string[];
  comunhao: string[];
  final: string[];
} {
  const suggestions = {
    entrada: [] as string[],
    salmo: [] as string[],
    ofertorio: [] as string[],
    comunhao: [] as string[],
    final: [] as string[]
  };

  switch (liturgicalData.season) {
    case 'ADVENT':
      suggestions.entrada = ['Vem, Senhor Jesus', 'Maranatha', 'Desperta, Desperta'];
      suggestions.salmo = ['Salmo 24', 'Salmo 79', 'Salmo 84'];
      suggestions.ofertorio = ['Preparai os Caminhos', 'Vem, Vem, Senhor'];
      suggestions.comunhao = ['O Senhor Virá', 'Eis que Vem o Senhor'];
      suggestions.final = ['Ide Preparar', 'Vinde, Vinde'];
      break;
      
    case 'CHRISTMAS':
      suggestions.entrada = ['Noite Feliz', 'Nasceu Jesus', 'Glória a Deus'];
      suggestions.salmo = ['Salmo 95', 'Salmo 97', 'Salmo 2'];
      suggestions.ofertorio = ['Oferecemos', 'Deus Conosco'];
      suggestions.comunhao = ['Pão da Vida', 'Emanuel'];
      suggestions.final = ['Glória ao Pai', 'Paz na Terra'];
      break;
      
    case 'LENT':
      suggestions.entrada = ['Perdão, Senhor', 'Quaresma, Tempo de Graça'];
      suggestions.salmo = ['Salmo 50', 'Salmo 129', 'Salmo 90'];
      suggestions.ofertorio = ['Recebe, ó Deus', 'Oferenda'];
      suggestions.comunhao = ['Pão da Vida', 'Jesus, Pão dos Pobres'];
      suggestions.final = ['Caminhando', 'Seguir-te'];
      break;
      
    case 'EASTER':
      suggestions.entrada = ['Cristo Ressuscitou', 'Aleluia, Aleluia'];
      suggestions.salmo = ['Salmo 117', 'Salmo 65', 'Salmo 99'];
      suggestions.ofertorio = ['Ressurreição', 'Vida Nova'];
      suggestions.comunhao = ['Pão da Vida', 'Cristo Vive'];
      suggestions.final = ['Aleluia da Ressurreição', 'Cristo Venceu'];
      break;
      
    default: // ORDINARY
      suggestions.entrada = ['Vem, Espírito Santo', 'Cantai ao Senhor'];
      suggestions.salmo = ['Salmo 33', 'Salmo 62', 'Salmo 22'];
      suggestions.ofertorio = ['Recebe, ó Deus', 'Ofertório da Paz'];
      suggestions.comunhao = ['Pão da Vida', 'Eu sou o Pão da Vida'];
      suggestions.final = ['Ide em Paz', 'Benção Final'];
      break;
  }

  return suggestions;
}
