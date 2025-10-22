"use client";

import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";

interface VideoAdBannerProps {
  label?: string;
  variant?: "carousel" | "grid";
}

const videoAds = [
  {
    id: 1,
    title: "Kaique Mendes",
    description: "A gente tem reunido boa notícia dia dia",
    thumbnail: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=600&fit=crop",
    color: "from-blue-500/20 to-cyan-500/20",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 2,
    title: "Nota Cuiabá",
    description: "Volta como melhor para a cidade",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
    color: "from-purple-500/20 to-pink-500/20",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "Banco Central do Norte",
    description: "A riqueza produção aumentou",
    thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=600&fit=crop",
    color: "from-green-500/20 to-emerald-500/20",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 4,
    title: "OAB Mato Grosso",
    description: "Mais do que profissão, a advocacia é missão",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
    color: "from-orange-500/20 to-red-500/20",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
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
                className="group relative aspect-video bg-gradient-to-br from-muted/60 to-muted/40 rounded-lg border border-border/50 overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.02]"
              >
                {/* Thumbnail Image */}
                <div className="absolute inset-0">
                  <Image
                    src={ad.thumbnail}
                    alt={ad.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${ad.color} mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                  {/* Play Button */}
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </div>

                  {/* Text Info */}
                  <div className="mt-4 space-y-1">
                    <p className="text-sm font-semibold text-white drop-shadow-lg">
                      {ad.title}
                    </p>
                    <p className="text-xs text-white/90 drop-shadow-md max-w-xs">
                      {ad.description}
                    </p>
                  </div>
                </div>

                {/* Label */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] uppercase tracking-wider text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                    PUBLICIDADE
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Video Dialog */}
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
              {selectedVideo && (
                <iframe
                  src={selectedVideo.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
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

  // Carousel variant (original)
  const currentAd = videoAds[currentIndex];

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-muted/60 to-muted/40 rounded-lg border border-border/50 overflow-hidden group">
      {/* Label */}
      <div className="absolute top-3 left-3 z-10">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 bg-background/80 px-2 py-0.5 rounded-full">
          {label}
        </span>
      </div>

      {/* Video Ad Content with Gradient Background */}
      <button
        onClick={() => handleVideoClick(currentAd)}
        className={`absolute inset-0 bg-gradient-to-br ${currentAd.color} transition-all duration-500 cursor-pointer`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Play className="w-10 h-10 text-primary" fill="currentColor" />
            </div>
            <div className="space-y-2">
              <p className="text-lg text-foreground font-semibold">
                {currentAd.title}
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
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
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
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
                ? "bg-primary w-8"
                : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
            }`}
            aria-label={`Ir para vídeo ${index + 1}`}
          />
        ))}
      </div>

      {/* Play button hover effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};