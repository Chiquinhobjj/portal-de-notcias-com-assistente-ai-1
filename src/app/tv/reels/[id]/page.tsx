"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause } from "lucide-react";
import ReelsFeed from "@/components/tv/ReelsFeed";
import CommentsDrawer from "@/components/tv/CommentsDrawer";
import VideoActions from "@/components/tv/VideoActions";
import { getYouTubeVideoInfo } from "@/lib/youtube-utils";

interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  views: number;
  liked?: boolean;
  createdAt: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: number;
}

export default function ReelsPage() {
  const params = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);

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
          setCurrentVideoId(currentId);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
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
      window.history.replaceState(null, "", `/tv/reels/${currentVideo.id}`);
      setCurrentVideoId(currentVideo.id);
    }
  }, [currentVideo]);

  const handleVideoChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  const handleCommentsToggle = () => {
    setCommentsOpen(!commentsOpen);
  };

  const handleLike = async (videoId: number) => {
    try {
      const res = await fetch(`/api/videos/${videoId}/like`, {
        method: "POST"
      });
      if (res.ok) {
        // Update local state
        setVideos(prev => prev.map(v => 
          v.id === videoId 
            ? { ...v, liked: !v.liked, views: v.liked ? v.views - 1 : v.views + 1 }
            : v
        ));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleShare = async () => {
    if (currentVideo) {
      const shareData = {
        title: currentVideo.title,
        text: currentVideo.description,
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareData.url);
        }
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Carregando vídeos...</p>
        </div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Nenhum vídeo encontrado</p>
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

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Header com banner publicitário */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/tv")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0C4A6E]"></div>
              <span className="text-white font-semibold">IspiAI Reels</span>
            </div>
          </div>
          
          {/* Banner publicitário */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500"></div>
            <div className="text-white text-sm">
              <div className="font-medium">Seu anúncio aqui</div>
              <div className="text-xs opacity-70">Alcance regional em MT</div>
            </div>
            <div className="text-xs px-2 py-1 rounded-full border border-white/30 text-white/70">
              ANÚNCIO
            </div>
          </div>
        </div>
      </header>

      {/* Feed de vídeos */}
      <div className="pt-16">
        <ReelsFeed
          videos={videos}
          initialIndex={currentIndex}
          onVideoChange={handleVideoChange}
        />
      </div>

      {/* Ações do vídeo */}
      {currentVideo && (
        <VideoActions
          video={currentVideo}
          onLike={() => handleLike(currentVideo.id)}
          onComments={handleCommentsToggle}
          onShare={handleShare}
        />
      )}

      {/* Drawer de comentários */}
      <CommentsDrawer
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        videoId={currentVideoId}
        videoTitle={currentVideo?.title}
      />
    </div>
  );
}
