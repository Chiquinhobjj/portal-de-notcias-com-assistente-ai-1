"use client";

import { useState, useEffect } from "react";
import { X, ChevronUp, ChevronDown, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FastNewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  source: string;
  timestamp: string;
  sources: number;
}

interface FastNewsProps {
  articles: FastNewsArticle[];
  isOpen: boolean;
  onClose: () => void;
}

export const FastNews = ({ articles, isOpen, onClose }: FastNewsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const currentArticle = articles[currentIndex];

  const goToNext = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goToNext();
      if (e.key === "ArrowUp") goToPrevious();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, isOpen]);

  // Touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      goToNext();
    }

    if (touchStart - touchEnd < -150) {
      goToPrevious();
    }
  };

  // Mouse wheel navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      goToNext();
    } else if (e.deltaY < 0) {
      goToPrevious();
    }
  };

  if (!isOpen || !currentArticle) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background via-background/95 to-transparent backdrop-blur-sm p-6 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] bg-clip-text text-transparent">
            Ispiai em 30s
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              {currentIndex + 1}
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">
              {articles.length}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-background/80 rounded-full"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center pt-24 pb-32">
        {/* Background Image with Enhanced Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${currentArticle.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 backdrop-blur-[2px]" />
        </div>

        {/* Content Card with Better Visibility */}
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="bg-background/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-8 md:p-12 space-y-6 animate-fade-in">
            {/* Category Badge */}
            <div className="flex items-center justify-center">
              <span className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg">
                {currentArticle.category}
              </span>
            </div>

            {/* Title - More Prominent */}
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-center text-foreground">
              {currentArticle.title}
            </h1>

            {/* Description - Better Contrast */}
            <p className="text-lg md:text-xl text-foreground/90 text-center leading-relaxed font-medium">
              {currentArticle.description}
            </p>

            {/* Meta Info - Enhanced */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground pt-4 border-t border-border/50">
              <span className="font-semibold text-foreground">{currentArticle.source}</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{currentArticle.timestamp}</span>
              <span className="text-muted-foreground/50">•</span>
              <span className="font-semibold text-primary">{currentArticle.sources} fontes</span>
            </div>

            {/* Action Buttons - More Prominent */}
            <div className="flex items-center justify-center gap-3 pt-6">
              <Link href={`/article/${currentArticle.id}`}>
                <Button 
                  size="lg" 
                  className="px-10 py-6 text-lg font-bold shadow-xl bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] hover:from-[#0C4A6E] hover:to-[#0EA5E9]"
                >
                  Ler Matéria Completa
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="icon"
                className="w-12 h-12 rounded-full shadow-lg bg-background/90 backdrop-blur-sm"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="w-12 h-12 rounded-full shadow-lg bg-background/90 backdrop-blur-sm"
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Controls - Enhanced */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="rounded-full w-14 h-14 bg-background/90 backdrop-blur-md shadow-xl border-2 disabled:opacity-30"
          >
            <ChevronUp className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            disabled={currentIndex === articles.length - 1}
            className="rounded-full w-14 h-14 bg-background/90 backdrop-blur-md shadow-xl border-2 disabled:opacity-30"
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Indicator - Enhanced */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-16 rounded-full transition-all shadow-lg ${
                index === currentIndex
                  ? "bg-gradient-to-b from-[#0EA5E9] to-[#0C4A6E] scale-110"
                  : index < currentIndex
                  ? "bg-primary/50"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Hint - Enhanced */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-center animate-bounce">
        <div className="bg-background/80 backdrop-blur-md rounded-full px-6 py-3 border border-border/50 shadow-lg">
          <p className="text-sm font-semibold text-foreground">
            Use ↑ ↓ ou deslize para navegar
          </p>
        </div>
      </div>
    </div>
  );
};