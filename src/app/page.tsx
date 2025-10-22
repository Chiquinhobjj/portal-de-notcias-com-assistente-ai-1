"use client";

import { useState } from "react";
import NewsHeader from "@/components/NewsHeader";
import CategoryFilter from "@/components/CategoryFilter";
import NewsCard from "@/components/NewsCard";
import { AdBanner } from "@/components/AdBanner";
import { VideoAdBanner } from "@/components/VideoAdBanner";
import { Badge } from "@/components/ui/badge";
import { Clock, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const heroArticle = {
  id: "1",
  title: "OpenAI lança navegador Atlas com IA para desafiar Chrome",
  description: "Navegador integra ChatGPT e modo agente que executa tarefas automaticamente, derrubando ações da Alphabet em 3% após o anúncio.",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
  category: "Tecnologia",
  source: "TechCrunch",
  timestamp: "há 45 segundos",
  sources: 53,
};

const newsArticles = [
  {
    id: "2",
    title: "Meta corta 600 empregos de IA no Superintelligence Labs",
    description: "Empresa reestrutura divisão de pesquisa em inteligência artificial.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    category: "Tecnologia",
    source: "Bloomberg",
    timestamp: "há 31 minutos",
    sources: 31,
  },
  {
    id: "3",
    title: "Google em negociações com Anthropic sobre acordo de nuvem no valor de dezenas de bilhões",
    description: "Parceria estratégica pode transformar o mercado de IA corporativa.",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&h=600&fit=crop",
    category: "Tecnologia",
    source: "Reuters",
    timestamp: "há 47 minutos",
    sources: 47,
  },
  {
    id: "4",
    title: "A IA pode tornar civilizações alienígenas indetectáveis",
    description: "Pesquisadores sugerem que inteligência artificial avançada pode explicar o paradoxo de Fermi.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop",
    category: "Ciência",
    source: "Nature",
    timestamp: "há 37 minutos",
    sources: 37,
  },
  {
    id: "5",
    title: "Apple apela de decisão de desacato sobre comissões da App Store",
    description: "Disputa legal continua sobre taxas cobradas de desenvolvedores.",
    image: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=800&h=600&fit=crop",
    category: "Tecnologia",
    source: "The Verge",
    timestamp: "há 26 minutos",
    sources: 42,
  },
  {
    id: "6",
    title: "Microsoft planeja 4.000 vagas de empregos em centro de expansão de dados",
    description: "Investimento bilionário em infraestrutura de nuvem e IA.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    category: "Tecnologia",
    source: "CNBC",
    timestamp: "há 21 minutos",
    sources: 21,
  },
  {
    id: "7",
    title: "Cientistas chineses estendem vida útil de bateria de lítio para 9.000 horas",
    description: "Avanço pode revolucionar veículos elétricos e armazenamento de energia.",
    image: "https://images.unsplash.com/photo-1609880173800-711f2738ff1e?w=800&h=600&fit=crop",
    category: "Ciência",
    source: "Science Daily",
    timestamp: "há 3 horas",
    sources: 55,
  },
  {
    id: "8",
    title: "Alibaba revela modelos de IA para desafiar o GPT-5",
    description: "Nova família de modelos Qwen promete performance superior em múltiplas tarefas.",
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=600&fit=crop",
    category: "Tecnologia",
    source: "TechCrunch",
    timestamp: "há 41 minutos",
    sources: 41,
  },
  {
    id: "9",
    title: "Ouro e prata despencam na queda mais acentuada desde 2013",
    description: "Metais preciosos sofrem com fortalecimento do dólar e mudanças na política monetária.",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=600&fit=crop",
    category: "Finanças",
    source: "Financial Times",
    timestamp: "há 44 minutos",
    sources: 44,
  },
];

const featuredNews = [
  {
    id: "10",
    title: "DeepSeek revela modelo OCR com compressão de texto 20x",
    description: "Modelo de código aberto processa mais de 200.000 páginas diariamente em uma única GPU.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
    category: "Tecnologia",
    source: "ArXiv",
    timestamp: "Publicado 21 de out. de 2025",
    sources: 36,
  },
  {
    id: "11",
    title: "Nasa reabre contrato lunar devido a atrasos da SpaceX",
    description: "Agência espacial busca alternativas para missão Artemis após cronograma revisado.",
    image: "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?w=1200&h=600&fit=crop",
    category: "Ciência",
    source: "Space.com",
    timestamp: "há 18 horas",
    sources: 50,
  },
];

export default function Home() {
  // Combine all articles for FastNews
  const allArticles = [heroArticle, ...newsArticles, ...featuredNews];

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader articles={allArticles} />
      <CategoryFilter />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Top Banner Ad - Horizontal */}
        <div className="mb-8">
          <AdBanner variant="horizontal" size="medium" />
        </div>

        {/* Hero Section - New Layout: 1 Large Left + 3 Horizontal Right */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Hero Article - Takes 2 columns */}
            <div className="lg:col-span-2">
              <NewsCard {...heroArticle} variant="hero" />
            </div>
            
            {/* 3 Horizontal Articles with Image on Right */}
            <div className="flex flex-col gap-4">
              {newsArticles.slice(0, 3).map((article) => (
                <Link 
                  key={article.id} 
                  href={`/article/${article.id}`}
                  className="group flex gap-3 bg-card rounded-lg border hover:border-primary/50 transition-all overflow-hidden"
                >
                  {/* Content on Left */}
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
                  
                  {/* Square Image on Right */}
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
          </div>
        </div>

        {/* Ad Banner after Hero */}
        <div className="mb-8">
          <AdBanner variant="horizontal" size="small" />
        </div>

        {/* Top Stories - Mixed Layout with Sidebar Ad */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsArticles.slice(3, 6).map((article) => (
              <NewsCard key={article.id} {...article} variant="standard" />
            ))}
          </div>
          <div className="lg:col-span-1">
            <AdBanner variant="vertical" size="large" label="Anúncio" />
          </div>
        </div>

        {/* Featured Row - Horizontal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {newsArticles.slice(6, 8).map((article) => (
            <NewsCard key={article.id} {...article} variant="compact" />
          ))}
        </div>

        {/* Video Ad Section - Dedicated Line */}
        <div className="mb-8 py-4">
          <div className="text-center mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Publicidade em Vídeo
            </h3>
          </div>
          <VideoAdBanner />
        </div>

        {/* Main Content Grid with Square Ad */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {newsArticles.slice(0, 2).map((article) => (
            <NewsCard key={article.id} {...article} variant="standard" />
          ))}
          <div className="flex items-start">
            <AdBanner variant="square" size="large" />
          </div>
          <NewsCard {...newsArticles[2]} variant="standard" />
        </div>

        {/* Horizontal Ad */}
        <div className="mb-8">
          <AdBanner variant="horizontal" size="small" />
        </div>

        {/* Destaques Section with Sidebar Ad */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Destaques</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredNews.map((article) => (
                <NewsCard key={article.id} {...article} variant="compact" />
              ))}
            </div>
            <div className="lg:col-span-1">
              <AdBanner variant="vertical" size="large" label="Patrocinado" />
            </div>
          </div>
        </div>

        {/* More Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {newsArticles.slice(3, 6).map((article) => (
            <NewsCard key={`more-${article.id}`} {...article} variant="standard" />
          ))}
        </div>

        {/* Mid-content Banner */}
        <div className="mb-8">
          <AdBanner variant="horizontal" size="medium" />
        </div>

        {/* Final Compact Section with Inline Ads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {newsArticles.slice(6, 8).map((article) => (
            <NewsCard key={`final-${article.id}`} {...article} variant="compact" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <AdBanner variant="square" size="medium" />
          {newsArticles.slice(0, 2).map((article) => (
            <NewsCard key={`final2-${article.id}`} {...article} variant="compact" />
          ))}
        </div>

        {/* Bottom Banner Ad */}
        <div className="mb-8">
          <AdBanner variant="horizontal" size="large" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4 bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] bg-clip-text text-transparent">IspiAI</h3>
              <p className="text-sm text-muted-foreground">
                Portal mundial que começa por Mato Grosso. Ispia o que importa com notícias rápidas e IA contextual.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tecnologia & Ciência</li>
                <li>Finanças</li>
                <li>Esportes</li>
                <li>Entretenimento</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sobre</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Quem Somos</li>
                <li>Contato</li>
                <li>Transparência Editorial</li>
                <li>Privacidade</li>
                <li>Termos de Uso</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">XomanoAI</h4>
              <p className="text-sm text-muted-foreground">
                Assistente inteligente baseado no protocolo AG-UI para experiência personalizada com HITL.
              </p>
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