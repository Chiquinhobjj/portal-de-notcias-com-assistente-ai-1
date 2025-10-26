"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, FileVideo, Tag, Settings, TrendingUp, Eye, MousePointer, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: { total: 20, published: 15, draft: 5 },
    ads: { total: 10, active: 8, paused: 2 },
    categories: 8,
    views: 51925,
    clicks: 2538,
  });
  const [loading, setLoading] = useState(false);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatsCard
            title="Total de Artigos"
            value={loading ? "..." : stats.articles.total}
            description={`${stats.articles.published} publicados • ${stats.articles.draft} rascunhos`}
            icon={Newspaper}
          />
          <StatsCard
            title="Anúncios"
            value={loading ? "..." : stats.ads.total}
            description={`${stats.ads.active} ativos • ${stats.ads.paused} pausados`}
            icon={FileVideo}
          />
          <StatsCard
            title="Visualizações"
            value={loading ? "..." : stats.views.toLocaleString()}
            description="Total de visualizações"
            icon={Eye}
          />
          <StatsCard
            title="Cliques em Anúncios"
            value={loading ? "..." : stats.clicks.toLocaleString()}
            description="Total de cliques"
            icon={MousePointer}
          />
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
          
          <Link href="/admin/videos">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <FileVideo className="h-8 w-8 text-[#0EA5E9] mb-2" />
                <CardTitle>Vídeos</CardTitle>
                <CardDescription>Gerenciar vídeos do IspiAI TV</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/playlists">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <Tag className="h-8 w-8 text-[#0EA5E9] mb-2" />
                <CardTitle>Playlists</CardTitle>
                <CardDescription>Organizar vídeos em playlists</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/media">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <Plus className="h-8 w-8 text-[#0EA5E9] mb-2" />
                <CardTitle>Mídia</CardTitle>
                <CardDescription>Galeria de imagens e vídeos</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/analytics">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-[#0EA5E9] mb-2" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Estatísticas e métricas</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link href="/admin/users">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <Settings className="h-8 w-8 text-[#0EA5E9] mb-2" />
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Gerenciar usuários</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* MCP & A2A Info */}
        <Card>
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
      </div>
    </AdminLayout>
  );
}
