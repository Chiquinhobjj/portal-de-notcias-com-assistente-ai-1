"use client";

import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { getYouTubeVideoInfo } from "@/lib/youtube-utils";

interface VideoAdBannerProps {
  label?: string;
  variant?: "carousel" | "grid";
}

const videoAds = [
  {
    id: 1,
    title: "Kaique Mendes",
    description: "Advocacia & Consultoria Jurídica Empresarial",
    thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/professional-video-advertisement-thumbna-1a96ed57-20251023110939.jpg",
    color: "from-blue-600/30 to-cyan-600/30",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: 2,
    title: "Nota Cuiabá",
    description: "Melhor Gastronomia de Cuiabá - Restaurante & Eventos",
    thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/video-ad-thumbnail-for-brazilian-local-b-de5e4fc5-20251023110942.jpg",
    color: "from-amber-600/30 to-orange-600/30",
    youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk"
  },
  {
    id: 3,
    title: "Banco Central do Norte",
    description: "Crédito Agronegócio - Soluções Financeiras para o Campo",
    thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/corporate-video-ad-thumbnail-banco-centr-ad362c4d-20251023110941.jpg",
    color: "from-green-600/30 to-emerald-600/30",
    youtubeUrl: "https://www.youtube.com/watch?v=yWWW8JEqW3c"
  },
  {
    id: 4,
    title: "OAB Mato Grosso",
    description: "Advocacia é Missão - Ordem dos Advogados do Brasil",
    thumbnail: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c222ccad-9266-435c-a2ab-e37ad912cb72/generated_images/professional-association-video-thumbnail-17981da8-20251023110940.jpg",
    color: "from-blue-800/30 to-indigo-800/30",
    youtubeUrl: "https://www.youtube.com/watch?v=Lrj2Hq7xqQ8"
  },
];

export const VideoAdBanner = ({ label = "Publicidade em Vídeo", variant = "carousel" }: VideoAdBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<typeof videoAds[0] | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % videoAds.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + videoAds.length) % videoAds.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleVideoClick = (ad: typeof videoAds[0]) => {
    const videoId = getYouTubeVideoInfo(ad.youtubeUrl)?.videoId;
    
    if (!videoId) {
      toast.error("URL do vídeo inválida");
      return;
    }

    // Always open in modal with embedded video
    setSelectedVideo(ad);
    toast.info(`Reproduzindo: ${ad.title}`);
  };

  // Grid variant - cards layout
  if (variant === "grid") {
    return (
      <>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoAds.slice(0, 3).map((ad) => (
              <button
                key={ad.id}
                onClick={() => handleVideoClick(ad)}
                className="group relative aspect-video bg-gradient-to-br from-muted/60 to-muted/40 rounded-lg border border-border/50 overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                {/* Thumbnail Image */}
                <div className="absolute inset-0">
                  <Image
                    src={ad.thumbnail}
                    alt={ad.title}
                    fill
                    className="object-cover transition-all duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${ad.color} mix-blend-multiply opacity-40 group-hover:opacity-30 transition-opacity`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                  {/* Play Button */}
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500 transition-all shadow-lg">
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </div>

                  {/* Text Info */}
                  <div className="mt-4 space-y-1">
                    <p className="text-sm font-semibold text-white drop-shadow-lg">
                      {ad.title}
                    </p>
                    <p className="text-xs text-white/90 drop-shadow-md max-w-xs line-clamp-2">
                      {ad.description}
                    </p>
                  </div>
                </div>

                {/* Label */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                    PUBLICIDADE
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Video Dialog with YouTube Embed */}
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl p-0 bg-black border-0">
            <div className="relative aspect-video w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-2 right-2 z-50 text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
              {selectedVideo && (() => {
                const videoId = getYouTubeVideoInfo(selectedVideo.youtubeUrl)?.videoId;
                const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&origin=${typeof window !== 'undefined' ? window.location.origin : 'https://ispiai.com'}&enablejsapi=1` : null;
                
                 return embedUrl ? (
                   <iframe
                     src={embedUrl}
                     className="w-full h-full"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     title={selectedVideo.title}
                     referrerPolicy="strict-origin-when-cross-origin"
                   />
                 ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    URL do vídeo inválido
                  </div>
                );
              })()}
            </div>
            {selectedVideo && (
              <div className="p-4 bg-background">
                <h3 className="font-semibold mb-1">{selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedVideo.description}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Carousel variant
  const currentAd = videoAds[currentIndex];

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-muted/60 to-muted/40 rounded-lg border border-border/50 overflow-hidden group">
      {/* Label */}
      <div className="absolute top-3 left-3 z-10">
        <span className="text-[10px] uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
          {label}
        </span>
      </div>

      {/* Video Ad Content with Real Thumbnail */}
      <button
        onClick={() => handleVideoClick(currentAd)}
        className="absolute inset-0 transition-all duration-500 cursor-pointer"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={currentAd.thumbnail}
            alt={currentAd.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${currentAd.color} mix-blend-multiply opacity-50`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500 transition-all shadow-xl">
              <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
            </div>
            <div className="space-y-2">
              <p className="text-xl text-white font-bold drop-shadow-lg">
                {currentAd.title}
              </p>
              <p className="text-sm text-white/90 drop-shadow-md max-w-md mx-auto">
                {currentAd.description}
              </p>
            </div>
          </div>
        </div>
      </button>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {videoAds.map((ad, index) => (
          <button
            key={ad.id}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir para vídeo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};