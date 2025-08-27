// Sistema de Upload e Armazenamento de Arquivos
// Suporte para múltiplos provedores de storage

export interface UploadConfig {
  maxFileSize: number; // em bytes
  allowedTypes: string[];
  storageProvider: 'local' | 'cloudinary' | 'aws' | 'vercel';
}

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
  metadata?: {
    size: number;
    type: string;
    duration?: number; // para áudios
    pages?: number; // para PDFs
  };
}

const defaultConfig: UploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'image/jpeg',
    'image/png',
    'image/webp'
  ],
  storageProvider: 'local'
};

// Validação de arquivo
export function validateFile(file: File, config: UploadConfig = defaultConfig): { valid: boolean; error?: string } {
  if (file.size > config.maxFileSize) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo permitido: ${(config.maxFileSize / 1024 / 1024).toFixed(1)}MB`
    };
  }

  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Tipos aceitos: ${config.allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
}

// Função principal de upload
export async function uploadFile(file: File, config: UploadConfig = defaultConfig): Promise<UploadResult> {
  // Validar arquivo
  const validation = validateFile(file, config);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error
    };
  }

  try {
    switch (config.storageProvider) {
      case 'cloudinary':
        return await uploadToCloudinary(file);
      case 'aws':
        return await uploadToAWS(file);
      case 'vercel':
        return await uploadToVercel(file);
      default:
        return await uploadToLocal(file);
    }
  } catch (error) {
    return {
      success: false,
      error: `Erro no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}

// Upload local (para desenvolvimento)
async function uploadToLocal(file: File): Promise<UploadResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Simular upload local
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const url = `/uploads/${filename}`;
      
      // Em produção, você salvaria o arquivo no servidor
      console.log('Upload local simulado:', {
        filename,
        size: file.size,
        type: file.type
      });
      
      resolve({
        success: true,
        url,
        metadata: {
          size: file.size,
          type: file.type
        }
      });
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Erro ao ler o arquivo'
      });
    };
    
    reader.readAsDataURL(file);
  });
}

// Upload para Cloudinary (recomendado para produção)
async function uploadToCloudinary(file: File): Promise<UploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName || !uploadPreset) {
    return {
      success: false,
      error: 'Configuração do Cloudinary não encontrada'
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'liturgia-isaias');

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      metadata: {
        size: data.bytes,
        type: data.resource_type,
        duration: data.duration,
        pages: data.pages
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro no Cloudinary: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}

// Upload para AWS S3
async function uploadToAWS(file: File): Promise<UploadResult> {
  // Implementação do AWS S3
  // Requer configuração de credenciais AWS
  return {
    success: false,
    error: 'Upload AWS não implementado ainda'
  };
}

// Upload para Vercel Blob
async function uploadToVercel(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      body: file,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      url: data.url,
      publicId: data.pathname,
      metadata: {
        size: file.size,
        type: file.type
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro no Vercel: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}

// Função para extrair metadados de áudio
export async function extractAudioMetadata(file: File): Promise<{
  duration?: number;
  title?: string;
  artist?: string;
  album?: string;
}> {
  return new Promise((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    audio.onloadedmetadata = () => {
      resolve({
        duration: audio.duration
      });
      URL.revokeObjectURL(url);
    };
    
    audio.onerror = () => {
      resolve({});
      URL.revokeObjectURL(url);
    };
    
    audio.src = url;
  });
}

// Função para extrair metadados de PDF
export async function extractPDFMetadata(file: File): Promise<{
  pages?: number;
  title?: string;
  author?: string;
}> {
  // Para extrair metadados de PDF, você precisaria de uma biblioteca como pdf-lib
  // Por enquanto, retornamos dados básicos
  return new Promise((resolve) => {
    resolve({
      pages: 1 // Placeholder
    });
  });
}

// Função para gerar thumbnail de imagem
export async function generateImageThumbnail(file: File, maxWidth: number = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = () => reject(new Error('Erro ao gerar thumbnail'));
    img.src = URL.createObjectURL(file);
  });
}
