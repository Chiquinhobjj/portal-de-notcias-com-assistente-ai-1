import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacidadePage() {
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
          Política de Privacidade
        </h1>
        
        <p className="text-lg text-muted-foreground">
          Esta página está em desenvolvimento. Em breve você encontrará nossa política de privacidade aqui.
        </p>
      </div>
    </div>
  );
}
