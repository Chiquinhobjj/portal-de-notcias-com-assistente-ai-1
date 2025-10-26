"use client";

import NewsHeader from "@/components/NewsHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Sparkles,
  TrendingUp,
  Zap,
  MessageSquare,
  Search,
  Filter,
  Tv,
  BookOpen,
  Target,
  Users,
  Brain,
  Lightbulb,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] text-white">
            Portal Mundial que começa por Mato Grosso
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] bg-clip-text text-transparent">
            Ispia o que importa
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Jornalismo de qualidade potencializado por inteligência artificial. 
            Notícias rápidas, contextuais e personalizadas para você.
          </p>
        </div>

        {/* O que fazemos */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            O que fazemos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Jornalismo de Qualidade</h3>
                <p className="text-muted-foreground">
                  Cobertura completa de notícias locais e globais, com foco em Mato Grosso. 
                  Reportagens verificadas, análises profundas e múltiplas perspectivas sobre cada história.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Inteligência Artificial</h3>
                <p className="text-muted-foreground">
                  IA contextual que personaliza sua experiência, resume notícias complexas, 
                  e oferece insights relevantes através do nosso assistente XomanoAI.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Conteúdo Multiformato</h3>
                <p className="text-muted-foreground">
                  Notícias em texto, vídeos, podcasts e shorts. Consuma informação do jeito que você prefere, 
                  onde e quando quiser.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Comunidade Engajada</h3>
                <p className="text-muted-foreground">
                  Plataforma interativa onde leitores participam ativamente, compartilham opiniões 
                  e contribuem para o debate público informado.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Inovações de IA */}
        <section className="mb-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Inovações de IA no Centro
          </h2>
          
          <div className="space-y-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-3">XomanoAI - Seu Assistente Inteligente</h3>
                    <p className="text-muted-foreground mb-4">
                      Baseado no protocolo AG-UI (Agent-to-GUI), o XomanoAI é um assistente contextual 
                      que aprende suas preferências e oferece uma experiência verdadeiramente personalizada.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Resumos Inteligentes</p>
                          <p className="text-sm text-muted-foreground">Entenda notícias complexas em segundos</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Recomendações Personalizadas</p>
                          <p className="text-sm text-muted-foreground">Conteúdo adaptado aos seus interesses</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Navegação por Voz</p>
                          <p className="text-sm text-muted-foreground">Converse naturalmente para encontrar o que busca</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Contexto em Tempo Real</p>
                          <p className="text-sm text-muted-foreground">Informações complementares automáticas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <TrendingUp className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Análise Preditiva</h4>
                  <p className="text-sm text-muted-foreground">
                    IA que identifica tendências e prevê temas emergentes antes de se tornarem mainstream.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <Lightbulb className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Verificação Automática</h4>
                  <p className="text-sm text-muted-foreground">
                    Sistema de fact-checking que cruza múltiplas fontes para garantir precisão.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <MessageSquare className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">HITL (Human-in-the-Loop)</h4>
                  <p className="text-sm text-muted-foreground">
                    Combinação perfeita entre automação de IA e curadoria humana especializada.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Como Navegar */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            Como Navegar no Portal
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Página Inicial</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Feed personalizado com as notícias mais relevantes. Use os filtros de categoria 
                  (Tecnologia, Finanças, Esportes, Entretenimento) para focar no que interessa.
                </p>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="w-full">
                    Ir para Home <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">IspiAI Shorts</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Notícias rápidas em vídeo vertical. Navegue deslizando para cima/baixo 
                  ou usando as setas do teclado. Perfeito para consumo rápido.
                </p>
                <Link href="/shorts">
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver Shorts <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">IspiAI TV</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Vídeos longos, reportagens e documentários organizados em playlists temáticas. 
                  Conteúdo aprofundado quando você tem mais tempo.
                </p>
                <Link href="/tv">
                  <Button variant="ghost" size="sm" className="w-full">
                    Assistir TV <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">XomanoAI</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Clique no botão "XomanoAI" no cabeçalho para abrir o assistente. 
                  Faça perguntas, peça resumos ou navegue por comando de voz.
                </p>
                <Button variant="ghost" size="sm" className="w-full" disabled>
                  Disponível no cabeçalho
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">5</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Seções Especiais</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Explore "Opinião", "Poderes" (política), "Ultimas" (análises) e outras seções 
                  especializadas no menu ou ao rolar a página inicial.
                </p>
                <Link href="/opiniao">
                  <Button variant="ghost" size="sm" className="w-full">
                    Ver Opinião <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">6</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalização</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Crie uma conta para salvar preferências, receber recomendações personalizadas 
                  e acessar conteúdo exclusivo. Totalmente opcional.
                </p>
                <Link href="/register">
                  <Button variant="ghost" size="sm" className="w-full">
                    Criar Conta <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filosofia UX */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Filter className="h-8 w-8 text-primary" />
            Nossa Filosofia de UX
          </h2>
          
          <div className="bg-card rounded-xl p-8 border">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Usabilidade</h3>
                <p className="text-muted-foreground">
                  Interface limpa e intuitiva. Cada elemento tem um propósito claro. 
                  Navegação fluida entre diferentes formatos de conteúdo sem fricção.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Fluxo do Usuário</h3>
                <p className="text-muted-foreground">
                  Jornadas otimizadas desde a descoberta até o consumo. 
                  Transições suaves, carregamento rápido e sempre um próximo passo claro.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Intuitividade</h3>
                <p className="text-muted-foreground">
                  Não precisa de manual. Gestos naturais, ícones universais e 
                  feedback imediato. A tecnologia desaparece para destacar o conteúdo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-lg mb-8 opacity-90">
            Descubra um novo jeito de consumir notícias com inteligência artificial.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button size="lg" variant="secondary">
                Explorar Notícias
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </section>
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