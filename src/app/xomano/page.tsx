import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot } from "lucide-react";

export default function XomanoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Portal
          </Button>
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-12 h-12 text-[#0EA5E9]" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] bg-clip-text text-transparent">
            XomanoAI
          </h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground text-lg">
            Assistente inteligente baseado no protocolo AG-UI para experiência personalizada com HITL (Human-in-the-Loop).
          </p>
          <p className="text-muted-foreground mt-4">
            O XomanoAI é seu companheiro inteligente no portal IspiAI, oferecendo:
          </p>
          <ul className="text-muted-foreground mt-4 space-y-2">
            <li>Resumos personalizados de notícias</li>
            <li>Análise contextual de eventos</li>
            <li>Recomendações baseadas em seus interesses</li>
            <li>Interação natural e conversacional</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
