// Sistema de Banco de Dados SQLite para Músicas Litúrgicas
import Database from 'better-sqlite3';
import path from 'path';

export interface MusicRecord {
  id: number;
  title: string;
  composer: string;
  category: 'Entrada' | 'Salmo' | 'Aclamação' | 'Ofertório' | 'Comunhão' | 'Final' | 'Adoração';
  liturgical_season: 'Tempo Comum' | 'Advento' | 'Natal' | 'Quaresma' | 'Páscoa' | 'Todos';
  musical_key: string; // Tom musical (C, D, E, F, G, A, B)
  tempo: 'Lento' | 'Moderado' | 'Rápido';
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  
  // Arquivos (URLs)
  audio_url?: string;
  sheet_url?: string; // Partitura PDF
  lyrics_url?: string; // Letra PDF/TXT
  chords_url?: string; // Cifras PDF/TXT
  
  // Metadados
  duration?: number; // Duração em segundos
  upload_date: string;
  uploaded_by: string;
  tags: string; // JSON array como string
  notes?: string;
  
  // Uso litúrgico (boolean flags)
  use_entrance: boolean;
  use_psalm: boolean;
  use_acclamation: boolean;
  use_offertory: boolean;
  use_communion: boolean;
  use_final: boolean;
  
  // Status
  status: 'active' | 'archived' | 'pending';
  verified: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface RepertoireRecord {
  id: number;
  name: string;
  date: string;
  liturgical_celebration: string;
  liturgical_season: string;
  
  // Músicas selecionadas (IDs)
  entrance_music_id?: number;
  psalm_music_id?: number;
  acclamation_music_id?: number;
  offertory_music_id?: number;
  communion_music_id?: number;
  final_music_id?: number;
  
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

class MusicDatabase {
  private db: Database.Database;
  
  constructor() {
    // Criar banco na pasta do projeto
    const dbPath = path.join(process.cwd(), 'data', 'liturgia.db');
    
    // Garantir que a pasta data existe
    const fs = require('fs');
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.db = new Database(dbPath);
    this.initializeTables();
    this.insertSampleData();
  }
  
  private initializeTables(): void {
    // Tabela de músicas
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS musics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        composer TEXT NOT NULL,
        category TEXT NOT NULL,
        liturgical_season TEXT NOT NULL,
        musical_key TEXT NOT NULL,
        tempo TEXT DEFAULT 'Moderado',
        difficulty TEXT DEFAULT 'Médio',
        
        audio_url TEXT,
        sheet_url TEXT,
        lyrics_url TEXT,
        chords_url TEXT,
        
        duration INTEGER,
        upload_date TEXT NOT NULL,
        uploaded_by TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        notes TEXT,
        
        use_entrance BOOLEAN DEFAULT 0,
        use_psalm BOOLEAN DEFAULT 0,
        use_acclamation BOOLEAN DEFAULT 0,
        use_offertory BOOLEAN DEFAULT 0,
        use_communion BOOLEAN DEFAULT 0,
        use_final BOOLEAN DEFAULT 0,
        
        status TEXT DEFAULT 'pending',
        verified BOOLEAN DEFAULT 0,
        
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Tabela de repertórios
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS repertoires (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        liturgical_celebration TEXT NOT NULL,
        liturgical_season TEXT NOT NULL,
        
        entrance_music_id INTEGER,
        psalm_music_id INTEGER,
        acclamation_music_id INTEGER,
        offertory_music_id INTEGER,
        communion_music_id INTEGER,
        final_music_id INTEGER,
        
        notes TEXT,
        created_by TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (entrance_music_id) REFERENCES musics(id),
        FOREIGN KEY (psalm_music_id) REFERENCES musics(id),
        FOREIGN KEY (acclamation_music_id) REFERENCES musics(id),
        FOREIGN KEY (offertory_music_id) REFERENCES musics(id),
        FOREIGN KEY (communion_music_id) REFERENCES musics(id),
        FOREIGN KEY (final_music_id) REFERENCES musics(id)
      )
    `);
    
    // Índices para performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_musics_category ON musics(category);
      CREATE INDEX IF NOT EXISTS idx_musics_season ON musics(liturgical_season);
      CREATE INDEX IF NOT EXISTS idx_musics_status ON musics(status);
      CREATE INDEX IF NOT EXISTS idx_repertoires_date ON repertoires(date);
    `);
    
    console.log('✅ Tabelas SQLite inicializadas');
  }
  
  // CRUD para Músicas
  addMusic(music: Omit<MusicRecord, 'id' | 'created_at' | 'updated_at'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO musics (
        title, composer, category, liturgical_season, musical_key, tempo, difficulty,
        audio_url, sheet_url, lyrics_url, chords_url,
        duration, upload_date, uploaded_by, tags, notes,
        use_entrance, use_psalm, use_acclamation, use_offertory, use_communion, use_final,
        status, verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      music.title, music.composer, music.category, music.liturgical_season, 
      music.musical_key, music.tempo, music.difficulty,
      music.audio_url, music.sheet_url, music.lyrics_url, music.chords_url,
      music.duration, music.upload_date, music.uploaded_by, music.tags, music.notes,
      music.use_entrance ? 1 : 0, music.use_psalm ? 1 : 0, music.use_acclamation ? 1 : 0,
      music.use_offertory ? 1 : 0, music.use_communion ? 1 : 0, music.use_final ? 1 : 0,
      music.status, music.verified ? 1 : 0
    );
    
    console.log(`🎵 Música "${music.title}" adicionada ao banco (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid as number;
  }
  
  getMusic(id: number): MusicRecord | null {
    const stmt = this.db.prepare('SELECT * FROM musics WHERE id = ?');
    return stmt.get(id) as MusicRecord || null;
  }
  
  getAllMusics(): MusicRecord[] {
    const stmt = this.db.prepare('SELECT * FROM musics WHERE status = "active" ORDER BY title');
    return stmt.all() as MusicRecord[];
  }
  
  getMusicsByCategory(category: string): MusicRecord[] {
    const stmt = this.db.prepare('SELECT * FROM musics WHERE category = ? AND status = "active" ORDER BY title');
    return stmt.all(category) as MusicRecord[];
  }
  
  getMusicsBySeason(season: string): MusicRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM musics 
      WHERE (liturgical_season = ? OR liturgical_season = 'Todos') 
      AND status = 'active' 
      ORDER BY title
    `);
    return stmt.all(season) as MusicRecord[];
  }
  
  searchMusics(query: string): MusicRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM musics 
      WHERE (title LIKE ? OR composer LIKE ? OR tags LIKE ?) 
      AND status = 'active' 
      ORDER BY title
    `);
    const searchTerm = `%${query}%`;
    return stmt.all(searchTerm, searchTerm, searchTerm) as MusicRecord[];
  }
  
  updateMusic(id: number, updates: Partial<MusicRecord>): boolean {
    const fields = Object.keys(updates).filter(key => key !== 'id').map(key => `${key} = ?`);
    const values = Object.keys(updates).filter(key => key !== 'id').map(key => (updates as any)[key]);
    
    if (fields.length === 0) return false;
    
    const stmt = this.db.prepare(`
      UPDATE musics 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    const result = stmt.run(...values, id);
    return result.changes > 0;
  }
  
  deleteMusic(id: number): boolean {
    const stmt = this.db.prepare('UPDATE musics SET status = "archived" WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
  
  // CRUD para Repertórios
  addRepertoire(repertoire: Omit<RepertoireRecord, 'id' | 'created_at' | 'updated_at'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO repertoires (
        name, date, liturgical_celebration, liturgical_season,
        entrance_music_id, psalm_music_id, acclamation_music_id,
        offertory_music_id, communion_music_id, final_music_id,
        notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      repertoire.name, repertoire.date, repertoire.liturgical_celebration, repertoire.liturgical_season,
      repertoire.entrance_music_id, repertoire.psalm_music_id, repertoire.acclamation_music_id,
      repertoire.offertory_music_id, repertoire.communion_music_id, repertoire.final_music_id,
      repertoire.notes, repertoire.created_by
    );
    
    console.log(`📋 Repertório "${repertoire.name}" criado (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid as number;
  }
  
  getAllRepertoires(): RepertoireRecord[] {
    const stmt = this.db.prepare('SELECT * FROM repertoires ORDER BY date DESC');
    return stmt.all() as RepertoireRecord[];
  }
  
  getRepertoireWithMusics(id: number): any {
    const repertoire = this.db.prepare('SELECT * FROM repertoires WHERE id = ?').get(id) as RepertoireRecord;
    if (!repertoire) return null;
    
    const getMusic = (musicId: number | null) => musicId ? this.getMusic(musicId) : null;
    
    return {
      ...repertoire,
      entrance_music: getMusic(repertoire.entrance_music_id || 0),
      psalm_music: getMusic(repertoire.psalm_music_id || 0),
      acclamation_music: getMusic(repertoire.acclamation_music_id || 0),
      offertory_music: getMusic(repertoire.offertory_music_id || 0),
      communion_music: getMusic(repertoire.communion_music_id || 0),
      final_music: getMusic(repertoire.final_music_id || 0)
    };
  }
  
  // Sugestões inteligentes para missa
  getSuggestionsForMass(liturgicalSeason: string): {
    entrance: MusicRecord[];
    psalm: MusicRecord[];
    acclamation: MusicRecord[];
    offertory: MusicRecord[];
    communion: MusicRecord[];
    final: MusicRecord[];
  } {
    const getByUse = (useField: string) => {
      const stmt = this.db.prepare(`
        SELECT * FROM musics 
        WHERE ${useField} = 1 
        AND (liturgical_season = ? OR liturgical_season = 'Todos')
        AND status = 'active'
        ORDER BY title
        LIMIT 5
      `);
      return stmt.all(liturgicalSeason) as MusicRecord[];
    };
    
    return {
      entrance: getByUse('use_entrance'),
      psalm: getByUse('use_psalm'),
      acclamation: getByUse('use_acclamation'),
      offertory: getByUse('use_offertory'),
      communion: getByUse('use_communion'),
      final: getByUse('use_final')
    };
  }
  
  private insertSampleData(): void {
    // Verificar se já há dados
    const count = this.db.prepare('SELECT COUNT(*) as count FROM musics').get() as { count: number };
    if (count.count > 0) return;
    
    console.log('📝 Inserindo dados de exemplo...');
    
    // Dados de exemplo
    const sampleMusics = [
      {
        title: 'Vem, Espírito Santo',
        composer: 'Pe. José Weber',
        category: 'Entrada' as const,
        liturgical_season: 'Todos' as const,
        musical_key: 'G',
        tempo: 'Moderado' as const,
        difficulty: 'Médio' as const,
        audio_url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
        upload_date: new Date().toISOString(),
        uploaded_by: 'Sistema',
        tags: JSON.stringify(['espírito santo', 'pentecostes', 'entrada']),
        use_entrance: true,
        use_psalm: false,
        use_acclamation: false,
        use_offertory: false,
        use_communion: false,
        use_final: false,
        status: 'active' as const,
        verified: true
      },
      {
        title: 'Salmo 33 - Provai e Vede',
        composer: 'Ir. Miria Kolling',
        category: 'Salmo' as const,
        liturgical_season: 'Todos' as const,
        musical_key: 'C',
        tempo: 'Lento' as const,
        difficulty: 'Fácil' as const,
        audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
        upload_date: new Date().toISOString(),
        uploaded_by: 'Sistema',
        tags: JSON.stringify(['salmo', 'responsorial', 'provai']),
        use_entrance: false,
        use_psalm: true,
        use_acclamation: false,
        use_offertory: false,
        use_communion: false,
        use_final: false,
        status: 'active' as const,
        verified: true
      }
    ];
    
    sampleMusics.forEach(music => this.addMusic(music));
  }
  
  close(): void {
    this.db.close();
  }
}

// Instância singleton
let dbInstance: MusicDatabase | null = null;

export function getDatabase(): MusicDatabase {
  if (!dbInstance) {
    dbInstance = new MusicDatabase();
  }
  return dbInstance;
}

// Funções de conveniência
export async function addMusicToDatabase(musicData: {
  title: string;
  composer: string;
  category: MusicRecord['category'];
  liturgicalSeason: MusicRecord['liturgical_season'];
  key: string;
  audioUrl?: string;
  sheetUrl?: string;
  lyricsUrl?: string;
  chordsUrl?: string;
  tags?: string[];
  notes?: string;
  liturgicalUse?: {
    entrance?: boolean;
    psalm?: boolean;
    acclamation?: boolean;
    offertory?: boolean;
    communion?: boolean;
    final?: boolean;
  };
}): Promise<number> {
  const db = getDatabase();
  
  const music: Omit<MusicRecord, 'id' | 'created_at' | 'updated_at'> = {
    title: musicData.title,
    composer: musicData.composer,
    category: musicData.category,
    liturgical_season: musicData.liturgicalSeason,
    musical_key: musicData.key,
    tempo: 'Moderado',
    difficulty: 'Médio',
    audio_url: musicData.audioUrl,
    sheet_url: musicData.sheetUrl,
    lyrics_url: musicData.lyricsUrl,
    chords_url: musicData.chordsUrl,
    upload_date: new Date().toISOString(),
    uploaded_by: 'Usuário', // Em produção, pegar do contexto de auth
    tags: JSON.stringify(musicData.tags || []),
    notes: musicData.notes,
    use_entrance: musicData.liturgicalUse?.entrance || false,
    use_psalm: musicData.liturgicalUse?.psalm || false,
    use_acclamation: musicData.liturgicalUse?.acclamation || false,
    use_offertory: musicData.liturgicalUse?.offertory || false,
    use_communion: musicData.liturgicalUse?.communion || false,
    use_final: musicData.liturgicalUse?.final || false,
    status: 'active',
    verified: false
  };
  
  return db.addMusic(music);
}
