"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import NewsHeader from "@/components/NewsHeader";
import { AdBanner } from "@/components/AdBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Eye, ArrowLeft, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface VideoItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
  source: string;
  category: string;
  publishedAt: string;
  createdAt: string;
}

interface Playlist {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
  createdAt: string;
}

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`/api/playlists/${playlistId}`);
        
        if (!res.ok) {
          throw new Error("Playlist não encontrada");
        }

        const data = await res.json();
        setPlaylist(data.playlist);
        setVideos(data.videos || []);
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setError(err instanceof Error ? err.message : "Erro ao carregar playlist");
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando playlist...</p>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen bg-background">
        <NewsHeader articles={[]} />
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Playlist não encontrada</h2>
            <p className="text-muted-foreground mb-6">{error || "A playlist que você procura não existe."}</p>
            <Button onClick={() => router.push("/tv")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para IspiAI TV
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader articles={[]} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/tv")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para IspiAI TV
        </Button>

        {/* Playlist Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-4">
              <Image
                src={playlist.thumbnailUrl}
                alt={playlist.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-sm text-white font-medium inline-flex items-center gap-2 mb-3">
                  <Play className="h-4 w-4" />
                  Playlist - {videos.length} vídeos
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-3">{playlist.title}</h1>
            <p className="text-muted-foreground mb-4">{playlist.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <Button size="lg" className="gap-2" asChild>
                <Link href={videos[0] ? `/tv/watch/${videos[0].id}` : "#"}>
                  <Play className="h-5 w-5" fill="currentColor" />
                  Reproduzir tudo
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="h-5 w-5" />
                Compartilhar
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <AdBanner variant="vertical" size="large" label="Anúncio" />
          </div>
        </div>

        {/* Top Banner Ad */}
        <div className="mb-8">
          <AdBanner variant="horizontal" size="medium" />
        </div>

        {/* Videos List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold mb-4">Vídeos da playlist</h2>
            
            {videos.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum vídeo nesta playlist ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <Link
                    key={video.id}
                    href={`/tv/watch/${video.id}`}
                    className="group flex gap-4 bg-card rounded-lg border hover:border-primary/50 transition-all overflow-hidden"
                  >
                    <div className="flex-shrink-0 w-12 flex items-center justify-center bg-muted text-muted-foreground font-semibold">
                      {index + 1}
                    </div>
                    
                    <div className="relative w-40 h-28 flex-shrink-0">
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-5 w-5 text-black ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <div className="bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {video.duration}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 py-3 pr-4 flex flex-col justify-between min-w-0">
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {video.category}
                        </Badge>
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                          {video.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views?.toLocaleString() || 0}
                        </span>
                        <span>•</span>
                        <span className="font-medium">{video.source}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <AdBanner variant="vertical" size="large" label="Patrocinado" />
            </div>
          </div>
        </div>

        {/* Bottom Banner Ad */}
        <div className="mt-8">
          <AdBanner variant="horizontal" size="large" />
        </div>
      </div>
    </div>
  );
}
