"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Eye, 
  ThumbsUp, 
  Share2, 
  MessageCircle,
  MoreHorizontal,
  Volume2,
  VolumeX,
  X,
  Send
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

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

// Mock comments
const mockComments: Comment[] = [
  {
    id: "1",
    author: "Hellen Lucy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hellen",
    content: "E o pior q não fiquei surpresa. 😱",
    timestamp: "14 h atrás",
    likes: 1
  },
  {
    id: "2",
    author: "andersonmartins6107",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anderson",
    content: "o time mais sujo da história",
    timestamp: "13 h atrás",
    likes: 3
  },
  {
    id: "3",
    author: "Gremy Neto",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gremy",
    content: "Se fosse qualquer outro clube era condenação na certa. Mas estamos falando do flamengo, onde qualquer coisa é permitida. até à negligência de tirar vidas!",
    timestamp: "13 h atrás",
    likes: 1
  },
  {
    id: "4",
    author: "ManoGuii",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mano",
    content: "um time desse disse que é grande,mídia lixooooooo,justiça faça justiça a",
    timestamp: "36 h atrás",
    likes: 0
  },
  {
    id: "5",
    author: "NiebsonVirtudes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Niebson",
    content: "Queria muito ver a Torcida do Vasco Da Gama cantando, mas obviamente vai pegar punição tão grave que tem ajuda do Globo da CBF da FIFA da Justiça do Brasil tem tudo. Assassino No Assassino No Time De Assassino No Assassino...",
    timestamp: "2 h atrás",
    likes: 0
  },
  {
    id: "6",
    author: "Bruno BMW",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno",
    content: "Vergonha.",
    timestamp: "9 h atrás",
    likes: 0
  },
  {
    id: "7",
    author: "Alexandre J Escritor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre",
    content: "Se não foi CPF, Culpado, então manda prender os meninos mortos. O poder no Brasil atropela tudo.",
    timestamp: "11 h atrás",
    likes: 0
  }
];

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
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef(0);
  const touchStartRef = useRef(0);
  const videoContainerRef = useRef<HTMLDivElement>(null);

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
    // Don't navigate if comments are open
    if (showComments) return;
    
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
  }, [videos.length, showComments]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showComments) return;
      
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
  }, [navigateToVideo, showComments]);

  // Touch/Swipe navigation
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (showComments) return;
      startY = e.touches[0].clientY;
      touchStartRef.current = startY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (showComments) return;
      
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
  }, [navigateToVideo, showComments]);

  // Mouse wheel navigation
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (showComments) return;
      
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
  }, [navigateToVideo, showComments]);

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

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: "Você",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      content: commentText,
      timestamp: "Agora",
      likes: 0
    };
    
    setComments([newComment, ...comments]);
    setCommentText("");
    toast.success("Comentário adicionado!");
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
      {/* Video Container */}
      <div 
        ref={videoContainerRef}
        className="absolute inset-0 flex items-center justify-center"
      >
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

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/tv")}
        className="fixed top-4 left-4 z-50 text-white hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Mute Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMuted(!muted)}
        className="fixed top-4 right-4 z-50 text-white hover:bg-white/20"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>

      {/* Right Action Bar (TikTok Style) */}
      <div className="fixed right-4 bottom-32 z-40 flex flex-col items-center gap-6">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            liked 
              ? "bg-red-500 text-white" 
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          }`}>
            <ThumbsUp className={`h-6 w-6 ${liked ? "fill-current" : ""}`} />
          </div>
          <span className="text-xs text-white font-medium">
            {liked ? (currentVideo.likes || 0) + 1 : currentVideo.likes || 0}
          </span>
        </button>

        {/* Comment Button */}
        <button 
          onClick={() => setShowComments(true)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center transition-colors">
            <MessageCircle className="h-6 w-6" />
          </div>
          <span className="text-xs text-white font-medium">{comments.length}</span>
        </button>

        {/* Share Button */}
        <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center transition-colors">
            <Share2 className="h-6 w-6" />
          </div>
          <span className="text-xs text-white font-medium">Share</span>
        </button>

        {/* More Button */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center transition-colors">
            <MoreHorizontal className="h-6 w-6" />
          </div>
        </button>
      </div>

      {/* Bottom Info Section */}
      <div className="fixed bottom-0 left-0 right-20 z-40 p-4 pb-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="max-w-xl space-y-2">
          {/* Source/Author */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentVideo.source.charAt(0)}
              </span>
            </div>
            <span className="text-white font-semibold">{currentVideo.source}</span>
            <Button 
              size="sm" 
              variant="outline"
              className="ml-2 h-7 px-4 text-xs border-white text-white hover:bg-white hover:text-black"
            >
              Seguir
            </Button>
          </div>

          {/* Description */}
          <p className="text-white text-sm line-clamp-2">
            {currentVideo.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {currentVideo.views?.toLocaleString() || 0}
            </span>
            <span>•</span>
            <span>
              {new Date(currentVideo.publishedAt || currentVideo.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed top-20 right-4 z-40 text-white/70 text-xs">
        {currentIndex + 1} / {videos.length}
      </div>

      {/* Comments Panel */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl transition-transform duration-300 ${
          showComments ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "70vh" }}
      >
        {/* Comments Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">
            Comentários ({comments.length})
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowComments(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Comments List */}
        <div className="overflow-y-auto p-4 space-y-4" style={{ height: "calc(70vh - 140px)" }}>
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                <Image
                  src={comment.avatar}
                  alt={comment.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-sm mb-2">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-foreground">
                    Responder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
              className="flex-1"
            />
            <Button 
              size="icon"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Comments Overlay */}
      {showComments && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowComments(false)}
        />
      )}
    </div>
  );
}