import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

// GET - Obter sugestões de músicas para missa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const liturgicalSeason = searchParams.get('season') || 'Tempo Comum';
    
    const db = getDatabase();
    const suggestions = db.getSuggestionsForMass(liturgicalSeason);
    
    // Processar tags JSON
    const processedSuggestions = Object.fromEntries(
      Object.entries(suggestions).map(([key, musics]) => [
        key,
        musics.map(music => ({
          ...music,
          tags: JSON.parse(music.tags || '[]')
        }))
      ])
    );
    
    return NextResponse.json({
      success: true,
      liturgicalSeason,
      suggestions: processedSuggestions
    });
    
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
