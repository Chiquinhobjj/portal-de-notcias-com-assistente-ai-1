"use client";

import { useState, useMemo, useEffect } from "react";
import NewsHeader from "@/components/NewsHeader";
import CategoryFilter from "@/components/CategoryFilter";
import NewsCard from "@/components/NewsCard";
import { AdBanner } from "@/components/AdBanner";
import { VideoAdBanner } from "@/components/VideoAdBanner";
import { VejaBemWidget } from "@/components/VejaBemWidget";
import { OpinionSection } from "@/components/OpinionSection";
import { PoderesSection } from "@/components/PoderesSection";
import { GeralSection } from "@/components/GeralSection";
import { PoliciaSection } from "@/components/PoliciaSection";
import { Badge } from "@/components/ui/badge";
import { Clock, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCopilotNews } from "@/hooks/useCopilotNews";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("for-you");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles?limit=20&sort=publishedAt&order=desc");
        if (!res.ok) throw new Error("Failed to fetch articles");
        
        const data = await res.json();
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Transform articles to match component format
  const transformedArticles = articles.map(article => ({
    id: article.id.toString(),
    title: article.title,
    description: article.description,
    image: article.imageUrl,
    category: article.category,
    source: article.source,
    timestamp: formatTimestamp(article.publishedAt || article.createdAt),
    sources: Math.floor(Math.random() * 50) + 10,
  }));

  // Integrate CopilotKit tools for XomanoAI
  useCopilotNews(transformedArticles, setSelectedCategory);

  const heroArticle = transformedArticles[0] || null;
  const newsArticles = transformedArticles.slice(1);

  // Filter articles based on selected category
  const filteredArticles = useMemo(() => {
    if (selectedCategory === "for-you" || selectedCategory === "all" || selectedCategory === "top") {
      return newsArticles;
    }
    
    const categoryMap: Record<string, string> = {
      tech: "Tecnologia",
      finance: "Finanças",
      sports: "Esportes",
      entertainment: "Entretenimento",
    };
    
    const targetCategory = categoryMap[selectedCategory];
    if (!targetCategory) return newsArticles;
    
    return newsArticles.filter(article => 
      article.category.toLowerCase().includes(targetCategory.toLowerCase()) ||
      targetCategory.toLowerCase().includes(article.category.toLowerCase())
    );
  }, [selectedCategory, newsArticles]);

  const displayArticles = filteredArticles.length > 0 ? filteredArticles : newsArticles;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader articles={transformedArticles} />
      <CategoryFilter onCategoryChange={setSelectedCategory} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Top Banner Ad */}
        <div className="mb-8">
          <AdBanner variant="horizontal" size="medium" />
        </div>

        {/* Hero Section */}
        {heroArticle && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <NewsCard {...heroArticle} variant="hero" />
              </div>
              
              <div className="lg:col-span-4 flex flex-col gap-4">
                {displayArticles.slice(0, 3).map((article) => (
                  <Link 
                    key={article.id} 
                    href={`/article/${article.id}`}
                    className="group flex gap-3 bg-card rounded-lg border hover:border-primary/50 transition-all overflow-hidden"
                  >
                    <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {article.category}
                        </Badge>
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                          {article.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Link2 className="w-3 h-3" />
                          <span>{article.sources} fontes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="lg:col-span-3">
                <VejaBemWidget />
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <AdBanner variant="horizontal" size="small" />
        </div>

        <OpinionSection />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayArticles.slice(3, 6).map((article) => (
              <NewsCard key={article.id} {...article} variant="standard" />
            ))}
          </div>
          <div className="lg:col-span-1">
            <AdBanner variant="vertical" size="large" label="Anúncio" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {displayArticles.slice(6, 8).map((article) => (
            <NewsCard key={article.id} {...article} variant="compact" />
          ))}
        </div>

        <PoderesSection />

        <div className="mb-8 py-4">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Publicitários</h3>
            <div className="h-0.5 bg-border w-full" />
          </div>
          <VideoAdBanner variant="grid" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {displayArticles.slice(8, 10).map((article) => (
            <NewsCard key={article.id} {...article} variant="standard" />
          ))}
          <div className="flex items-start">
            <AdBanner variant="square" size="large" />
          </div>
          {displayArticles[10] && (
            <NewsCard {...displayArticles[10]} variant="standard" />
          )}
        </div>

        <div className="mb-8">
          <AdBanner variant="horizontal" size="small" />
        </div>

        <GeralSection />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Destaques</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayArticles.slice(11, 13).map((article) => (
                <NewsCard key={article.id} {...article} variant="compact" />
              ))}
            </div>
            <div className="lg:col-span-1">
              <AdBanner variant="vertical" size="large" label="Patrocinado" />
            </div>
          </div>
        </div>

        <PoliciaSection />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {displayArticles.slice(13, 16).map((article) => (
            <NewsCard key={`more-${article.id}`} {...article} variant="standard" />
          ))}
        </div>

        <div className="mb-8">
          <AdBanner variant="horizontal" size="medium" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {displayArticles.slice(16, 18).map((article) => (
            <NewsCard key={`final-${article.id}`} {...article} variant="compact" />
          ))}
        </div>

        <div className="mb-8">
          <AdBanner variant="horizontal" size="large" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 mt-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ISPIAI_padrao-4x-1761167472574.png"
                  alt="IspiAI Logo"
                  width={120}
                  height={30}
                  className="h-8 w-auto object-contain dark:hidden"
                />
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ISPIAI_branco-4x-1761167472564.png"
                  alt="IspiAI Logo"
                  width={120}
                  height={30}
                  className="h-8 w-auto object-contain hidden dark:block"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Portal mundial que começa por Mato Grosso. Ispia o que importa com notícias rápidas e IA contextual.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/categoria/tecnologia" className="hover:text-primary transition-colors">Tecnologia & Ciência</Link></li>
                <li><Link href="/categoria/financas" className="hover:text-primary transition-colors">Finanças</Link></li>
                <li><Link href="/categoria/esportes" className="hover:text-primary transition-colors">Esportes</Link></li>
                <li><Link href="/categoria/entretenimento" className="hover:text-primary transition-colors">Entretenimento</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sobre</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/sobre" className="hover:text-primary transition-colors">Quem Somos</Link></li>
                <li><Link href="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
                <li><Link href="/transparencia" className="hover:text-primary transition-colors">Transparência Editorial</Link></li>
                <li><Link href="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link></li>
                <li><Link href="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">XomanoAI</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Assistente inteligente baseado no protocolo AG-UI para experiência personalizada com HITL.
              </p>
              <Link href="/xomano" className="text-sm text-primary hover:underline">
                Saiba mais →
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 IspiAI. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper function to format timestamp
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "há poucos segundos";
  if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
  if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
  
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}