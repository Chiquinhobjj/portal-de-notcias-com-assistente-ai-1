"use client";

import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VideoAdBannerProps {
  label?: string;
}

const videoAds = [
  {
    id: 1,
    title: "Anúncio Premium 1",
    description: "Descubra as melhores ofertas em tecnologia",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 2,
    title: "Anúncio Premium 2",
    description: "Soluções empresariais para o seu negócio",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: 3,
    title: "Anúncio Premium 3",
    description: "Inovação e qualidade ao seu alcance",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: 4,
    title: "Anúncio Premium 4",
    description: "Transforme sua experiência digital",
    color: "from-orange-500/20 to-red-500/20",
  },
];

export const VideoAdBanner = ({ label = "Publicidade em Vídeo" }: VideoAdBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % videoAds.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + videoAds.length) % videoAds.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

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
      <div className={`absolute inset-0 bg-gradient-to-br ${currentAd.color} transition-all duration-500`}>
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
      </div>

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