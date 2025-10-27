"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  FileVideo, 
  Newspaper,
  Users,
  Calendar
} from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalArticles: number;
  totalVideos: number;
  totalUsers: number;
  viewsGrowth: number;
  clicksGrowth: number;
  topContent: Array<{
    title: string;
    views: number;
    type: string;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
  contentByCategory: Array<{
    category: string;
    count: number;
  }>;
  contentTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
}

const COLORS = ['#0EA5E9', '#0C4A6E', '#3B82F6', '#1D4ED8', '#2563EB'];

export default function AnalyticsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin/analytics");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        } else {
          console.error("Error fetching analytics");
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchAnalytics();
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

  if (loading) {
    return (
      <AdminLayout
        title="Analytics"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Analytics" },
        ]}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Analytics"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Analytics" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Estatísticas e métricas do site
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Visualizações"
            value={analytics?.totalViews.toLocaleString() || "0"}
            icon={Eye}
            trend={{
              value: analytics?.viewsGrowth || 0,
              label: "vs mês anterior",
              positive: (analytics?.viewsGrowth || 0) > 0,
            }}
          />
          <StatsCard
            title="Cliques em Anúncios"
            value={analytics?.totalClicks.toLocaleString() || "0"}
            icon={MousePointer}
            trend={{
              value: analytics?.clicksGrowth || 0,
              label: "vs mês anterior",
              positive: (analytics?.clicksGrowth || 0) > 0,
            }}
          />
          <StatsCard
            title="Artigos"
            value={analytics?.totalArticles || "0"}
            icon={Newspaper}
          />
          <StatsCard
            title="Vídeos"
            value={analytics?.totalVideos || "0"}
            icon={FileVideo}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Visualizações ao Longo do Tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.viewsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Content by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Conteúdo por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.contentByCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0EA5E9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Content Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Distribuição de Tipos de Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.contentTypeDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(analytics?.contentTypeDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Content */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Conteúdos Mais Vistos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(analytics?.topContent || []).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm truncate max-w-xs">
                          {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.type}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {item.views.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
