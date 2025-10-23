"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Eye, 
  ThumbsUp, 
  Share2, 
  MessageCircle,
  MoreHorizontal,
  Volume2,
  VolumeX,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  category: string;
  duration: string;
  views: number;
  likes: number;
  source: string;
  publishedAt: string;
  createdAt: string;
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos?limit=50");
        if (!res.ok) throw new Error("Failed to fetch videos");
        
        const data = await res.json();
        setVideos(data);
        
        // Find current video index
        const currentId = parseInt(params.id as string);
        const index = data.findIndex((v: Video) => v.id === currentId);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Erro ao carregar vídeos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [params.id]);

  const currentVideo = videos[currentIndex];

  // Increment view count and update URL
  useEffect(() => {
    if (currentVideo) {
      fetch(`/api/admin/videos/${currentVideo.id}/increment-views`, {
        method: "POST"
      });
      
      // Update URL without page reload
      window.history.replaceState(null, "", `/tv/watch/${currentVideo.id}`);
    }
  }, [currentVideo]);

  const handleOpenInYouTube = () => {
    if (currentVideo) {
      const videoId = getYouTubeVideoId(currentVideo.youtubeUrl);
      if (videoId) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        window.open(youtubeUrl, "_blank", "noopener,noreferrer");
        toast.success("Abrindo no YouTube...");
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentVideo?.title,
        text: currentVideo?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return null;
  }

  const videoId = getYouTubeVideoId(currentVideo.youtubeUrl);
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&controls=1`
    : null;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Video Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {embedUrl ? (
          <iframe
            key={currentVideo.id}
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentVideo.title}
            style={{
              border: "none",
              objectFit: "cover"
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-white text-lg">Vídeo não disponível</p>
            <Button
              onClick={() => router.push("/tv")}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Voltar para IspiAI TV
            </Button>
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/tv")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInYouTube}
            className="text-white hover:bg-white/20 gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir no YouTube
          </Button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentVideo.source.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-white font-semibold text-lg line-clamp-1">
                {currentVideo.title}
              </h2>
              <p className="text-white/70 text-sm">{currentVideo.source}</p>
            </div>
          </div>
          
          <p className="text-white/90 text-sm line-clamp-2 mb-3">
            {currentVideo.description}
          </p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </button>
            <span className="text-white/60 text-sm flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {currentVideo.views?.toLocaleString() || 0}
            </span>
            <span className="text-white/60 text-sm flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {currentVideo.likes?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}