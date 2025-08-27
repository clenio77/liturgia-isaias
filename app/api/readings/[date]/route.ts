import { NextRequest, NextResponse } from 'next/server';
import { getDailyReadings } from '@/lib/liturgical-readings';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params;
    
    // Validar formato da data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const requestedDate = new Date(date);
    
    // Verificar se a data é válida
    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json(
        { error: 'Data inválida' },
        { status: 400 }
      );
    }

    console.log(`📖 API: Buscando leituras para ${date}`);

    const readings = await getDailyReadings(requestedDate);

    if (!readings) {
      console.log(`❌ API: Leituras não encontradas para ${date}`);
      return NextResponse.json(
        {
          error: 'Leituras não encontradas para esta data',
          date: date,
          message: 'Tente novamente ou consulte fontes oficiais como CNBB'
        },
        { status: 404 }
      );
    }

    console.log(`✅ API: Retornando ${readings.readings.length} leituras para ${date}`);

    // Adicionar headers de cache
    const response = NextResponse.json(readings);
    response.headers.set('Cache-Control', 'public, max-age=1800'); // Cache por 30 minutos
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    return response;

  } catch (error) {
    console.error('Erro na API de leituras:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// Endpoint para buscar leituras de hoje
export async function POST(request: NextRequest) {
  try {
    const today = new Date();
    const readings = await getDailyReadings(today);
    
    if (!readings) {
      return NextResponse.json(
        { error: 'Leituras de hoje não encontradas' },
        { status: 404 }
      );
    }

    return NextResponse.json(readings);

  } catch (error) {
    console.error('Erro ao buscar leituras de hoje:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
