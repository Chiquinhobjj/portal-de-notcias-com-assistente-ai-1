"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const ShortsClient = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos?limit=20&sort=createdAt&order=desc");
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        setVideos(data || []);
      } catch (e) {
        console.error(e);
        toast.error("Erro ao carregar vídeos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Get/Set video state from localStorage
  const getVideoState = (videoId: number): VideoState => {
    try {
      const stored = localStorage.getItem(`video:${videoId}`);
      return stored ? JSON.parse(stored) : { likes: 0, liked: false, comments: [] };
    } catch {
      return { likes: 0, liked: false, comments: [] };
    }
  };

  const setVideoState = (videoId: number, state: VideoState) => {
    localStorage.setItem(`video:${videoId}`, JSON.stringify(state));
  };

  // Handle like toggle
  const handleLike = (videoId: number) => {
    const state = getVideoState(videoId);
    state.liked = !state.liked;
    state.likes += state.liked ? 1 : -1;
    setVideoState(videoId, state);
    setVideos([...videos]); // Force re-render
  };

  // Handle comment submission
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || currentIndex >= videos.length) return;
    
    const video = videos[currentIndex];
    const state = getVideoState(video.id);
    state.comments.push({
      author: "Você",
      text: commentText.trim(),
      ts: Date.now()
    });
    setVideoState(video.id, state);
    setCommentText("");
    setVideos([...videos]); // Force re-render
    toast.success("Comentário adicionado!");
  };

  // Handle share
  const handleShare = async (video: Video) => {
    const shareData = {
      title: video.title,
      text: video.description,
      url: `${window.location.origin}/tv/watch/${video.id}`
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copiado!");
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  // Extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0` : url;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", " "].includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowDown" || e.key === " ") {
          setCurrentIndex(prev => Math.min(prev + 1, videos.length - 1));
        } else if (e.key === "ArrowUp") {
          setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [videos.length]);

  // Scroll to current video
  useEffect(() => {
    if (feedRef.current && videos.length > 0) {
      const items = feedRef.current.querySelectorAll(".video-item");
      items[currentIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentIndex, videos.length]);

  // Intersection observer for autoplay
  useEffect(() => {
    if (!videos.length) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const iframe = entry.target as HTMLIFrameElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // YouTube iframe autoplay is handled by URL params
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );

    const items = feedRef.current?.querySelectorAll(".video-item iframe");
    items?.forEach(item => observerRef.current?.observe(item));

    return () => observerRef.current?.disconnect();
  }, [videos]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/80">Carregando Shorts...</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <p className="text-xl mb-4">Nenhum vídeo disponível</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];
  const currentState = getVideoState(currentVideo.id);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg" />
            <div className="text-white font-semibold text-lg">IspiAI Shorts</div>
          </div>
          <Button
            onClick={() => router.push("/")}
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Feed */}
      <div
        ref={feedRef}
        className="fixed inset-0 overflow-y-scroll snap-y snap-mandatory bg-black [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ paddingTop: "68px" }}
      >
        {videos.map((video, idx) => {
          const state = getVideoState(video.id);
          return (
            <section
              key={video.id}
              className="video-item relative snap-start bg-black flex items-center justify-center"
              style={{ height: "calc(100vh - 68px)", width: "100vw" }}
            >
              {/* Video iframe */}
              <iframe
                src={getYouTubeEmbedUrl(video.youtubeUrl)}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ border: "none", objectFit: "cover" }}
              />

              {/* HUD */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 pointer-events-none">
                <div className="flex items-end justify-between gap-4">
                  {/* Caption */}
                  <div className="flex-1 max-w-[70vw] pointer-events-auto">
                    <h3 className="text-white font-semibold text-base mb-1 drop-shadow-lg">
                      {video.title}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-2 drop-shadow-lg">
                      {video.description}
                    </p>
                    <p className="text-white/70 text-xs mt-1 drop-shadow-lg">
                      {video.category} • {video.source}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pointer-events-auto">
                    {/* Like */}
                    <button
                      onClick={() => handleLike(video.id)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        state.liked 
                          ? "bg-red-500/80 shadow-lg shadow-red-500/50" 
                          : "bg-black/40 hover:bg-white/20"
                      }`}>
                        <Heart 
                          className={`h-6 w-6 ${state.liked ? "fill-white text-white" : "text-white"}`}
                        />
                      </div>
                      <span className="text-white text-xs font-semibold drop-shadow-lg">
                        {state.likes}
                      </span>
                    </button>

                    {/* Comments */}
                    <button
                      onClick={() => setCommentsOpen(true)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-14 h-14 rounded-full bg-black/40 hover:bg-white/20 flex items-center justify-center transition-all shadow-lg">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white text-xs font-semibold drop-shadow-lg">
                        {state.comments.length}
                      </span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleShare(video)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-14 h-14 rounded-full bg-black/40 hover:bg-white/20 flex items-center justify-center transition-all shadow-lg">
                        <Share2 className="h-6 w-6 text-white" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Comments Drawer */}
      {commentsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setCommentsOpen(false)}
          />
          <aside className="fixed right-0 top-[68px] bottom-0 w-full max-w-md bg-[#0b0b0b] border-l border-white/10 z-[41] flex flex-col">
            <header className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">Comentários</h3>
              <Button
                onClick={() => setCommentsOpen(false)}
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10 w-9 h-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentState.comments.length === 0 ? (
                <p className="text-white/70 text-sm text-center py-8">
                  Seja o primeiro a comentar.
                </p>
              ) : (
                currentState.comments.map((comment, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-white/90 font-semibold text-xs mb-1">
                      {comment.author}
                    </div>
                    <div className="text-white/80 text-sm">{comment.text}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleComment} className="p-4 border-t border-white/10 flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escreva um comentário…"
                maxLength={240}
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Enviar
              </Button>
            </form>
          </aside>
        </>
      )}
    </>
  );
};