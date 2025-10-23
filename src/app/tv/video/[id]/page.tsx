"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, ThumbsUp, Share2, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoId = params.id;
        
        // Fetch video details
        const videoRes = await fetch(`/api/videos/${videoId}`);
        if (videoRes.ok) {
          const videoData = await videoRes.json();
          setVideo(videoData);
          
          // Increment view count
          await fetch(`/api/admin/videos/${videoId}/increment-views`, {
            method: "POST"
          });
          
          // Fetch related videos from same category
          const relatedRes = await fetch(`/api/videos?limit=8`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            // Filter out current video and limit to 6
            const filtered = relatedData
              .filter((v: Video) => v.id !== videoData.id)
              .slice(0, 6);
            setRelatedVideos(filtered);
          }
        } else {
          toast.error("Vídeo não encontrado");
          router.push("/tv");
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        toast.error("Erro ao carregar vídeo");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.id, router]);

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Curtida removida" : "Vídeo curtido!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video?.title,
        text: video?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para área de transferência!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando vídeo...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  const videoId = getYouTubeVideoId(video.youtubeUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white">URL do vídeo inválido</p>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{video.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {video.views?.toLocaleString() || 0} visualizações
                  </span>
                  <span>•</span>
                  <span className="font-medium">{video.source}</span>
                  <span>•</span>
                  <span>
                    {new Date(video.publishedAt || video.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  className="gap-2"
                >
                  <ThumbsUp className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Curtido" : "Curtir"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
              </div>

              {/* Description */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {video.description}
                </p>
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">Vídeos relacionados</h3>
            <div className="space-y-3">
              {relatedVideos.map((relatedVideo) => (
                <Link
                  key={relatedVideo.id}
                  href={`/tv/video/${relatedVideo.id}`}
                  className="group flex gap-2 hover:bg-muted/50 rounded-lg p-2 transition-colors"
                >
                  <div className="relative w-40 aspect-video rounded overflow-hidden flex-shrink-0 bg-muted">
                    <Image
                      src={relatedVideo.thumbnailUrl}
                      alt={relatedVideo.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-1 right-1">
                      <div className="bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs text-white font-medium">
                        {relatedVideo.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {relatedVideo.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-1">{relatedVideo.source}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {relatedVideo.views?.toLocaleString() || 0}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
