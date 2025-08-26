# Arquivos de Áudio - Sistema Litúrgico

Esta pasta contém os arquivos de áudio das músicas litúrgicas.

## Estrutura de Pastas

```
/public/audio/
├── README.md
├── vem-espirito-santo.mp3
├── cristo-ressuscitou.mp3
├── preparai-os-caminhos.mp3
├── salmo-33-provai-vede.mp3
├── salmo-117-este-dia.mp3
├── recebe-o-deus.mp3
├── pao-da-vida.mp3
├── jesus-pao-pobres.mp3
├── ide-em-paz.mp3
├── aleluia-ressurreicao.mp3
└── previews/
    ├── vem-espirito-santo-preview.mp3
    ├── cristo-ressuscitou-preview.mp3
    └── ...
```

## Formatos Suportados

- **MP3**: Formato principal (compatibilidade universal)
- **WAV**: Alta qualidade (opcional)
- **OGG**: Alternativa open source

## Fontes de Áudio

### 1. **Arquivos Locais**
- Armazenados em `/public/audio/`
- Acesso direto via URL
- Controle total sobre qualidade

### 2. **YouTube**
- Links para vídeos oficiais
- Maior disponibilidade
- Qualidade variável

### 3. **Spotify**
- Links para faixas oficiais
- Alta qualidade
- Requer conta Spotify

### 4. **SoundCloud**
- Alternativa para músicas independentes
- Boa qualidade
- Acesso gratuito

## Como Adicionar Novas Músicas

1. **Arquivo Local**:
   - Adicione o arquivo MP3 em `/public/audio/`
   - Atualize `audio-sources.ts` com a nova entrada

2. **Fonte Externa**:
   - Adicione a URL em `audio-sources.ts`
   - Teste a disponibilidade

3. **Preview**:
   - Crie um preview de 30s
   - Salve em `/public/audio/previews/`

## Exemplo de Configuração

```typescript
{
  musicId: 'nova-musica',
  title: 'Nova Música Litúrgica',
  artist: 'Compositor',
  sources: [
    {
      type: 'local',
      url: '/audio/nova-musica.mp3',
      duration: 180
    },
    {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=exemplo',
      title: 'Nova Música - YouTube',
      duration: 180
    }
  ],
  preview: '/audio/previews/nova-musica-preview.mp3'
}
```

## Direitos Autorais

⚠️ **IMPORTANTE**: Certifique-se de ter os direitos necessários para usar as músicas.

- Músicas tradicionais: Geralmente domínio público
- Músicas autorais: Necessária autorização
- Uso litúrgico: Verificar licenças específicas

## Qualidade Recomendada

- **Bitrate**: 128-320 kbps
- **Sample Rate**: 44.1 kHz
- **Formato**: MP3 ou WAV
- **Duração**: Música completa + preview de 30s

## Integração com IA

O sistema de IA utiliza estes arquivos para:

1. **Sugestões Automáticas**: Baseadas no catálogo disponível
2. **Preview Rápido**: Trechos de 30s para avaliação
3. **Playlist Automática**: Sequência de músicas para a missa
4. **Controle de Qualidade**: Validação de disponibilidade

## Manutenção

- Verificar links externos periodicamente
- Atualizar metadados conforme necessário
- Adicionar novas músicas sazonais
- Manter previews atualizados
