import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Upload para Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// Endpoint para obter informações de upload
export async function GET() {
  return NextResponse.json({
    maxFileSize: '10MB',
    allowedTypes: [
      'application/pdf',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'image/jpeg',
      'image/png',
      'image/webp'
    ],
    storageProvider: 'vercel-blob'
  });
}
