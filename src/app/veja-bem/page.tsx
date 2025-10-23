import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NewsHeader from "@/components/NewsHeader";
import { AdBanner } from "@/components/AdBanner";

export default function VejaBemPage() {
  return (
    <div className="min-h-screen bg-background">
      <NewsHeader articles={[]} />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Portal
          </Button>
        </Link>
        
        {/* Top Banner Ad */}
        <div className="mb-8">
          <AdBanner variant="horizontal" size="medium" />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] bg-clip-text text-transparent">
              Veja Bem
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Esta página está em desenvolvimento. Em breve você encontrará todos os destaques aqui.
            </p>

            <div className="mb-8">
              <AdBanner variant="horizontal" size="small" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <AdBanner variant="vertical" size="large" label="Anúncio" />
            </div>
          </div>
        </div>

        {/* Bottom Banner Ad */}
        <div className="mt-12">
          <AdBanner variant="horizontal" size="large" />
        </div>
      </div>
    </div>
  );
}