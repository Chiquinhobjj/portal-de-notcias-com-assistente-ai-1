"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, FileVideo, Tag, Settings, TrendingUp, Eye, MousePointer } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0, draft: 0 },
    ads: { total: 0, active: 0, paused: 0 },
    categories: 0,
    views: 0,
    clicks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("bearer_token");
        
        // Fetch articles stats
        const articlesRes = await fetch("/api/admin/articles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const articlesData = await articlesRes.json();
        
        // Fetch ads stats
        const adsRes = await fetch("/api/admin/ads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const adsData = await adsRes.json();
        
        // Fetch categories
        const categoriesRes = await fetch("/api/admin/categories");
        const categoriesData = await categoriesRes.json();

        const articles = articlesData.articles || [];
        const ads = adsData || [];

        setStats({
          articles: {
            total: articles.length,
            published: articles.filter((a: any) => a.status === "published").length,
            draft: articles.filter((a: any) => a.status === "draft").length,
          },
          ads: {
            total: ads.length,
            active: ads.filter((a: any) => a.status === "active").length,
            paused: ads.filter((a: any) => a.status === "paused").length,
          },
          categories: categoriesData.length,
          views: articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0),
          clicks: ads.reduce((sum: number, a: any) => sum + (a.clicks || 0), 0),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  if (isPending || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] bg-clip-text text-transparent">
                Painel Administrativo
              </h1>
              <p className="text-sm text-muted-foreground">Gerenciamento de Conteúdo IspiAI</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Voltar ao Site
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] flex items-center justify-center text-white text-sm font-medium">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium">{session.user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Artigos</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.articles.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.articles.published} publicados • {stats.articles.draft} rascunhos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Anúncios</CardTitle>
              <FileVideo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.ads.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.ads.active} ativos • {stats.ads.paused} pausados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.views.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total de visualizações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cliques em Anúncios</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.clicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total de cliques</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/articles">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <Newspaper className="h-8 w-8 text-[#0EA5E9] mb-2" />
                <CardTitle>Artigos</CardTitle>
                <CardDescription>Gerenciar notícias e conteúdo</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/ads">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <FileVideo className="h-8 w-8 text-[#0EA5E9] mb-2" />
                <CardTitle>Anúncios</CardTitle>
                <CardDescription>Gerenciar banners e vídeos</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/categories">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <Tag className="h-8 w-8 text-[#0EA5E9] mb-2" />
                <CardTitle>Categorias</CardTitle>
                <CardDescription>Organizar conteúdo por categorias</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <Settings className="h-8 w-8 text-[#0EA5E9] mb-2" />
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Ajustes do sistema</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* MCP & A2A Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#0EA5E9]" />
              Protocolos de Integração
            </CardTitle>
            <CardDescription>APIs disponíveis para agentes e integrações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">MCP Protocol (Model Context Protocol)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Endpoint para consultas de IA e agentes inteligentes
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded">POST /api/mcp/query</code>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">A2A Protocol (Agent-to-Agent)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Sincronização entre agentes e sistemas externos
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded">POST /api/a2a/sync</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
