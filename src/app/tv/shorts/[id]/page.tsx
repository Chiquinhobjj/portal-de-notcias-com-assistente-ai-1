"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Volume2,
  VolumeX,
  Send,
  ThumbsUp,
  ExternalLink
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

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

// Mock comments baseados na imagem
const mockComments: Comment[] = [
  {
    id: "1",
    author: "Hellen Lucy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hellen",
    content: "E o pior q não fiquei surpresa. 😱",
    timestamp: "14 h",
    likes: 1
  },
  {
    id: "2",
    author: "andersonmartins6107",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anderson",
    content: "o time mais sujo da história",
    timestamp: "13 h",
    likes: 3
  },
  {
    id: "3",
    author: "Gremy Neto",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gremy",
    content: "Se fosse qualquer outro clube era condenação na certa.",
    timestamp: "13 h",
    likes: 1
  },
  {
    id: "4",
    author: "ManoGuii",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mano",
    content: "um time desse disse que é grande,mídia lixooooooo",
    timestamp: "36 h",
    likes: 0
  },
  {
    id: "5",
    author: "NiebsonVirtudes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Niebson",
    content: "Queria muito ver a Torcida do Vasco Da Gama cantando...",
    timestamp: "2 h",
    likes: 0
  }
];

function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

export default function ShortsPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isInIframe, setIsInIframe] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Check if we're in an iframe
  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos?limit=50");
        if (!res.ok) throw new Error("Failed to fetch videos");
        
        const data = await res.json();
        setVideos(data);
        
        const currentId = parseInt(params.id as string);
        const index = data.findIndex((v: Video) => v.id === currentId);
        if (index !== -1) setCurrentIndex(index);
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

  // Update URL and increment views
  useEffect(() => {
    if (currentVideo) {
      fetch(`/api/admin/videos/${currentVideo.id}/increment-views`, {
        method: "POST"
      });
      window.history.replaceState(null, "", `/tv/shorts/${currentVideo.id}`);
    }
  }, [currentVideo]);

  // If in iframe and video is ready, redirect to YouTube
  useEffect(() => {
    if (isInIframe && currentVideo) {
      const videoId = getYouTubeVideoId(currentVideo.youtubeUrl);
      if (videoId) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        window.open(youtubeUrl, "_blank", "noopener,noreferrer");
        toast.info("Abrindo vídeo no YouTube em nova aba...");
        setTimeout(() => {
          router.push("/tv");
        }, 2000);
      }
    }
  }, [isInIframe, currentVideo, router]);

  const navigateToVideo = (direction: "next" | "prev") => {
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
    
    setComments([...comments, newComment]);
    setCommentText("");
    toast.success("Comentário adicionado!");
    
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentVideo?.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  };

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

  if (!currentVideo) return null;

  // If in iframe, show message
  if (isInIframe) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center max-w-md p-8">
          <ExternalLink className="h-16 w-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Abrindo vídeo no YouTube
          </h2>
          <p className="text-white/80 mb-6">
            Os vídeos são reproduzidos no YouTube para melhor experiência.
          </p>
          <Button
            onClick={() => router.push("/tv")}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black"
          >
            Voltar para IspiAI TV
          </Button>
        </div>
      </div>
    );
  }

  const videoId = getYouTubeVideoId(currentVideo.youtubeUrl);
  const embedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&rel=0&modestbranding=1&controls=1&loop=1&playlist=${videoId}`
    : null;

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* HEADER - Sempre Visível */}
      <div className="flex-none bg-black/90 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/tv")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 px-4">
            <h1 className="text-white font-semibold text-sm line-clamp-1">
              {currentVideo.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>{currentVideo.views?.toLocaleString() || 0} visualizações</span>
              <span>•</span>
              <span>{new Date(currentVideo.publishedAt || currentVideo.createdAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenInYouTube}
              className="text-white hover:bg-white/20"
              title="Abrir no YouTube"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMuted(!muted)}
              className="text-white hover:bg-white/20"
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden">
        {/* VÍDEO + CONTROLES */}
        <div className="flex-1 relative flex items-center justify-center bg-black">
          {embedUrl ? (
            <iframe
              key={currentVideo.id}
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={currentVideo.title}
              style={{ border: "none" }}
            />
          ) : (
            <div className="text-white">URL do vídeo inválido</div>
          )}

          {/* BOTÕES DE NAVEGAÇÃO - Sempre Visíveis */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
            <Button
              onClick={() => navigateToVideo("prev")}
              disabled={currentIndex === 0}
              size="icon"
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
            >
              <ChevronUp className="w-6 h-6" />
            </Button>
            
            <div className="text-center text-white/70 text-xs font-medium">
              {currentIndex + 1}/{videos.length}
            </div>
            
            <Button
              onClick={() => navigateToVideo("next")}
              disabled={currentIndex === videos.length - 1}
              size="icon"
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
            >
              <ChevronDown className="w-6 h-6" />
            </Button>
          </div>

          {/* AÇÕES LATERAIS */}
          <div className="absolute right-4 bottom-32 z-40 flex flex-col items-center gap-4">
            <button
              onClick={() => {
                setLiked(!liked);
                toast.success(liked ? "Curtida removida" : "Vídeo curtido!");
              }}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                liked ? "bg-red-500 text-white" : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              }`}>
                <Heart className={`h-6 w-6 ${liked ? "fill-current" : ""}`} />
              </div>
              <span className="text-xs text-white font-medium">
                {liked ? (currentVideo.likes || 0) + 1 : currentVideo.likes || 0}
              </span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center">
                <MessageCircle className="h-6 w-6" />
              </div>
              <span className="text-xs text-white font-medium">{comments.length}</span>
            </button>

            <button onClick={handleShare} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center">
                <Share2 className="h-6 w-6" />
              </div>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center">
                <MoreVertical className="h-6 w-6" />
              </div>
            </button>
          </div>
        </div>

        {/* SEÇÃO DE COMENTÁRIOS - Sempre Visível */}
        <div className="w-96 bg-background border-l flex flex-col">
          {/* Header dos Comentários */}
          <div className="flex-none p-4 border-b">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comentários ({comments.length})
            </h3>
          </div>

          {/* Lista de Comentários */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                  <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm truncate">{comment.author}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm break-words">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
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
            <div ref={commentsEndRef} />
          </div>

          {/* Input de Comentário */}
          <div className="flex-none p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAddComment();
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
      </div>
    </div>
  );
}