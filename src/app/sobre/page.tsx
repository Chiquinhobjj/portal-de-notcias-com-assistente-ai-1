import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Portal
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] bg-clip-text text-transparent">
          Quem Somos
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground">
            O IspiAI é um portal de notícias inovador que une jornalismo de qualidade com tecnologia de inteligência artificial.
          </p>
          <p className="text-muted-foreground mt-4">
            Portal mundial que começa por Mato Grosso. Ispia o que importa com notícias rápidas e IA contextual.
          </p>
        </div>
      </div>
    </div>
  );
}
