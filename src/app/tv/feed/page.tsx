"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUp, ArrowDown, Heart, MessageCircle, Share2, Volume2, VolumeX, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Video {
  id: number;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  source: string;
  views: number;
  publishedAt: string;
  duration: string;
}

interface Comment {
  author: string;
  text: string;
  ts: number;
}

interface VideoState {
  likes: number;
  liked: boolean;
  comments: Comment[];
}

export default function VideoFeedPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [videoStates, setVideoStates] = useState<Record<number, VideoState>>({});
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const feedRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos?limit=50");
        if (res.ok) {
          const data = await res.json();
          setVideos(data);
          
          // Initialize states from localStorage
          const states: Record<number, VideoState> = {};
          data.forEach((video: Video) => {
            const stored = localStorage.getItem(`feedVideo:${video.id}`);
            states[video.id] = stored 
              ? JSON.parse(stored) 
              : { likes: 0, liked: false, comments: [] };
          });
          setVideoStates(states);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Erro ao carregar vídeos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Save state to localStorage
  const saveState = (videoId: number, state: VideoState) => {
    localStorage.setItem(`feedVideo:${videoId}`, JSON.stringify(state));
  };

  // Handle like
  const handleLike = (videoId: number) => {
    setVideoStates(prev => {
      const current = prev[videoId];
      const newState = {
        ...current,
        liked: !current.liked,
        likes: current.liked ? Math.max(0, current.likes - 1) : current.likes + 1
      };
      saveState(videoId, newState);
      return { ...prev, [videoId]: newState };
    });
  };

  // Handle comment submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !videos[currentIndex]) return;

    const videoId = videos[currentIndex].id;
    const newComment: Comment = {
      author: "Você",
      text: commentText.trim(),
      ts: Date.now()
    };

    setVideoStates(prev => {
      const current = prev[videoId];
      const newState = {
        ...current,
        comments: [...current.comments, newComment]
      };
      saveState(videoId, newState);
      return { ...prev, [videoId]: newState };
    });

    setCommentText("");
    toast.success("Comentário adicionado!");
  };

  // Handle share
  const handleShare = async (video: Video) => {
    const shareData = {
      title: video.title,
      text: `Confira: ${video.title}`,
      url: `${window.location.origin}/tv/feed#v${video.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copiado!");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  // Navigation
  const goToVideo = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, videos.length - 1));
    setCurrentIndex(newIndex);
    
    const videoElement = document.getElementById(`video-${newIndex}`);
    videoElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', ' ', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
          goToVideo(currentIndex + 1);
        } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
          goToVideo(currentIndex - 1);
        } else if (e.key === 'Home') {
          goToVideo(0);
        } else if (e.key === 'End') {
          goToVideo(videos.length - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  // Intersection Observer for autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
            
            // Update current index
            const index = videoRefs.current.indexOf(video);
            if (index !== -1) setCurrentIndex(index);
            
            // Preload next video
            const nextVideo = videoRefs.current[index + 1];
            if (nextVideo) nextVideo.preload = 'auto';
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]);

  // Toggle mute for all videos
  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    videoRefs.current.forEach(video => {
      if (video) video.muted = newMuted;
    });
  };

  // Prevent double-tap zoom on iOS
  useEffect(() => {
    let lastTouch = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouch <= 300) {
        e.preventDefault();
      }
      lastTouch = now;
    };

    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    return () => document.removeEventListener('touchend', handleTouchEnd);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Carregando vídeos...</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center text-white">
          <p className="text-lg mb-4">Nenhum vídeo disponível</p>
          <Link href="/tv">
            <Button>Voltar para IspiAI TV</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];
  const currentState = videoStates[currentVideo?.id] || { likes: 0, liked: false, comments: [] };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Header with Ad Banner */}
      <header 
        className="fixed top-0 left-0 right-0 z-30 bg-[#0a0a0a] border-b border-white/[0.06]"
        style={{ height: 'var(--header-h, 68px)' }}
      >
        <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center p-2 h-full">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Link href="/tv">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-purple-600 to-cyan-500 shadow-[0_4px_16px_rgba(124,58,237,0.35)]" />
            <span className="font-semibold text-white text-base opacity-90">Portal Manduvi • Videos</span>
          </div>

          {/* Ad Banner */}
          <div className="h-[52px] rounded-2xl bg-gradient-to-r from-white/[0.08] to-white/[0.02] border border-white/[0.08] grid grid-cols-[52px_1fr_auto] items-center gap-3 px-3 max-md:hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-blue-500" />
            <p className="text-[13px] font-medium text-gray-200 truncate leading-tight">
              Seu anúncio aqui – conte histórias em 15 segundos. Alcance regional em Cuiabá e Várzea Grande.
            </p>
            <span className="text-[10px] font-bold tracking-[0.08em] text-neutral-400 border border-neutral-400/40 px-2 py-1.5 rounded-full">
              ANÚNCIO
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/10 w-10 h-10"
              title={muted ? "Ativar som" : "Desativar som"}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Video Feed */}
      <div
        ref={feedRef}
        className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory"
        style={{ 
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingTop: 'var(--header-h, 68px)'
        }}
      >
        {videos.map((video, index) => {
          const state = videoStates[video.id] || { likes: 0, liked: false, comments: [] };
          
          return (
            <section
              key={video.id}
              id={`video-${index}`}
              className="relative snap-start flex items-center justify-center bg-black"
              style={{ 
                height: 'calc(100vh - var(--header-h, 68px))',
                width: '100vw'
              }}
            >
              {/* Video */}
              <video
                ref={el => { videoRefs.current[index] = el; }}
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                className="w-full h-full object-cover"
                playsInline
                loop
                muted={muted}
                preload="metadata"
                onClick={(e) => {
                  const vid = e.currentTarget;
                  if (vid.paused) vid.play();
                  else vid.pause();
                }}
              />

              {/* HUD Overlay */}
              <div 
                className="absolute left-0 right-0 grid grid-cols-[1fr_auto] items-end gap-3 pointer-events-none px-4"
                style={{ bottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
              >
                {/* Caption */}
                <div className="max-w-[min(70vw,680px)] pointer-events-auto">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {video.category}
                  </Badge>
                  <p className="text-white font-medium text-[15px] leading-[1.35] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] mb-1">
                    {video.title}
                  </p>
                  <p className="text-white/80 text-xs drop-shadow-md">
                    {video.source} • {video.views.toLocaleString()} visualizações
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pointer-events-auto">
                  {/* Like */}
                  <div className="grid justify-items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(video.id);
                      }}
                      className={`w-[54px] h-[54px] rounded-full backdrop-blur-sm shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-all hover:scale-105 max-md:w-[50px] max-md:h-[50px] ${
                        state.liked 
                          ? 'bg-red-600/60 hover:bg-red-600' 
                          : 'bg-black/35 hover:bg-white/16'
                      }`}
                      title="Curtir"
                    >
                      <Heart 
                        className={`w-[22px] h-[22px] max-md:w-5 max-md:h-5 ${state.liked ? 'fill-white' : ''}`} 
                        color="white"
                      />
                    </Button>
                    <span className="text-white text-[11px] font-semibold leading-none opacity-90">
                      {state.likes}
                    </span>
                  </div>

                  {/* Comments */}
                  <div className="grid justify-items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCommentsOpen(true);
                      }}
                      className="w-[54px] h-[54px] rounded-full bg-black/35 backdrop-blur-sm hover:bg-white/16 shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-all hover:scale-105 max-md:w-[50px] max-md:h-[50px]"
                      title="Comentários"
                    >
                      <MessageCircle className="w-[22px] h-[22px] max-md:w-5 max-md:h-5" color="white" />
                    </Button>
                    <span className="text-white text-[11px] font-semibold leading-none opacity-90">
                      {state.comments.length || ''}
                    </span>
                  </div>

                  {/* Share */}
                  <div className="grid justify-items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(video);
                      }}
                      className="w-[54px] h-[54px] rounded-full bg-black/35 backdrop-blur-sm hover:bg-white/16 shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-all hover:scale-105 max-md:w-[50px] max-md:h-[50px]"
                      title="Compartilhar"
                    >
                      <Share2 className="w-[22px] h-[22px] max-md:w-5 max-md:h-5" color="white" />
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Navigation Buttons - Desktop */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 max-md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goToVideo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-white/20 text-white disabled:opacity-30 transition-all"
          aria-label="Vídeo anterior"
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
        
        <div className="text-white text-xs font-semibold bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
          {currentIndex + 1}/{videos.length}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => goToVideo(currentIndex + 1)}
          disabled={currentIndex === videos.length - 1}
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-white/20 text-white disabled:opacity-30 transition-all"
          aria-label="Próximo vídeo"
        >
          <ArrowDown className="w-6 h-6" />
        </Button>
      </div>

      {/* Comments Drawer - Backdrop */}
      {commentsOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setCommentsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Comments Drawer */}
      <aside
        className={`fixed right-0 h-full w-full max-w-[420px] bg-[#0b0b0b] border-l border-white/[0.08] z-50 flex flex-col transition-transform duration-300 max-md:max-w-[92vw] ${
          commentsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: 'var(--header-h, 68px)' }}
        aria-label="Comentários"
        aria-hidden={!commentsOpen}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-3 border-b border-white/[0.08]">
          <h3 className="font-semibold text-sm text-white opacity-90">Comentários</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCommentsOpen(false)}
            className="w-[38px] h-[38px] text-white hover:bg-white/15"
          >
            <X className="w-4 h-4" />
          </Button>
        </header>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {currentState.comments.length === 0 ? (
            <div className="opacity-70 font-medium text-[13px] text-white/70 text-center py-4">
              Seja o primeiro a comentar.
            </div>
          ) : (
            currentState.comments.map((comment, idx) => (
              <div
                key={idx}
                className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3"
              >
                <p className="text-gray-200 font-semibold text-xs leading-tight mb-1">
                  {comment.author}
                </p>
                <p className="text-neutral-300 text-[13px] leading-[1.3]">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment Form */}
        <form
          onSubmit={handleCommentSubmit}
          className="grid grid-cols-[1fr_auto] gap-2 p-3 border-t border-white/[0.08]"
        >
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escreva um comentário…"
            maxLength={240}
            className="h-10 rounded-[10px] border-white/[0.12] bg-white/[0.04] text-white placeholder:text-white/40 outline-none"
          />
          <Button type="submit" className="h-10 rounded-[10px] bg-green-600 hover:bg-green-700 font-bold text-[13px] px-4">
            Enviar
          </Button>
        </form>
      </aside>

      <style jsx global>{`
        :root {
          --header-h: 68px;
        }
        
        /* Hide scrollbar */
        #__next > div > div:first-child {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        #__next > div > div:first-child::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
