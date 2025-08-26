// Sistema de Fontes de Áudio para Músicas Litúrgicas
// Integra múltiplas plataformas e fontes

import { AudioSource } from '@/components/audio/AudioPlayer';

export interface MusicAudioSources {
  musicId: string;
  title: string;
  artist: string;
  sources: AudioSource[];
  preview?: string; // URL para preview de 30s
  thumbnail?: string;
}

// Base de dados de fontes de áudio para músicas litúrgicas
export const musicAudioDatabase: MusicAudioSources[] = [
  // Músicas de Entrada
  {
    musicId: '1',
    title: 'Vem, Espírito Santo',
    artist: 'Pe. José Weber',
    sources: [
      {
        type: 'local',
        url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3', // Áudio de exemplo funcional
        title: 'Vem, Espírito Santo - Pe. José Weber',
        duration: 225
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Vem, Espírito Santo - Pe. José Weber',
        duration: 225
      }
    ],
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: '/images/music/vem-espirito-santo.jpg'
  },
  
  {
    musicId: '2',
    title: 'Cristo Ressuscitou',
    artist: 'Tradicional',
    sources: [
      {
        type: 'local',
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Áudio de exemplo funcional
        title: 'Cristo Ressuscitou - Canto Tradicional',
        duration: 180
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=exemplo-cristo-ressuscitou',
        title: 'Cristo Ressuscitou - Canto Tradicional',
        duration: 180
      }
    ],
    preview: 'https://www.soundjay.com/misc/sounds/church-bells-1.wav'
  },

  {
    musicId: '3',
    title: 'Preparai os Caminhos',
    artist: 'Pe. Antônio Maria',
    sources: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=exemplo-preparai-caminhos',
        title: 'Preparai os Caminhos - Pe. Antônio Maria',
        duration: 200
      },
      {
        type: 'spotify',
        url: 'https://open.spotify.com/track/exemplo-preparai',
        duration: 200
      }
    ]
  },

  // Salmos
  {
    musicId: '4',
    title: 'Salmo 33 - Provai e Vede',
    artist: 'Ir. Miria Kolling',
    sources: [
      {
        type: 'local',
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav', // Áudio de exemplo funcional
        title: 'Salmo 33 - Provai e Vede',
        duration: 150
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=exemplo-salmo-33',
        title: 'Salmo 33 - Provai e Vede',
        duration: 150
      }
    ]
  },

  {
    musicId: '5',
    title: 'Salmo 117 - Este é o Dia',
    artist: 'Tradicional',
    sources: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=exemplo-salmo-117',
        title: 'Salmo 117 - Este é o Dia que o Senhor Fez',
        duration: 120
      }
    ]
  },

  // Ofertório
  {
    musicId: '6',
    title: 'Recebe, ó Deus',
    artist: 'Pe. José Weber',
    sources: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=exemplo-recebe-deus',
        title: 'Recebe, ó Deus - Pe. José Weber',
        duration: 240
      },
      {
        type: 'local',
        url: '/audio/recebe-o-deus.mp3',
        duration: 240
      }
    ]
  },

  // Comunhão
  {
    musicId: '7',
    title: 'Pão da Vida',
    artist: 'Ir. Miria Kolling',
    sources: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=exemplo-pao-vida',
        title: 'Pão da Vida - Ir. Miria Kolling',
        duration: 210
      },
      {
        type: 'spotify',
        url: 'https://open.spotify.com/track/exemplo-pao-vida',
        duration: 210
      }
    ]
  },

  {
    musicId: '8',
    title: 'Jesus, Pão dos Pobres',
    artist: 'Pe. Antônio Maria',
    sources: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=exemplo-pao-pobres',
        title: 'Jesus, Pão dos Pobres',
        duration: 195
      }
    ]
  },

  // Final
  {
    musicId: '9',
    title: 'Ide em Paz',
    artist: 'Tradicional',
    sources: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=exemplo-ide-paz',
        title: 'Ide em Paz - Canto de Envio',
        duration: 160
      },
      {
        type: 'local',
        url: '/audio/ide-em-paz.mp3',
        duration: 160
      }
    ]
  },

  {
    musicId: '10',
    title: 'Aleluia da Ressurreição',
    artist: 'Pe. José Weber',
    sources: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=exemplo-aleluia-ressurreicao',
        title: 'Aleluia da Ressurreição - Pe. José Weber',
        duration: 180
      }
    ]
  }
];

// Função para buscar fontes de áudio por ID da música
export function getAudioSources(musicId: string): MusicAudioSources | null {
  return musicAudioDatabase.find(music => music.musicId === musicId) || null;
}

// Função para buscar fontes de áudio por título
export function getAudioSourcesByTitle(title: string): MusicAudioSources | null {
  return musicAudioDatabase.find(music => 
    music.title.toLowerCase().includes(title.toLowerCase())
  ) || null;
}

// Função para gerar fontes de áudio automáticas baseadas no título
export function generateAudioSources(title: string, artist?: string): AudioSource[] {
  const sources: AudioSource[] = [];
  
  // Gerar URL do YouTube baseada no título e artista
  const searchQuery = encodeURIComponent(`${title} ${artist || ''} católica litúrgica`);
  sources.push({
    type: 'youtube',
    url: `https://www.youtube.com/results?search_query=${searchQuery}`,
    title: `${title} - Busca no YouTube`
  });

  // Gerar URL do Spotify se disponível
  const spotifyQuery = encodeURIComponent(`${title} ${artist || ''}`);
  sources.push({
    type: 'spotify',
    url: `https://open.spotify.com/search/${spotifyQuery}`,
    title: `${title} - Busca no Spotify`
  });

  return sources;
}

// Função para criar preview de áudio (simulado)
export function createAudioPreview(originalUrl: string): string {
  // Em produção, isso geraria um preview real de 30s
  // Por enquanto, retorna a URL original
  return originalUrl;
}

// Função para validar se uma fonte de áudio está disponível
export async function validateAudioSource(source: AudioSource): Promise<boolean> {
  try {
    if (source.type === 'local') {
      // Verificar se arquivo local existe
      const response = await fetch(source.url, { method: 'HEAD' });
      return response.ok;
    }
    
    if (source.type === 'youtube') {
      // Para YouTube, assumimos que está disponível
      // Em produção, você usaria a API do YouTube
      return true;
    }
    
    if (source.type === 'spotify') {
      // Para Spotify, assumimos que está disponível
      // Em produção, você usaria a API do Spotify
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao validar fonte de áudio:', error);
    return false;
  }
}

// Função para obter estatísticas de áudio
export function getAudioStats(): {
  totalSources: number;
  sourcesByType: Record<string, number>;
  averageDuration: number;
} {
  const totalSources = musicAudioDatabase.length;
  const sourcesByType: Record<string, number> = {};
  let totalDuration = 0;
  let durationCount = 0;

  musicAudioDatabase.forEach(music => {
    music.sources.forEach(source => {
      sourcesByType[source.type] = (sourcesByType[source.type] || 0) + 1;
      if (source.duration) {
        totalDuration += source.duration;
        durationCount++;
      }
    });
  });

  return {
    totalSources,
    sourcesByType,
    averageDuration: durationCount > 0 ? totalDuration / durationCount : 0
  };
}

// Função para buscar músicas similares
export function findSimilarMusic(musicId: string): MusicAudioSources[] {
  const currentMusic = getAudioSources(musicId);
  if (!currentMusic) return [];

  // Buscar músicas do mesmo artista ou com títulos similares
  return musicAudioDatabase
    .filter(music => 
      music.musicId !== musicId && 
      (music.artist === currentMusic.artist || 
       music.title.includes(currentMusic.title.split(' ')[0]))
    )
    .slice(0, 3);
}
