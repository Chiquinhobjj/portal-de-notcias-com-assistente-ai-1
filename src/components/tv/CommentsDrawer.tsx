"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: number;
}

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: number | null;
  videoTitle?: string;
}

export default function CommentsDrawer({ isOpen, onClose, videoId, videoTitle }: CommentsDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load comments when drawer opens
  useEffect(() => {
    if (isOpen && videoId) {
      loadComments();
    }
  }, [isOpen, videoId]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const loadComments = async () => {
    if (!videoId) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/videos/${videoId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        // Fallback to mock comments
        setComments([
          {
            id: 1,
            author: "Usuário123",
            text: "Muito bom esse vídeo! 👏",
            timestamp: Date.now() - 3600000
          },
          {
            id: 2,
            author: "Maria_Silva",
            text: "Adorei a explicação, muito clara!",
            timestamp: Date.now() - 1800000
          },
          {
            id: 3,
            author: "João_Pedro",
            text: "Quando sai a próxima parte?",
            timestamp: Date.now() - 900000
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !videoId) return;

    const comment: Comment = {
      id: Date.now(),
      author: "Você",
      text: newComment.trim(),
      timestamp: Date.now()
    };

    try {
      const res = await fetch(`/api/videos/${videoId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: comment.text
        })
      });

      if (res.ok) {
        setComments(prev => [...prev, comment]);
        setNewComment("");
      } else {
        // Fallback: add to local state
        setComments(prev => [...prev, comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Fallback: add to local state
      setComments(prev => [...prev, comment]);
      setNewComment("");
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "agora";
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-black/95 backdrop-blur-sm border-l border-white/10 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-semibold">Comentários</h3>
            {videoTitle && (
              <p className="text-white/70 text-sm truncate max-w-xs">
                {videoTitle}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70">Seja o primeiro a comentar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#0C4A6E] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">
                      {comment.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm">
                        {comment.author}
                      </span>
                      <span className="text-white/50 text-xs">
                        {formatTime(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Comment Form */}
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <Input
              ref={inputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
              maxLength={240}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newComment.trim()}
              className="bg-[#0EA5E9] hover:bg-[#0C4A6E] text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
