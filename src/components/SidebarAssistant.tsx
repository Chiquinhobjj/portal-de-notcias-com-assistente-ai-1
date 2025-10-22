"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MessageSquare, Send, Sparkles, RotateCcw, ThumbsUp, ThumbsDown, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SidebarAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SidebarAssistant({ open, onOpenChange }: SidebarAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Sou o XomanoAI, seu assistente inteligente de notícias. Como posso ajudá-lo hoje? Posso resumir artigos, explicar tópicos complexos, montar dossiês com referências ou planejar coberturas.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AG-UI protocol integration
    // In production, this would connect to the AG-UI protocol endpoint
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Compreendi sua pergunta sobre "${input}". Baseado no protocolo AG-UI com padrão HITL (human-in-the-loop), estou processando sua solicitação e buscando as informações mais relevantes.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleReset = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Olá! Sou o XomanoAI, seu assistente inteligente de notícias. Como posso ajudá-lo hoje?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0C4A6E]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <SheetTitle className="text-xl bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] bg-clip-text text-transparent">XomanoAI</SheetTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                title="Nova conversa"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Protocolo AG-UI com HITL (Human-in-the-Loop)
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] text-white"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span className="text-xs">Útil</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        <span className="text-xs">Não útil</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Pergunte sobre as notícias..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon" disabled={!input.trim()} className="bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E]">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Protocolo AG-UI • HITL • IspiAI
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}