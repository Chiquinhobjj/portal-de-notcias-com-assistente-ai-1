"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { Video } from "@/types/video";

interface VideoActionsProps {
  video: Video;
  onLike: () => void;
  onComments: () => void;
  onShare: () => void;
}

export default function VideoActions({ video, onLike, onComments, onShare }: VideoActionsProps) {
  const [liked, setLiked] = useState(video.liked || false);
  const [likesCount, setLikesCount] = useState(video.views || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    onLike();
  };

  return (
    <div className="fixed right-4 bottom-20 z-20 flex flex-col items-center gap-4">
      {/* Avatar do canal */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#0C4A6E] flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-black"></div>
      </div>

      {/* Botão de curtir */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLike}
          className={`w-12 h-12 rounded-full ${
            liked 
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
              : 'bg-black/30 text-white hover:bg-black/50'
          } backdrop-blur-sm`}
        >
          <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
        </Button>
        <span className="text-xs text-white font-medium">
          {likesCount.toLocaleString()}
        </span>
      </div>

      {/* Botão de comentários */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onComments}
          className="w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <span className="text-xs text-white font-medium">
          {Math.floor(Math.random() * 50)} {/* Mock comments count */}
        </span>
      </div>

      {/* Botão de compartilhar */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onShare}
          className="w-12 h-12 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
        >
          <Share2 className="w-6 h-6" />
        </Button>
        <span className="text-xs text-white font-medium">
          Compartilhar
        </span>
      </div>
    </div>
  );
}
