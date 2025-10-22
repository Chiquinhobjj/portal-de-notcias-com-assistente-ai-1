"use client";

import { useState, useEffect } from "react";
import { X, ChevronUp, ChevronDown, Share2, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

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

interface SponsoredCard {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  advertiser: string;
}

interface FastNewsProps {
  articles: FastNewsArticle[];
  isOpen: boolean;
  onClose: () => void;
}

// Sponsored content cards
const sponsoredCards: SponsoredCard[] = [
  {
    id: "sp1",
    title: "Impulsione seu Negócio com IA",
    description: "Descubra como empresas estão aumentando produtividade em 300% com automação inteligente.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    ctaText: "Saiba Mais",
    ctaUrl: "#",
    advertiser: "TechSolutions Inc",
  },
  {
    id: "sp2",
    title: "Invista no Futuro Digital",
    description: "Carteira diversificada de criptomoedas com gestão profissional e segurança garantida.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    ctaText: "Começar Agora",
    ctaUrl: "#",
    advertiser: "CryptoVest",
  },
  {
    id: "sp3",
    title: "Transforme Dados em Decisões",
    description: "Plataforma de analytics com IA que prevê tendências de mercado antes da concorrência.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    ctaText: "Teste Grátis",
    ctaUrl: "#",
    advertiser: "DataInsights Pro",
  },
];

export const FastNews = ({ articles, isOpen, onClose }: FastNewsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookmarked-articles");
    if (saved) {
      setBookmarkedIds(JSON.parse(saved));
    }
  }, []);

  // Insert sponsored cards every 5 articles
  const contentItems = articles.reduce<(FastNewsArticle | SponsoredCard)[]>((acc, article, index) => {
    acc.push(article);
    if ((index + 1) % 5 === 0 && sponsoredCards[Math.floor((index + 1) / 5 - 1) % sponsoredCards.length]) {
      acc.push(sponsoredCards[Math.floor((index + 1) / 5 - 1) % sponsoredCards.length]);
    }
    return acc;
  }, []);

  const currentItem = contentItems[currentIndex];
  const isSponsored = currentItem && 'advertiser' in currentItem;
  const isBookmarked = currentItem && 'id' in currentItem && bookmarkedIds.includes(currentItem.id);

  const goToNext = () => {
    if (currentIndex < contentItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShare = async () => {
    if (!currentItem) return;
    
    const shareData = {
      title: currentItem.title,
      text: currentItem.description,
      url: window.location.origin + ('id' in currentItem ? `/article/${currentItem.id}` : '#'),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Compartilhado com sucesso!");
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          fallbackShare();
        }
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    if (!currentItem) return;
    const url = window.location.origin + ('id' in currentItem ? `/article/${currentItem.id}` : '#');
    navigator.clipboard.writeText(url);
    toast.success("Link copiado para a área de transferência!");
  };

  const handleBookmark = () => {
    if (!currentItem || !('id' in currentItem)) return;
    
    const articleId = currentItem.id;
    let newBookmarks: string[];
    
    if (bookmarkedIds.includes(articleId)) {
      newBookmarks = bookmarkedIds.filter(id => id !== articleId);
      toast.success("Removido dos favoritos");
    } else {
      newBookmarks = [...bookmarkedIds, articleId];
      toast.success("Adicionado aos favoritos!");
    }
    
    setBookmarkedIds(newBookmarks);
    localStorage.setItem("bookmarked-articles", JSON.stringify(newBookmarks));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        goToNext();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        goToPrevious();
      }
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
    if (touchStart - touchEnd > 75) {
      goToNext();
    }

    if (touchStart - touchEnd < -75) {
      goToPrevious();
    }
  };

  // Mouse wheel navigation
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      goToNext();
    } else if (e.deltaY < 0) {
      goToPrevious();
    }
  };

  if (!isOpen || !currentItem) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image - Full Screen */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ 
          backgroundImage: `url(${currentItem.image})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* Top Header - Minimal */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSponsored ? (
            <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
              PATROCINADO
            </span>
          ) : (
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
              {'category' in currentItem ? currentItem.category : ''}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Progress Bar - Stories Style */}
      <div className="absolute top-16 left-0 right-0 z-20 px-4">
        <div className="flex gap-1">
          {contentItems.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  index < currentIndex ? "w-full" : index === currentIndex ? "w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Stories/TikTok Style */}
      <div className="relative h-full flex items-end justify-center pb-32 px-6">
        <div className="relative z-10 max-w-2xl w-full animate-fade-in">
          {isSponsored ? (
            // Sponsored Content
            <div className="space-y-4">
              <div className="text-xs text-white/70 uppercase tracking-wider">
                {'advertiser' in currentItem ? currentItem.advertiser : ''}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-2xl">
                {currentItem.title}
              </h1>
              <p className="text-xl text-white/95 leading-relaxed drop-shadow-lg">
                {currentItem.description}
              </p>
              <div className="flex items-center gap-3 pt-4">
                <a
                  href={'ctaUrl' in currentItem ? currentItem.ctaUrl : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => toast.info("Link patrocinado aberto")}
                >
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-lg font-bold shadow-xl bg-white text-black hover:bg-white/90"
                  >
                    {'ctaText' in currentItem ? currentItem.ctaText : 'Saiba Mais'}
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            // News Content
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-2xl">
                {currentItem.title}
              </h1>
              <p className="text-xl text-white/95 leading-relaxed drop-shadow-lg">
                {currentItem.description}
              </p>
              <div className="flex items-center gap-3 text-sm text-white/80 pt-2">
                <span className="font-semibold">{'source' in currentItem ? currentItem.source : ''}</span>
                <span>•</span>
                <span>{'timestamp' in currentItem ? currentItem.timestamp : ''}</span>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Link href={`/article/${'id' in currentItem ? currentItem.id : ''}`} onClick={onClose}>
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-lg font-bold shadow-xl bg-white text-black hover:bg-white/90"
                  >
                    Ler Completo
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleShare}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleBookmark}
                  className={`w-12 h-12 rounded-full backdrop-blur-sm border-white/20 text-white hover:bg-white/20 ${
                    isBookmarked ? 'bg-primary/30' : 'bg-white/10'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Zones - TikTok Style (Invisible tap areas) */}
      <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={goToPrevious} />
      <div className="absolute inset-y-0 right-0 w-2/3 z-10" onClick={goToNext} />

      {/* Side Navigation Buttons - Hidden but accessible */}
      <div className="absolute right-4 bottom-1/2 translate-y-1/2 flex flex-col gap-3 z-20 opacity-0 hover:opacity-100 transition-opacity">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="rounded-full w-12 h-12 bg-white/10 backdrop-blur-md border-white/20 text-white disabled:opacity-20"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          disabled={currentIndex === contentItems.length - 1}
          className="rounded-full w-12 h-12 bg-white/10 backdrop-blur-md border-white/20 text-white disabled:opacity-20"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
      </div>

      {/* Counter - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 text-white/70 text-sm font-medium">
        {currentIndex + 1} / {contentItems.length}
      </div>
    </div>
  );
};