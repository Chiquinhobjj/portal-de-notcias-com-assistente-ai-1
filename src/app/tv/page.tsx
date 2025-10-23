"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Clock, Eye, ThumbsUp, Share2, ChevronRight } from "lucide-react";
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
  liked?: boolean;
}

interface Playlist {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
}

export default function IspiAITV() {
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "oldest">("recent");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch videos
        const videosRes = await fetch("/api/videos?limit=50");
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          setVideos(videosData);
        }

        // Fetch playlists
        const playlistsRes = await fetch("/api/playlists");
        if (playlistsRes.ok) {
          const playlistsData = await playlistsRes.json();
          setPlaylists(playlistsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.views || 0) - (a.views || 0);
    } else if (sortBy === "oldest") {
      return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
    }
    return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
  });

  const likedVideos = videos.filter((v) => v.liked);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando vídeos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="videos" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="videos" className="gap-2">
                <Play className="h-4 w-4" />
                Vídeos
              </TabsTrigger>
              <TabsTrigger value="liked" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                Curtido
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("recent")}
              >
                Mais recentes
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
              >
                Popular
              </Button>
              <Button
                variant={sortBy === "oldest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("oldest")}
              >
                Mais antigos
              </Button>
            </div>
          </div>

          <TabsContent value="videos" className="space-y-8">
            {/* Playlists Section */}
            {playlists.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Listas de reprodução</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {playlists.slice(0, 4).map((playlist) => (
                    <Link
                      key={playlist.id}
                      href={`/tv/playlist/${playlist.id}`}
                      className="group"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={playlist.thumbnailUrl}
                          alt={playlist.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                            {playlist.title}
                          </h3>
                          <p className="text-xs text-white/80">
                            {playlist.videoCount} publicações
                          </p>
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
                            <Play className="h-3 w-3 inline mr-1" />
                            Playlist
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Grid */}
            <div>
              <h2 className="text-xl font-bold mb-4">Vídeos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/tv/video/${video.id}`}
                    className="group"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-6 w-6 text-black ml-1" fill="currentColor" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white font-medium flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            {video.duration}
                          </div>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {video.category}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {video.views?.toLocaleString() || 0}
                          </span>
                          <span>•</span>
                          <span className="font-medium">{video.source}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="liked" className="space-y-4">
            {likedVideos.length === 0 ? (
              <div className="text-center py-12">
                <ThumbsUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum vídeo curtido ainda</h3>
                <p className="text-muted-foreground">
                  Os vídeos que você curtir aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {likedVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/tv/video/${video.id}`}
                    className="group"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-6 w-6 text-black ml-1" fill="currentColor" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white font-medium flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            {video.duration}
                          </div>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {video.category}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {video.views?.toLocaleString() || 0}
                          </span>
                          <span>•</span>
                          <span className="font-medium">{video.source}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}