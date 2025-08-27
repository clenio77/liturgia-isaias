// Sistema de Homilias e Recursos Pastorais
// Sugestões de homilias baseadas nas leituras litúrgicas

import { DailyReadings, LiturgicalReading } from './liturgical-readings';

export interface HomilyTheme {
  id: string;
  title: string;
  description: string;
  keyWords: string[];
  biblicalReferences: string[];
}

export interface HomilySuggestion {
  id: string;
  date: string;
  theme: HomilyTheme;
  introduction: string;
  mainPoints: string[];
  conclusion: string;
  practicalApplication: string;
  prayerSuggestion: string;
  duration: string; // "5-7 minutos", "10-12 minutos"
  targetAudience: 'general' | 'children' | 'youth' | 'adults';
}

export interface ExegeticalComment {
  reading: 'first' | 'psalm' | 'second' | 'gospel' | 'antiphon';
  reference: string;
  historicalContext: string;
  literaryGenre: string;
  keyMessage: string;
  theologicalInsight: string;
  pastoralApplication: string;
}

export interface LiturgicalPrayers {
  collectPrayer: string;
  prayerOfTheFaithful: string[];
  offertoryPrayer: string;
  communionPrayer: string;
  finalBlessing: string;
}

export interface PastoralResources {
  date: string;
  readings: DailyReadings;
  homilySuggestions: HomilySuggestion[];
  exegeticalComments: ExegeticalComment[];
  prayers: LiturgicalPrayers;
  musicSuggestions: string[];
  decorationIdeas: string[];
  catechesisPoints: string[];
}

// Base de dados de homilias por data
const homilyDatabase: Record<string, HomilySuggestion[]> = {
  // Natal - 25/12
  '2024-12-25': [
    {
      id: 'natal-2024-1',
      date: '2024-12-25',
      theme: {
        id: 'incarnation',
        title: 'O Verbo se fez carne',
        description: 'A encarnação como manifestação do amor de Deus',
        keyWords: ['encarnação', 'amor', 'salvação', 'Emanuel'],
        biblicalReferences: ['Jo 1,14', 'Is 52,7-10', 'Hb 1,1-6']
      },
      introduction: 'Irmãos e irmãs, hoje celebramos o maior mistério da nossa fé: Deus se fez homem. O Verbo eterno, que estava junto do Pai desde o princípio, assumiu nossa natureza humana para nos salvar.',
      mainPoints: [
        'Deus não permaneceu distante da humanidade, mas veio ao nosso encontro',
        'Jesus é a Palavra definitiva de Deus para nós, superando todos os profetas',
        'A encarnação revela o amor incondicional de Deus pela humanidade',
        'Cristo é a luz que brilha nas trevas do mundo'
      ],
      conclusion: 'Que este Natal renove em nós a alegria de saber que Deus está conosco. Emanuel - Deus conosco - não é apenas um nome, mas uma realidade que transforma nossa vida.',
      practicalApplication: 'Como podemos ser instrumentos da presença de Deus no mundo? Através do amor concreto ao próximo, especialmente aos mais necessitados.',
      prayerSuggestion: 'Senhor Jesus, que nasceste para nos salvar, ajuda-nos a acolher tua presença em nossa vida e a ser testemunhas do teu amor no mundo.',
      duration: '8-10 minutos',
      targetAudience: 'general'
    },
    {
      id: 'natal-2024-2',
      date: '2024-12-25',
      theme: {
        id: 'light-darkness',
        title: 'A luz brilha nas trevas',
        description: 'Cristo como luz do mundo que vence as trevas',
        keyWords: ['luz', 'trevas', 'esperança', 'salvação'],
        biblicalReferences: ['Jo 1,5', 'Jo 1,9', 'Is 52,7']
      },
      introduction: 'Em meio às trevas do mundo - violência, injustiça, sofrimento - uma luz brilhou: Jesus Cristo, a luz verdadeira que ilumina todo homem.',
      mainPoints: [
        'As trevas do mundo não conseguem vencer a luz de Cristo',
        'Jesus é a luz que traz esperança aos desesperançados',
        'Cada cristão é chamado a ser luz no mundo',
        'O Natal é a festa da luz que vence as trevas'
      ],
      conclusion: 'Que a luz de Cristo ilumine nossos corações e nos torne portadores de luz para todos ao nosso redor.',
      practicalApplication: 'Onde posso levar a luz de Cristo hoje? Na família, no trabalho, na comunidade?',
      prayerSuggestion: 'Jesus, luz do mundo, ilumina nossa vida e ajuda-nos a ser luz para os outros.',
      duration: '6-8 minutos',
      targetAudience: 'general'
    }
  ],

  // Páscoa - 31/03/2024
  '2024-03-31': [
    {
      id: 'pascoa-2024-1',
      date: '2024-03-31',
      theme: {
        id: 'resurrection-victory',
        title: 'Cristo ressuscitou, aleluia!',
        description: 'A ressurreição como vitória sobre a morte e o pecado',
        keyWords: ['ressurreição', 'vitória', 'vida nova', 'aleluia'],
        biblicalReferences: ['Jo 20,1-9', 'At 10,40', 'Cl 3,1-4']
      },
      introduction: 'Irmãos e irmãs, hoje é o dia mais importante do ano cristão! Cristo ressuscitou! A morte foi vencida, o pecado foi derrotado, a vida triunfou!',
      mainPoints: [
        'A ressurreição não é apenas um evento do passado, mas uma realidade presente',
        'Cristo ressuscitado nos oferece vida nova',
        'A ressurreição é a garantia da nossa própria ressurreição',
        'Somos chamados a viver como ressuscitados'
      ],
      conclusion: 'Que a alegria da Páscoa transforme nossa vida. Cristo ressuscitou e nós ressuscitamos com Ele!',
      practicalApplication: 'Como posso viver como pessoa ressuscitada? Abandonando o pecado e vivendo na graça.',
      prayerSuggestion: 'Senhor ressuscitado, renova nossa vida e enche-nos da alegria pascal.',
      duration: '10-12 minutos',
      targetAudience: 'general'
    }
  ]
};

// Comentários exegéticos por data
const exegeticalDatabase: Record<string, ExegeticalComment[]> = {
  '2024-12-25': [
    {
      reading: 'first',
      reference: 'Is 52,7-10',
      historicalContext: 'Escrito durante o exílio babilônico, anuncia a libertação de Israel',
      literaryGenre: 'Oráculo profético de salvação',
      keyMessage: 'Deus vem para salvar seu povo e toda a humanidade',
      theologicalInsight: 'A salvação de Deus tem dimensão universal - todos os confins da terra verão',
      pastoralApplication: 'Somos chamados a ser mensageiros da boa nova da salvação'
    },
    {
      reading: 'gospel',
      reference: 'Jo 1,1-18',
      historicalContext: 'Prólogo do Evangelho de João, escrito no final do século I',
      literaryGenre: 'Hino cristológico primitivo',
      keyMessage: 'O Verbo eterno se fez carne para revelar o Pai',
      theologicalInsight: 'A encarnação é o ápice da revelação divina',
      pastoralApplication: 'Cristo é a Palavra definitiva de Deus que devemos acolher e anunciar'
    }
  ]
};

// Orações litúrgicas por data
const prayersDatabase: Record<string, LiturgicalPrayers> = {
  '2024-12-25': {
    collectPrayer: 'Ó Deus, que de modo admirável criastes a natureza humana e de modo ainda mais admirável a renovastes, concedei-nos participar da divindade daquele que se dignou assumir a nossa humanidade, Jesus Cristo, vosso Filho.',
    prayerOfTheFaithful: [
      'Pela Igreja, para que anuncie com alegria o nascimento do Salvador',
      'Pelos governantes, para que promovam a paz e a justiça',
      'Pelas famílias, para que vivam o amor e a união',
      'Pelos pobres e necessitados, para que encontrem acolhida e solidariedade'
    ],
    offertoryPrayer: 'Recebei, ó Deus, os dons que vos oferecemos neste dia santo, e concedei que, participando deste sacramento, sejamos transformados naquele que assumiu nossa natureza humana.',
    communionPrayer: 'O Verbo se fez carne e habitou entre nós. A todos que o receberam, deu o poder de se tornarem filhos de Deus.',
    finalBlessing: 'Que o Deus da paz, que fez nascer dentre os mortos o grande Pastor das ovelhas, nosso Senhor Jesus, vos abençoe e vos guarde.'
  }
};

// Função principal para obter recursos pastorais
export async function getPastoralResources(date: Date, readings: DailyReadings): Promise<PastoralResources> {
  const dateKey = date.toISOString().split('T')[0];
  
  return {
    date: dateKey,
    readings,
    homilySuggestions: getHomilySuggestions(dateKey, readings),
    exegeticalComments: getExegeticalComments(dateKey, readings),
    prayers: getLiturgicalPrayers(dateKey, readings),
    musicSuggestions: getMusicSuggestions(dateKey, readings),
    decorationIdeas: getDecorationIdeas(dateKey, readings),
    catechesisPoints: getCatechesisPoints(dateKey, readings)
  };
}

// Função para obter sugestões de homilia
export function getHomilySuggestions(dateKey: string, readings: DailyReadings): HomilySuggestion[] {
  // Primeiro, verificar se há homilias específicas para a data
  if (homilyDatabase[dateKey]) {
    return homilyDatabase[dateKey];
  }
  
  // Gerar homilias baseadas nas leituras
  return generateHomilyFromReadings(dateKey, readings);
}

// Função para gerar homilia baseada nas leituras
function generateHomilyFromReadings(dateKey: string, readings: DailyReadings): HomilySuggestion[] {
  const gospel = readings.readings.find(r => r.type === 'gospel');
  const firstReading = readings.readings.find(r => r.type === 'first');
  
  if (!gospel) {
    return [];
  }
  
  // Análise básica do evangelho para gerar tema
  const themes = analyzeGospelThemes(gospel);
  
  return themes.map((theme, index) => ({
    id: `generated-${dateKey}-${index}`,
    date: dateKey,
    theme,
    introduction: `Irmãos e irmãs, o Evangelho de hoje nos convida a refletir sobre ${theme.title.toLowerCase()}.`,
    mainPoints: [
      `A Palavra de Deus nos ensina sobre ${theme.keyWords[0]}`,
      `Jesus nos mostra o caminho através de ${theme.keyWords[1] || 'seu exemplo'}`,
      `Somos chamados a viver esta mensagem em nossa vida diária`
    ],
    conclusion: `Que o Senhor nos ajude a colocar em prática os ensinamentos do Evangelho.`,
    practicalApplication: `Como posso aplicar esta mensagem em minha vida hoje?`,
    prayerSuggestion: `Senhor Jesus, ajuda-nos a viver segundo tua Palavra.`,
    duration: '5-7 minutos',
    targetAudience: 'general'
  }));
}

// Função para analisar temas do evangelho
function analyzeGospelThemes(gospel: LiturgicalReading): HomilyTheme[] {
  const text = gospel.text.toLowerCase();
  const themes: HomilyTheme[] = [];
  
  // Análise básica de palavras-chave
  if (text.includes('amor') || text.includes('amar')) {
    themes.push({
      id: 'love',
      title: 'O Amor de Deus',
      description: 'O chamado ao amor cristão',
      keyWords: ['amor', 'caridade', 'próximo'],
      biblicalReferences: [gospel.reference]
    });
  }
  
  if (text.includes('perdão') || text.includes('perdoar')) {
    themes.push({
      id: 'forgiveness',
      title: 'O Perdão',
      description: 'A misericórdia divina e o perdão',
      keyWords: ['perdão', 'misericórdia', 'reconciliação'],
      biblicalReferences: [gospel.reference]
    });
  }
  
  if (text.includes('paz')) {
    themes.push({
      id: 'peace',
      title: 'A Paz de Cristo',
      description: 'A paz que Cristo nos oferece',
      keyWords: ['paz', 'tranquilidade', 'serenidade'],
      biblicalReferences: [gospel.reference]
    });
  }
  
  // Tema padrão se nenhum específico for encontrado
  if (themes.length === 0) {
    themes.push({
      id: 'general',
      title: 'A Palavra de Deus',
      description: 'Reflexão sobre a Palavra de Deus',
      keyWords: ['palavra', 'ensinamento', 'vida cristã'],
      biblicalReferences: [gospel.reference]
    });
  }
  
  return themes;
}

// Função para obter comentários exegéticos
export function getExegeticalComments(dateKey: string, readings: DailyReadings): ExegeticalComment[] {
  if (exegeticalDatabase[dateKey]) {
    return exegeticalDatabase[dateKey];
  }
  
  // Gerar comentários básicos
  return readings.readings.map(reading => ({
    reading: reading.type,
    reference: reading.reference,
    historicalContext: 'Contexto histórico a ser pesquisado',
    literaryGenre: 'Gênero literário a ser determinado',
    keyMessage: 'Mensagem principal da leitura',
    theologicalInsight: 'Insight teológico da passagem',
    pastoralApplication: 'Aplicação pastoral para hoje'
  }));
}

// Função para obter orações litúrgicas
export function getLiturgicalPrayers(dateKey: string, readings: DailyReadings): LiturgicalPrayers {
  if (prayersDatabase[dateKey]) {
    return prayersDatabase[dateKey];
  }
  
  // Orações padrão
  return {
    collectPrayer: 'Ó Deus, que nos reunis para celebrar vossos mistérios, concedei-nos a graça de viver segundo vossa vontade.',
    prayerOfTheFaithful: [
      'Pela Igreja, para que seja fiel à sua missão',
      'Pelos governantes, para que promovam o bem comum',
      'Pelos necessitados, para que encontrem ajuda',
      'Por nossa comunidade, para que cresça na fé'
    ],
    offertoryPrayer: 'Recebei, Senhor, nossos dons e transformai-os em sacramento de salvação.',
    communionPrayer: 'Senhor, que este sacramento nos una a vós e nos torne instrumentos de vossa paz.',
    finalBlessing: 'Que Deus todo-poderoso vos abençoe: o Pai, o Filho e o Espírito Santo.'
  };
}

// Funções auxiliares
function getMusicSuggestions(dateKey: string, readings: DailyReadings): string[] {
  // Integrar com sistema de músicas existente
  return ['Sugestões de cantos baseadas no tempo litúrgico'];
}

function getDecorationIdeas(dateKey: string, readings: DailyReadings): string[] {
  const season = readings.season.toLowerCase();
  
  if (season.includes('natal')) {
    return ['Presépio', 'Luzes douradas', 'Flores brancas', 'Símbolos da natividade'];
  }
  
  if (season.includes('pascal')) {
    return ['Círio pascal', 'Flores brancas e amarelas', 'Símbolos da ressurreição', 'Água benta'];
  }
  
  return ['Decoração adequada ao tempo litúrgico', 'Cores litúrgicas apropriadas'];
}

function getCatechesisPoints(dateKey: string, readings: DailyReadings): string[] {
  return [
    'Pontos principais para catequese baseados nas leituras',
    'Ensinamentos fundamentais da fé católica',
    'Aplicação prática dos ensinamentos'
  ];
}
