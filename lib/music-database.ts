// Sistema de Banco de Dados de Músicas Litúrgicas
// Gerencia músicas uploadadas e catalogação

export interface MusicFile {
  id: string;
  title: string;
  composer: string;
  category: 'Entrada' | 'Salmo' | 'Aclamação' | 'Ofertório' | 'Comunhão' | 'Final' | 'Adoração';
  liturgicalSeason: 'Tempo Comum' | 'Advento' | 'Natal' | 'Quaresma' | 'Páscoa' | 'Todos';
  key: string; // Tom musical (C, D, E, F, G, A, B)
  tempo: 'Lento' | 'Moderado' | 'Rápido';
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  
  // Arquivos
  files: {
    audio?: string; // URL do áudio
    sheet?: string; // URL da partitura (PDF)
    lyrics?: string; // URL da letra (PDF/TXT)
    chords?: string; // URL das cifras (PDF/TXT)
  };
  
  // Metadados
  duration?: number; // Duração em segundos
  uploadDate: string;
  uploadedBy: string;
  tags: string[];
  notes?: string;
  
  // Uso litúrgico
  liturgicalUse: {
    entrance: boolean;
    psalm: boolean;
    acclamation: boolean;
    offertory: boolean;
    communion: boolean;
    final: boolean;
  };
  
  // Status
  status: 'active' | 'archived' | 'pending';
  verified: boolean;
}

export interface MusicCollection {
  id: string;
  name: string;
  description: string;
  musicIds: string[];
  createdDate: string;
  createdBy: string;
}

// Simulação de banco de dados (em produção seria um banco real)
class MusicDatabase {
  private musics: Map<string, MusicFile> = new Map();
  private collections: Map<string, MusicCollection> = new Map();
  
  constructor() {
    this.initializeWithSampleData();
  }
  
  // Adicionar música ao banco
  async addMusic(music: Omit<MusicFile, 'id' | 'uploadDate'>): Promise<string> {
    const id = this.generateId();
    const newMusic: MusicFile = {
      ...music,
      id,
      uploadDate: new Date().toISOString(),
      status: 'pending',
      verified: false
    };
    
    this.musics.set(id, newMusic);
    console.log('🎵 Música adicionada ao banco:', newMusic.title);
    
    // Salvar no localStorage para persistência
    this.saveToStorage();
    
    return id;
  }
  
  // Buscar música por ID
  getMusic(id: string): MusicFile | null {
    return this.musics.get(id) || null;
  }
  
  // Listar todas as músicas
  getAllMusics(): MusicFile[] {
    return Array.from(this.musics.values());
  }
  
  // Buscar músicas por categoria
  getMusicsByCategory(category: MusicFile['category']): MusicFile[] {
    return this.getAllMusics().filter(music => music.category === category);
  }
  
  // Buscar músicas por tempo litúrgico
  getMusicsBySeason(season: MusicFile['liturgicalSeason']): MusicFile[] {
    return this.getAllMusics().filter(music => 
      music.liturgicalSeason === season || music.liturgicalSeason === 'Todos'
    );
  }
  
  // Buscar músicas por uso litúrgico
  getMusicsByLiturgicalUse(use: keyof MusicFile['liturgicalUse']): MusicFile[] {
    return this.getAllMusics().filter(music => music.liturgicalUse[use]);
  }
  
  // Buscar músicas (texto livre)
  searchMusics(query: string): MusicFile[] {
    const searchTerm = query.toLowerCase();
    return this.getAllMusics().filter(music =>
      music.title.toLowerCase().includes(searchTerm) ||
      music.composer.toLowerCase().includes(searchTerm) ||
      music.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  // Atualizar música
  async updateMusic(id: string, updates: Partial<MusicFile>): Promise<boolean> {
    const music = this.musics.get(id);
    if (!music) return false;
    
    const updatedMusic = { ...music, ...updates };
    this.musics.set(id, updatedMusic);
    this.saveToStorage();
    
    console.log('🎵 Música atualizada:', updatedMusic.title);
    return true;
  }
  
  // Deletar música
  async deleteMusic(id: string): Promise<boolean> {
    const deleted = this.musics.delete(id);
    if (deleted) {
      this.saveToStorage();
      console.log('🗑️ Música deletada:', id);
    }
    return deleted;
  }
  
  // Criar coleção
  async createCollection(collection: Omit<MusicCollection, 'id' | 'createdDate'>): Promise<string> {
    const id = this.generateId();
    const newCollection: MusicCollection = {
      ...collection,
      id,
      createdDate: new Date().toISOString()
    };
    
    this.collections.set(id, newCollection);
    this.saveToStorage();
    
    return id;
  }
  
  // Listar coleções
  getAllCollections(): MusicCollection[] {
    return Array.from(this.collections.values());
  }
  
  // Obter músicas de uma coleção
  getCollectionMusics(collectionId: string): MusicFile[] {
    const collection = this.collections.get(collectionId);
    if (!collection) return [];
    
    return collection.musicIds
      .map(id => this.getMusic(id))
      .filter(music => music !== null) as MusicFile[];
  }
  
  // Gerar sugestões para missa
  getSuggestionsForMass(date: Date, liturgicalSeason: string): {
    entrance: MusicFile[];
    psalm: MusicFile[];
    acclamation: MusicFile[];
    offertory: MusicFile[];
    communion: MusicFile[];
    final: MusicFile[];
  } {
    const seasonMusics = this.getMusicsBySeason(liturgicalSeason as any);
    
    return {
      entrance: seasonMusics.filter(m => m.liturgicalUse.entrance).slice(0, 3),
      psalm: seasonMusics.filter(m => m.liturgicalUse.psalm).slice(0, 3),
      acclamation: seasonMusics.filter(m => m.liturgicalUse.acclamation).slice(0, 3),
      offertory: seasonMusics.filter(m => m.liturgicalUse.offertory).slice(0, 3),
      communion: seasonMusics.filter(m => m.liturgicalUse.communion).slice(0, 3),
      final: seasonMusics.filter(m => m.liturgicalUse.final).slice(0, 3)
    };
  }
  
  // Funções privadas
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('liturgia-musics', JSON.stringify(Array.from(this.musics.entries())));
      localStorage.setItem('liturgia-collections', JSON.stringify(Array.from(this.collections.entries())));
    }
  }
  
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const musicsData = localStorage.getItem('liturgia-musics');
      const collectionsData = localStorage.getItem('liturgia-collections');
      
      if (musicsData) {
        this.musics = new Map(JSON.parse(musicsData));
      }
      
      if (collectionsData) {
        this.collections = new Map(JSON.parse(collectionsData));
      }
    }
  }
  
  private initializeWithSampleData(): void {
    // Carregar dados do localStorage primeiro
    this.loadFromStorage();
    
    // Se não há dados, criar dados de exemplo
    if (this.musics.size === 0) {
      const sampleMusics: Omit<MusicFile, 'id' | 'uploadDate'>[] = [
        {
          title: 'Vem, Espírito Santo',
          composer: 'Pe. José Weber',
          category: 'Entrada',
          liturgicalSeason: 'Todos',
          key: 'G',
          tempo: 'Moderado',
          difficulty: 'Médio',
          files: {
            audio: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
          },
          uploadedBy: 'Sistema',
          tags: ['espírito santo', 'pentecostes', 'entrada'],
          liturgicalUse: {
            entrance: true,
            psalm: false,
            acclamation: false,
            offertory: false,
            communion: false,
            final: false
          },
          status: 'active',
          verified: true
        },
        {
          title: 'Salmo 33 - Provai e Vede',
          composer: 'Ir. Miria Kolling',
          category: 'Salmo',
          liturgicalSeason: 'Todos',
          key: 'C',
          tempo: 'Lento',
          difficulty: 'Fácil',
          files: {
            audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav'
          },
          uploadedBy: 'Sistema',
          tags: ['salmo', 'responsorial', 'provai'],
          liturgicalUse: {
            entrance: false,
            psalm: true,
            acclamation: false,
            offertory: false,
            communion: false,
            final: false
          },
          status: 'active',
          verified: true
        },
        {
          title: 'Preparai os Caminhos',
          composer: 'Pe. Antônio Maria',
          category: 'Entrada',
          liturgicalSeason: 'Advento',
          key: 'D',
          tempo: 'Moderado',
          difficulty: 'Médio',
          files: {},
          uploadedBy: 'Sistema',
          tags: ['advento', 'preparação', 'entrada'],
          liturgicalUse: {
            entrance: true,
            psalm: false,
            acclamation: false,
            offertory: false,
            communion: false,
            final: false
          },
          status: 'active',
          verified: true
        }
      ];
      
      // Adicionar músicas de exemplo
      sampleMusics.forEach(music => {
        this.addMusic(music);
      });
    }
  }
}

// Instância singleton do banco de dados
export const musicDatabase = new MusicDatabase();

// Funções de conveniência para uso nos componentes
export async function addMusicToDatabase(musicData: {
  title: string;
  composer: string;
  category: MusicFile['category'];
  liturgicalSeason: MusicFile['liturgicalSeason'];
  key: string;
  files: MusicFile['files'];
  tags?: string[];
  notes?: string;
  liturgicalUse?: Partial<MusicFile['liturgicalUse']>;
}): Promise<string> {
  const music: Omit<MusicFile, 'id' | 'uploadDate'> = {
    ...musicData,
    tempo: 'Moderado',
    difficulty: 'Médio',
    uploadedBy: 'Usuário', // Em produção, pegar do contexto de autenticação
    tags: musicData.tags || [],
    liturgicalUse: {
      entrance: false,
      psalm: false,
      acclamation: false,
      offertory: false,
      communion: false,
      final: false,
      ...musicData.liturgicalUse
    },
    status: 'pending',
    verified: false
  };
  
  return await musicDatabase.addMusic(music);
}

export function getAllMusicsFromDatabase(): MusicFile[] {
  return musicDatabase.getAllMusics();
}

export function searchMusicsInDatabase(query: string): MusicFile[] {
  return musicDatabase.searchMusics(query);
}

export function getMusicSuggestionsForMass(date: Date, liturgicalSeason: string) {
  return musicDatabase.getSuggestionsForMass(date, liturgicalSeason);
}
