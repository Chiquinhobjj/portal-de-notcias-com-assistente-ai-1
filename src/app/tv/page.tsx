"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Clock, Eye, ThumbsUp, Share2, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  source: string;
  category: string;
  publishedAt: string;
  liked?: boolean;
}

interface Playlist {
  id: string;
  title: string;
  thumbnail: string;
  videoCount: number;
}

export default function IspiAITV() {
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "oldest">("recent");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - em produção, buscar da API
    const mockPlaylists: Playlist[] = [
      {
        id: "1",
        title: "QUANDO TEM FESTIVAL?",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/brazilian-music-festival-poster-with-col-c0af8532-20251023112140.jpg",
        videoCount: 5,
      },
      {
        id: "2",
        title: "Sobe o som!",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/brazilian-carnival-parade-with-samba-dan-601ab4d0-20251023112140.jpg",
        videoCount: 63,
      },
      {
        id: "3",
        title: "Tecnologia",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/technology-news-background-with-modern-g-82dae55d-20251023112140.jpg",
        videoCount: 1,
      },
    ];

    const mockVideos: VideoItem[] = [
      {
        id: "1",
        title: "EUA atacam embarcação no Pacífico e matam dois supostos narcotraficantes",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/news-thumbnail-image-showing-a-us-milita-5e31263c-20251023112020.jpg",
        duration: "13:35",
        views: "935",
        source: "O GLOBO",
        category: "Internacional",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Portas abertas para o petróleo",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/oil-industry-news-thumbnail-showing-oil--ee931bf1-20251023112019.jpg",
        duration: "14:12",
        views: "1412",
        source: "O GLOBO",
        category: "Economia",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "HAITI VEGAN SUMMIT 2025",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/vegan-food-summit-event-thumbnail-with-f-1e6e8411-20251023112020.jpg",
        duration: "14:05",
        views: "1405",
        source: "O GLOBO",
        category: "Sustentabilidade",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "4",
        title: "DA RUA ÀS PISTAS: CONHEÇA O DEEKAPZ",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/brazilian-music-artist-performing-on-sta-941a04ca-20251023112019.jpg",
        duration: "10:31",
        views: "1031",
        source: "O GLOBO",
        category: "Entretenimento",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "5",
        title: "Conhecida mais abordagem sexual, jornalista entra em coma para testemunhar Giovanna Lançellotti, após estupro",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/brazilian-journalist-in-hospital-or-medi-927c5d9c-20251023112019.jpg",
        duration: "8:03",
        views: "803",
        source: "O GLOBO",
        category: "Brasil",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "6",
        title: "96 bebês mortos em Cabo Frio: veja relato de três mães",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/brazilian-mothers-emotional-portrait-hol-a92af175-20251023112053.jpg",
        duration: "17:36",
        views: "1736",
        source: "O GLOBO",
        category: "Brasil",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "7",
        title: "Ingressos p/ Safira, Tiago Iorc e mais RI 2025",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/music-festival-tickets-and-concert-poste-41763e4f-20251023112052.jpg",
        duration: "11:40",
        views: "1140",
        source: "O GLOBO",
        category: "Cultura",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "8",
        title: "A semana na política: um refresco para o petismo",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/brazilian-political-news-thumbnail-showi-bef6ce78-20251023112053.jpg",
        duration: "8:61",
        views: "861",
        source: "O GLOBO",
        category: "Política",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "9",
        title: "Sonic Racing: Crossworlds",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/sonic-the-hedgehog-racing-game-screensho-50929069-20251023112053.jpg",
        duration: "5:99",
        views: "599",
        source: "O GLOBO",
        category: "Games",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "10",
        title: "Aluna com maior nota do ENEM 2024 dá dicas de como mandar sua nota",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/brazilian-student-studying-with-books-an-710d11ef-20251023112050.jpg",
        duration: "16:54",
        views: "1654",
        source: "O GLOBO",
        category: "Educação",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "11",
        title: "Adolescentes bebem com poucas restrições no Brasil",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/young-brazilian-teenagers-in-social-sett-1ff58e16-20251023112051.jpg",
        duration: "9:39",
        views: "939",
        source: "TOCA E PASSA",
        category: "Saúde",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "12",
        title: "Novos confrontos em Gaza",
        thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/gaza-conflict-news-thumbnail-showing-mid-5d5f0dd7-20251023112116.jpg",
        duration: "7:61",
        views: "761",
        source: "O GLOBO",
        category: "Internacional",
        publishedAt: new Date().toISOString(),
      },
    ];

    setPlaylists(mockPlaylists);
    setVideos(mockVideos);
    setLoading(false);
  }, []);

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === "popular") {
      return parseInt(b.views) - parseInt(a.views);
    } else if (sortBy === "oldest") {
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
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
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Listas de reprodução</h2>
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver todas
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                  <Link
                    key={playlist.id}
                    href={`/tv/playlist/${playlist.id}`}
                    className="group"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={playlist.thumbnail}
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
                          src={video.thumbnail}
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
                            {video.views}
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
                          src={video.thumbnail}
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
                            {video.views}
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