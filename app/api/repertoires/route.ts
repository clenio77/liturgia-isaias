import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

// GET - Listar todos os repertórios
export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const repertoires = db.getAllRepertoires();
    
    return NextResponse.json({
      success: true,
      repertoires,
      count: repertoires.length
    });
    
  } catch (error) {
    console.error('Erro ao buscar repertórios:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo repertório
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados obrigatórios
    const { name, date, liturgicalCelebration, liturgicalSeason } = body;
    
    if (!name || !date || !liturgicalCelebration || !liturgicalSeason) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }
    
    const db = getDatabase();
    
    const repertoireId = db.addRepertoire({
      name,
      date,
      liturgical_celebration: liturgicalCelebration,
      liturgical_season: liturgicalSeason,
      entrance_music_id: body.entranceMusicId,
      psalm_music_id: body.psalmMusicId,
      acclamation_music_id: body.acclamationMusicId,
      offertory_music_id: body.offertoryMusicId,
      communion_music_id: body.communionMusicId,
      final_music_id: body.finalMusicId,
      notes: body.notes,
      created_by: 'Usuário' // Em produção, pegar do contexto de auth
    });
    
    return NextResponse.json({
      success: true,
      repertoireId,
      message: 'Repertório criado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao criar repertório:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
