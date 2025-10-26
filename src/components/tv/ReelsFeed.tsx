"use client";

import { useEffect, useRef, useState } from "react";
import { Video } from "@/types/video";
import { getYouTubeVideoInfo } from "@/lib/youtube-utils";

interface ReelsFeedProps {
  videos: Video[];
  initialIndex?: number;
  onVideoChange?: (index: number) => void;
}

export default function ReelsFeed({ videos, initialIndex = 0, onVideoChange }: ReelsFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Scroll to initial index
  useEffect(() => {
    if (feedRef.current && initialIndex !== undefined) {
      const targetElement = feedRef.current.children[initialIndex] as HTMLElement;
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "instant" });
        setCurrentIndex(initialIndex);
      }
    }
  }, [initialIndex]);

  // Reset play button when changing videos
  useEffect(() => {
    setShowPlayButton(true);
  }, [currentIndex]);

  // Intersection Observer para autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoIndex = Array.from(feedRef.current?.children || []).indexOf(entry.target);
          
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setCurrentIndex(videoIndex);
            // Só reproduz automaticamente se o usuário já interagiu
            if (userInteracted) {
              setPlayingVideo(videoIndex);
            }
            onVideoChange?.(videoIndex);
          } else {
            setPlayingVideo(null);
          }
        });
      },
      {
        threshold: [0, 0.6, 1],
        rootMargin: "-10% 0px -10% 0px"
      }
    );

    const videoElements = feedRef.current?.children;
    if (videoElements) {
      Array.from(videoElements).forEach((element) => {
        observer.observe(element);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [videos, onVideoChange, userInteracted]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        
        const newIndex = (() => {
          switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
              return Math.min(currentIndex + 1, videos.length - 1);
            case 'ArrowUp':
            case 'PageUp':
              return Math.max(currentIndex - 1, 0);
            case 'Home':
              return 0;
            case 'End':
              return videos.length - 1;
            default:
              return currentIndex;
          }
        })();

        if (newIndex !== currentIndex) {
          const targetElement = feedRef.current?.children[newIndex] as HTMLElement;
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  const handleVideoClick = (index: number) => {
    setUserInteracted(true);
    setShowPlayButton(false);
    setPlayingVideo(index);
    
    const targetElement = feedRef.current?.children[index] as HTMLElement;
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div
      ref={feedRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {videos.map((video, index) => {
        const videoId = getYouTubeVideoInfo(video.youtubeUrl)?.videoId;
        const isCurrentVideo = currentIndex === index;
        const shouldAutoplay = playingVideo === index && userInteracted;
        
        const embedUrl = videoId 
          ? `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&controls=0&loop=1&playlist=${videoId}&origin=${typeof window !== 'undefined' ? window.location.origin : 'https://ispiai.com'}&enablejsapi=1&playsinline=1`
          : null;

        return (
          <div
            key={video.id}
            className="h-screen w-full snap-start snap-always relative bg-black flex items-center justify-center"
            onClick={() => handleVideoClick(index)}
          >
            {/* Video Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{
                    border: "none",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 text-white">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-medium">Vídeo não disponível</p>
                  <p className="text-sm opacity-70">{video.title}</p>
                </div>
              )}
            </div>

            {/* Video Info Overlay */}
            <div className="absolute bottom-20 left-4 right-20 text-white z-10">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                {video.title}
              </h2>
              <p className="text-sm opacity-90 line-clamp-3">
                {video.description}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs opacity-70">
                <span>{video.views.toLocaleString()} visualizações</span>
                <span>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Audio Control Button */}
            {isCurrentVideo && userInteracted && (
              <div className="absolute top-20 right-4 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMuteToggle();
                  }}
                  className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  {isMuted ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  )}
                </button>
              </div>
            )}

            {/* Play/Pause Indicator - Always show for current video until user interacts */}
            {isCurrentVideo && (!userInteracted || playingVideo !== index) && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVideoClick(index);
                }}
              >
                <div className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200 flex items-center justify-center shadow-2xl hover:scale-110">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="absolute bottom-8 text-white text-sm font-medium">
                  Clique para reproduzir (sem áudio inicialmente)
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
