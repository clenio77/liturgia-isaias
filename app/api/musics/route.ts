import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, addMusicToDatabase } from '@/lib/database';

// GET - Listar todas as músicas ou buscar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const season = searchParams.get('season');
    
    const db = getDatabase();
    let musics;
    
    if (query) {
      musics = db.searchMusics(query);
    } else if (category) {
      musics = db.getMusicsByCategory(category);
    } else if (season) {
      musics = db.getMusicsBySeason(season);
    } else {
      musics = db.getAllMusics();
    }
    
    // Converter tags de string JSON para array
    const processedMusics = musics.map(music => ({
      ...music,
      tags: JSON.parse(music.tags || '[]')
    }));
    
    return NextResponse.json({
      success: true,
      musics: processedMusics,
      count: processedMusics.length
    });
    
  } catch (error) {
    console.error('Erro ao buscar músicas:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Adicionar nova música
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados obrigatórios
    const { title, composer, category, liturgicalSeason, key } = body;
    
    if (!title || !composer || !category || !liturgicalSeason || !key) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }
    
    // Adicionar música ao banco
    const musicId = await addMusicToDatabase({
      title,
      composer,
      category,
      liturgicalSeason,
      key,
      audioUrl: body.audioUrl,
      sheetUrl: body.sheetUrl,
      lyricsUrl: body.lyricsUrl,
      chordsUrl: body.chordsUrl,
      tags: body.tags || [],
      notes: body.notes,
      liturgicalUse: body.liturgicalUse || {}
    });
    
    return NextResponse.json({
      success: true,
      musicId,
      message: 'Música adicionada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao adicionar música:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
