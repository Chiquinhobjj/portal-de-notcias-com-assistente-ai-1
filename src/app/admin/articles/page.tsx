"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  views: number;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function ArticlesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin/articles");
    }
  }, [session, isPending, router]);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const res = await fetch(`/api/admin/articles?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Falha ao carregar artigos");
      
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Erro ao carregar artigos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchArticles();
    }
  }, [session, search, statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Falha ao excluir artigo");

      toast.success("Artigo excluído com sucesso");
      fetchArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Erro ao excluir artigo");
    }
  };

  const handlePublish = async (id: number, action: "publish" | "unpublish") => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch(`/api/admin/articles/${id}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Falha ao ${action === "publish" ? "publicar" : "despublicar"} artigo`);

      toast.success(`Artigo ${action === "publish" ? "publicado" : "despublicado"} com sucesso`);
      fetchArticles();
    } catch (error) {
      console.error(`Error ${action}ing article:`, error);
      toast.error(`Erro ao ${action === "publish" ? "publicar" : "despublicar"} artigo`);
    }
  };

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
              <h1 className="text-2xl font-bold">Gerenciar Artigos</h1>
              <p className="text-sm text-muted-foreground">Criar e gerenciar notícias e conteúdo</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  ← Voltar ao Dashboard
                </Button>
              </Link>
              <Link href="/admin/articles/new">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Artigo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar artigos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === "published" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("published")}
                >
                  Publicados
                </Button>
                <Button
                  variant={statusFilter === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("draft")}
                >
                  Rascunhos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Artigos ({articles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum artigo encontrado
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-muted-foreground">/{article.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{article.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={article.status === "published" ? "default" : "outline"}
                        >
                          {article.status === "published" ? "Publicado" : "Rascunho"}
                        </Badge>
                        {article.featured && (
                          <Badge variant="outline" className="ml-2">
                            Destaque
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          {article.views}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/articles/${article.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            {article.status === "published" ? (
                              <DropdownMenuItem onClick={() => handlePublish(article.id, "unpublish")}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Despublicar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handlePublish(article.id, "publish")}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Publicar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => window.open(`/article/${article.id}`, "_blank")}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(article.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
