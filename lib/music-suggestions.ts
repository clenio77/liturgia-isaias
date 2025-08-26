// Sistema Inteligente de Sugestões de Músicas
// Baseado em algoritmos de matching e aprendizado

import { LiturgicalData, getMusicSuggestions } from './liturgical-calendar';

export interface Music {
  id: string;
  titulo: string;
  compositor: string;
  categoria: 'Entrada' | 'Salmo' | 'Ofertório' | 'Comunhão' | 'Final';
  tempo: string[];
  tom: string;
  tags: string[];
  popularidade: number; // 0-100
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  duracao?: number; // em segundos
  arquivo?: string;
  audio?: string;
  letra?: string;
  cifra?: string;
}

export interface SuggestionCriteria {
  liturgicalData: LiturgicalData;
  categoria: Music['categoria'];
  dificuldade?: Music['dificuldade'];
  popularidade?: number;
  tom?: string;
  duracaoMax?: number;
  tags?: string[];
}

export interface SuggestionResult {
  musicas: Music[];
  score: number; // 0-100 - quão bem a música se adequa
  reason: string; // explicação da sugestão
}

// Base de dados de músicas (em produção viria do banco de dados)
const musicDatabase: Music[] = [
  // Músicas de Entrada
  {
    id: '1',
    titulo: 'Vem, Espírito Santo',
    compositor: 'Pe. José Weber',
    categoria: 'Entrada',
    tempo: ['Pentecostes', 'Tempo Comum'],
    tom: 'G',
    tags: ['espírito santo', 'pentecostes', 'invocação'],
    popularidade: 95,
    dificuldade: 'Fácil',
    duracao: 225,
    letra: 'Vem, Espírito Santo, vem nos consolar...'
  },
  {
    id: '2',
    titulo: 'Cristo Ressuscitou',
    compositor: 'Tradicional',
    categoria: 'Entrada',
    tempo: ['Páscoa'],
    tom: 'D',
    tags: ['ressurreição', 'páscoa', 'aleluia'],
    popularidade: 98,
    dificuldade: 'Fácil',
    duracao: 180
  },
  {
    id: '3',
    titulo: 'Preparai os Caminhos',
    compositor: 'Pe. Antônio Maria',
    categoria: 'Entrada',
    tempo: ['Advento'],
    tom: 'C',
    tags: ['advento', 'preparação', 'joão batista'],
    popularidade: 85,
    dificuldade: 'Médio',
    duracao: 200
  },
  
  // Salmos
  {
    id: '4',
    titulo: 'Salmo 33 - Provai e Vede',
    compositor: 'Ir. Miria Kolling',
    categoria: 'Salmo',
    tempo: ['Tempo Comum'],
    tom: 'F',
    tags: ['salmo responsorial', 'provai e vede'],
    popularidade: 90,
    dificuldade: 'Fácil',
    duracao: 150
  },
  {
    id: '5',
    titulo: 'Salmo 117 - Este é o Dia',
    compositor: 'Tradicional',
    categoria: 'Salmo',
    tempo: ['Páscoa'],
    tom: 'G',
    tags: ['páscoa', 'ressurreição', 'este é o dia'],
    popularidade: 95,
    dificuldade: 'Fácil',
    duracao: 120
  },
  
  // Ofertório
  {
    id: '6',
    titulo: 'Recebe, ó Deus',
    compositor: 'Pe. José Weber',
    categoria: 'Ofertório',
    tempo: ['Tempo Comum', 'Quaresma'],
    tom: 'Am',
    tags: ['ofertório', 'oferenda', 'sacrifício'],
    popularidade: 88,
    dificuldade: 'Médio',
    duracao: 240
  },
  
  // Comunhão
  {
    id: '7',
    titulo: 'Pão da Vida',
    compositor: 'Ir. Miria Kolling',
    categoria: 'Comunhão',
    tempo: ['Tempo Comum', 'Páscoa'],
    tom: 'C',
    tags: ['eucaristia', 'pão da vida', 'comunhão'],
    popularidade: 92,
    dificuldade: 'Fácil',
    duracao: 210
  },
  {
    id: '8',
    titulo: 'Jesus, Pão dos Pobres',
    compositor: 'Pe. Antônio Maria',
    categoria: 'Comunhão',
    tempo: ['Quaresma', 'Tempo Comum'],
    tom: 'Dm',
    tags: ['eucaristia', 'pobres', 'solidariedade'],
    popularidade: 80,
    dificuldade: 'Médio',
    duracao: 195
  },
  
  // Final
  {
    id: '9',
    titulo: 'Ide em Paz',
    compositor: 'Tradicional',
    categoria: 'Final',
    tempo: ['Tempo Comum'],
    tom: 'G',
    tags: ['envio', 'missão', 'paz'],
    popularidade: 85,
    dificuldade: 'Fácil',
    duracao: 160
  },
  {
    id: '10',
    titulo: 'Aleluia da Ressurreição',
    compositor: 'Pe. José Weber',
    categoria: 'Final',
    tempo: ['Páscoa'],
    tom: 'D',
    tags: ['aleluia', 'ressurreição', 'júbilo'],
    popularidade: 90,
    dificuldade: 'Médio',
    duracao: 180
  }
];

// Algoritmo principal de sugestões
export function getSuggestions(criteria: SuggestionCriteria): SuggestionResult[] {
  const { liturgicalData, categoria, dificuldade, popularidade, tom, duracaoMax, tags } = criteria;
  
  // Filtrar músicas por categoria
  let candidatas = musicDatabase.filter(music => music.categoria === categoria);
  
  // Calcular score para cada música
  const results: SuggestionResult[] = candidatas.map(music => {
    let score = 0;
    let reasons: string[] = [];
    
    // Score baseado no tempo litúrgico (peso: 40%)
    const tempoLiturgico = getTempoLiturgico(liturgicalData.season);
    if (music.tempo.includes(tempoLiturgico)) {
      score += 40;
      reasons.push(`Adequada para ${tempoLiturgico}`);
    } else if (music.tempo.includes('Tempo Comum')) {
      score += 20;
      reasons.push('Adequada para uso geral');
    }
    
    // Score baseado na celebração específica (peso: 20%)
    const celebrationScore = getCelebrationScore(music, liturgicalData.celebration);
    score += celebrationScore;
    if (celebrationScore > 0) {
      reasons.push('Combina com a celebração');
    }
    
    // Score baseado na popularidade (peso: 15%)
    score += (music.popularidade / 100) * 15;
    if (music.popularidade > 90) {
      reasons.push('Muito conhecida pela comunidade');
    }
    
    // Score baseado na dificuldade (peso: 10%)
    if (dificuldade) {
      if (music.dificuldade === dificuldade) {
        score += 10;
        reasons.push(`Dificuldade ${dificuldade.toLowerCase()}`);
      }
    } else {
      // Preferir músicas mais fáceis se não especificado
      const difficultyScore = music.dificuldade === 'Fácil' ? 10 : 
                             music.dificuldade === 'Médio' ? 7 : 4;
      score += difficultyScore;
    }
    
    // Score baseado no tom (peso: 5%)
    if (tom && music.tom === tom) {
      score += 5;
      reasons.push(`Tom ${tom}`);
    }
    
    // Score baseado na duração (peso: 5%)
    if (duracaoMax && music.duracao && music.duracao <= duracaoMax) {
      score += 5;
      reasons.push('Duração adequada');
    }
    
    // Score baseado nas tags (peso: 5%)
    if (tags && tags.length > 0) {
      const matchingTags = music.tags.filter(tag => 
        tags.some(searchTag => tag.toLowerCase().includes(searchTag.toLowerCase()))
      );
      if (matchingTags.length > 0) {
        score += 5;
        reasons.push(`Tags: ${matchingTags.join(', ')}`);
      }
    }
    
    return {
      musicas: [music],
      score: Math.min(score, 100),
      reason: reasons.join('; ')
    };
  });
  
  // Ordenar por score e retornar top 5
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

// Função para obter sugestões completas para uma missa
export function getCompleteMassSuggestions(liturgicalData: LiturgicalData): {
  entrada: SuggestionResult[];
  salmo: SuggestionResult[];
  ofertorio: SuggestionResult[];
  comunhao: SuggestionResult[];
  final: SuggestionResult[];
} {
  return {
    entrada: getSuggestions({ liturgicalData, categoria: 'Entrada' }),
    salmo: getSuggestions({ liturgicalData, categoria: 'Salmo' }),
    ofertorio: getSuggestions({ liturgicalData, categoria: 'Ofertório' }),
    comunhao: getSuggestions({ liturgicalData, categoria: 'Comunhão' }),
    final: getSuggestions({ liturgicalData, categoria: 'Final' })
  };
}

// Função auxiliar para mapear tempo litúrgico
function getTempoLiturgico(season: string): string {
  const mapping = {
    'ADVENT': 'Advento',
    'CHRISTMAS': 'Natal',
    'ORDINARY': 'Tempo Comum',
    'LENT': 'Quaresma',
    'EASTER': 'Páscoa',
    'SPECIAL': 'Especial'
  };
  return mapping[season as keyof typeof mapping] || 'Tempo Comum';
}

// Função para calcular score baseado na celebração
function getCelebrationScore(music: Music, celebration: string): number {
  const keywords = celebration.toLowerCase().split(' ');
  let score = 0;
  
  // Verificar se alguma tag da música combina com palavras da celebração
  music.tags.forEach(tag => {
    keywords.forEach(keyword => {
      if (tag.toLowerCase().includes(keyword) || keyword.includes(tag.toLowerCase())) {
        score += 5;
      }
    });
  });
  
  // Verificar título da música
  keywords.forEach(keyword => {
    if (music.titulo.toLowerCase().includes(keyword)) {
      score += 10;
    }
  });
  
  return Math.min(score, 20); // Máximo 20 pontos
}

// Função para aprender com as escolhas do usuário
export function recordUserChoice(
  liturgicalData: LiturgicalData,
  categoria: Music['categoria'],
  chosenMusicId: string,
  rejectedMusicIds: string[]
): void {
  // Em produção, isso salvaria no banco de dados para melhorar as sugestões
  console.log('Registrando escolha do usuário:', {
    liturgicalData,
    categoria,
    chosen: chosenMusicId,
    rejected: rejectedMusicIds
  });
  
  // Aqui você implementaria o algoritmo de aprendizado
  // Por exemplo, aumentar a popularidade da música escolhida
  // e diminuir das rejeitadas para contextos similares
}

// Função para buscar músicas por texto
export function searchMusic(query: string): Music[] {
  const searchTerms = query.toLowerCase().split(' ');
  
  return musicDatabase.filter(music => {
    const searchableText = `${music.titulo} ${music.compositor} ${music.tags.join(' ')}`.toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  }).sort((a, b) => b.popularidade - a.popularidade);
}
