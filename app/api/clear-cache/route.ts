// API para limpar cache de leituras - DEBUG
import { NextRequest, NextResponse } from 'next/server';
import { clearReadingsCache } from '@/lib/readings-scraper';

export async function POST(request: NextRequest) {
  try {
    // Limpar cache
    clearReadingsCache();
    
    console.log('🧹 Cache limpo via API');
    
    return NextResponse.json({
      success: true,
      message: 'Cache de leituras limpo com sucesso',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro ao limpar cache:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao limpar cache',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Use POST para limpar o cache de leituras',
    endpoint: '/api/clear-cache',
    method: 'POST'
  });
}
