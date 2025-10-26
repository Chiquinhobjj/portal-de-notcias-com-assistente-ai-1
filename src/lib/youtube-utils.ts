/**
 * Utilitários para trabalhar com URLs do YouTube
 */

export interface YouTubeVideoInfo {
  videoId: string;
  type: 'video' | 'shorts' | 'embed';
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
}

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 * Suporta: watch, shorts, youtu.be, embed
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  try {
    // Regex atualizada para suportar Shorts
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Detecta o tipo de URL do YouTube
 */
export function getYouTubeUrlType(url: string): 'video' | 'shorts' | 'embed' | null {
  if (!url) return null;
  
  if (url.includes('/shorts/')) return 'shorts';
  if (url.includes('/embed/')) return 'embed';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
  
  return null;
}

/**
 * Valida se uma URL é válida do YouTube
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Gera informações completas sobre um vídeo do YouTube
 */
export function getYouTubeVideoInfo(url: string): YouTubeVideoInfo | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  const type = getYouTubeUrlType(url) || 'video';
  
  return {
    videoId,
    type,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  };
}

/**
 * Converte qualquer URL do YouTube para URL de embed
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Converte qualquer URL do YouTube para URL de watch
 */
export function getYouTubeWatchUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Gera URL de thumbnail do YouTube
 */
export function getYouTubeThumbnailUrl(url: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

/**
 * Gera URL de thumbnail com fallback automático
 * Tenta múltiplas qualidades para garantir que a thumbnail seja encontrada
 */
export function getYouTubeThumbnailWithFallback(videoId: string): string {
  // hqdefault (480x360) tem mais disponibilidade que maxresdefault
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Gera múltiplas URLs de thumbnail para fallback
 */
export function getYouTubeThumbnailFallbacks(videoId: string): string[] {
  return [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, // Melhor qualidade
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,     // Alta qualidade
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,     // Média qualidade
    `https://img.youtube.com/vi/${videoId}/default.jpg`       // Qualidade padrão
  ];
}
