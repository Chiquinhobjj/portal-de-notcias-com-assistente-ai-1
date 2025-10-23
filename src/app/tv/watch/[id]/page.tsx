"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Eye, 
  ThumbsUp, 
  Share2, 
  MessageCircle,
  MoreHorizontal,
  Volume2,
  VolumeX
} from "lucide-react";
import { toast } from "sonner";

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
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef(0);
  const touchStartRef = useRef(0);

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

  // Handle navigation with throttle
  const navigateToVideo = useCallback((direction: "next" | "prev") => {
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTimeRef.current;
    
    // Throttle to prevent rapid navigation (300ms cooldown)
    if (timeSinceLastScroll < 300) {
      return;
    }
    
    lastScrollTimeRef.current = now;
    
    setCurrentIndex(prev => {
      if (direction === "next" && prev < videos.length - 1) {
        setLiked(false);
        return prev + 1;
      } else if (direction === "prev" && prev > 0) {
        setLiked(false);
        return prev - 1;
      }
      return prev;
    });
  }, [videos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateToVideo("next");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateToVideo("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateToVideo]);

  // Touch/Swipe navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      touchStartRef.current = startY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      const diff = touchStartRef.current - endY;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Swipe up - next video
          navigateToVideo("next");
        } else {
          // Swipe down - previous video
          navigateToVideo("prev");
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigateToVideo]);

  // Mouse wheel navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (Math.abs(e.deltaY) > 10) {
        if (e.deltaY > 0) {
          navigateToVideo("next");
        } else {
          navigateToVideo("prev");
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [navigateToVideo]);

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Curtida removida" : "Vídeo curtido!");
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
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&rel=0&modestbranding=1&controls=0&loop=1&playlist=${videoId}`
    : null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden"
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/tv")}
        className="fixed top-4 left-4 z-50 text-white hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Video Player */}
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
          <div className="flex items-center justify-center">
            <p className="text-white">URL do vídeo inválido</p>
          </div>
        )}
      </div>

      {/* Right Action Bar (TikTok Style) */}
      <div className="fixed right-4 bottom-24 z-40 flex flex-col items-center gap-6">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            liked 
              ? "bg-red-500 text-white" 
              : "bg-white/20 text-white hover:bg-white/30"
          }`}>
            <ThumbsUp className={`h-6 w-6 ${liked ? "fill-current" : ""}`} />
          </div>
          <span className="text-xs text-white font-medium">
            {liked ? currentVideo.likes + 1 : currentVideo.likes}
          </span>
        </button>

        {/* Comment Button */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors">
            <MessageCircle className="h-6 w-6" />
          </div>
          <span className="text-xs text-white font-medium">0</span>
        </button>

        {/* Share Button */}
        <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors">
            <Share2 className="h-6 w-6" />
          </div>
          <span className="text-xs text-white font-medium">Share</span>
        </button>

        {/* More Button */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors">
            <MoreHorizontal className="h-6 w-6" />
          </div>
        </button>
      </div>

      {/* Bottom Info Section */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="max-w-xl">
          {/* Category Badge */}
          <Badge variant="secondary" className="mb-2">
            {currentVideo.category}
          </Badge>

          {/* Title */}
          <h2 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {currentVideo.title}
          </h2>

          {/* Description */}
          <p className="text-white/80 text-sm line-clamp-2 mb-3">
            {currentVideo.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {currentVideo.views?.toLocaleString() || 0}
            </span>
            <span>•</span>
            <span className="font-medium">{currentVideo.source}</span>
            <span>•</span>
            <span>
              {new Date(currentVideo.publishedAt || currentVideo.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      </div>

      {/* Mute Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMuted(!muted)}
        className="fixed top-4 right-4 z-50 text-white hover:bg-white/20"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>

      {/* Navigation Indicators */}
      <div className="fixed right-1/2 translate-x-1/2 bottom-20 z-30 flex flex-col items-center gap-2">
        {currentIndex > 0 && (
          <div className="text-white/50 text-xs animate-bounce">
            ↑ Anterior
          </div>
        )}
        {currentIndex < videos.length - 1 && (
          <div className="text-white/50 text-xs animate-bounce">
            ↓ Próximo
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="fixed top-20 right-4 z-40 text-white/70 text-xs">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
}