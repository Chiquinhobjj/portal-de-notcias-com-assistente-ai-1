"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getYouTubeVideoInfo, isValidYouTubeUrl, getYouTubeThumbnailWithFallback } from "@/lib/youtube-utils";

interface VideoPreviewProps {
  youtubeUrl: string;
  title?: string;
  thumbnailUrl?: string;
  categories?: Array<{ id: number; name: string }>; // Array de categorias
  duration?: string;
  views?: number;
  likes?: number;
  className?: string;
  showStats?: boolean;
  showPlayButton?: boolean;
}

export default function VideoPreview({
  youtubeUrl,
  title,
  thumbnailUrl,
  categories,
  duration,
  views,
  likes,
  className,
  showStats = true,
  showPlayButton = true,
}: VideoPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Usar o utilitário centralizado para extrair informações do YouTube
  const videoInfo = getYouTubeVideoInfo(youtubeUrl);
  const thumbnail = thumbnailUrl || (videoInfo ? getYouTubeThumbnailWithFallback(videoInfo.videoId) : '');

  const handlePlay = () => {
    if (videoInfo) {
      window.open(videoInfo.url, '_blank');
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return "0";
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (!videoInfo) {
    return (
      <div className={cn("border rounded-lg p-4 text-center text-muted-foreground", className)}>
        <p>URL do YouTube inválida</p>
        <p className="text-xs mt-2">Suportamos: youtube.com/watch, youtube.com/shorts, youtu.be</p>
      </div>
    );
  }

  return (
    <div
      className={cn("relative group cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title || "Video thumbnail"}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              // Tentar fallback para qualidade menor se a imagem não carregar
              const img = e.currentTarget;
              if (img.src.includes('hqdefault.jpg')) {
                img.src = img.src.replace('hqdefault.jpg', 'mqdefault.jpg');
              } else if (img.src.includes('mqdefault.jpg')) {
                img.src = img.src.replace('mqdefault.jpg', 'default.jpg');
              } else {
                img.style.display = 'none';
              }
            }}
          />
        )}
        
        {/* Play button overlay */}
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Play className="h-6 w-6 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-black/80 text-white">
              {duration}
            </Badge>
          </div>
        )}

        {/* Shorts indicator */}
        {videoInfo.type === 'shorts' && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="bg-red-600 text-white">
              Shorts
            </Badge>
          </div>
        )}
      </div>

             {/* Video info */}
             {title && (
               <div className="mt-3">
                 <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                   {title}
                 </h3>
                 
                 {/* Categories */}
                 {categories && categories.length > 0 && (
                   <div className="flex flex-wrap gap-1 mt-2">
                     {categories.map((category) => (
                       <Badge
                         key={category.id}
                         variant="secondary"
                         className="text-xs bg-blue-100 text-blue-800"
                       >
                         {category.name}
                       </Badge>
                     ))}
                   </div>
                 )}
                 
                 {showStats && (views || likes) && (
                   <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                     {views && (
                       <span>{formatNumber(views)} visualizações</span>
                     )}
                     {likes && (
                       <span>{formatNumber(likes)} curtidas</span>
                     )}
                   </div>
                 )}
               </div>
             )}

      {/* External link button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          window.open(youtubeUrl, '_blank');
        }}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
}
