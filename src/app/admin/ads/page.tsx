"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, MoreVertical, Edit, Trash2, Eye, MousePointer, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Ad {
  id: number;
  title: string;
  type: string;
  variant: string;
  size: string;
  position: string;
  status: string;
  clicks: number;
  impressions: number;
  startDate: string | null;
  endDate: string | null;
  contentUrl: string;
  linkUrl: string | null;
}

export default function AdsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "banner",
    variant: "horizontal",
    size: "medium",
    contentUrl: "",
    linkUrl: "",
    position: "top",
    status: "active",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin/ads");
    }
  }, [session, isPending, router]);

  const fetchAds = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("type", typeFilter);
      
      const res = await fetch(`/api/admin/ads?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Falha ao carregar anúncios");
      
      const data = await res.json();
      setAds(data || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
      toast.error("Erro ao carregar anúncios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchAds();
    }
  }, [session, typeFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch(`/api/admin/ads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Falha ao excluir anúncio");

      toast.success("Anúncio excluído com sucesso");
      fetchAds();
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast.error("Erro ao excluir anúncio");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("bearer_token");
      const url = editingAd 
        ? `/api/admin/ads/${editingAd.id}`
        : "/api/admin/ads";
      
      const method = editingAd ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Falha ao salvar anúncio");
      }

      toast.success(editingAd ? "Anúncio atualizado com sucesso" : "Anúncio criado com sucesso");
      setDialogOpen(false);
      setEditingAd(null);
      setFormData({
        title: "",
        type: "banner",
        variant: "horizontal",
        size: "medium",
        contentUrl: "",
        linkUrl: "",
        position: "top",
        status: "active",
        startDate: "",
        endDate: "",
      });
      fetchAds();
    } catch (error: any) {
      console.error("Error saving ad:", error);
      toast.error(error.message || "Erro ao salvar anúncio");
    }
  };

  const openEditDialog = (ad: Ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      type: ad.type,
      variant: ad.variant,
      size: ad.size,
      contentUrl: ad.contentUrl,
      linkUrl: ad.linkUrl || "",
      position: ad.position,
      status: ad.status,
      startDate: ad.startDate ? ad.startDate.split("T")[0] : "",
      endDate: ad.endDate ? ad.endDate.split("T")[0] : "",
    });
    setDialogOpen(true);
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
              <h1 className="text-2xl font-bold">Gerenciar Anúncios</h1>
              <p className="text-sm text-muted-foreground">Criar e gerenciar banners e vídeos publicitários</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  ← Voltar ao Dashboard
                </Button>
              </Link>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2" onClick={() => setEditingAd(null)}>
                    <Plus className="h-4 w-4" />
                    Novo Anúncio
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingAd ? "Editar Anúncio" : "Novo Anúncio"}</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes do anúncio
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="type">Tipo *</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="banner">Banner</SelectItem>
                              <SelectItem value="video">Vídeo</SelectItem>
                              <SelectItem value="square">Quadrado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="variant">Variante *</Label>
                          <Select
                            value={formData.variant}
                            onValueChange={(value) => setFormData({ ...formData, variant: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="horizontal">Horizontal</SelectItem>
                              <SelectItem value="vertical">Vertical</SelectItem>
                              <SelectItem value="square">Quadrado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="size">Tamanho *</Label>
                          <Select
                            value={formData.size}
                            onValueChange={(value) => setFormData({ ...formData, size: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Pequeno</SelectItem>
                              <SelectItem value="medium">Médio</SelectItem>
                              <SelectItem value="large">Grande</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="contentUrl">URL do Conteúdo (Imagem/Vídeo) *</Label>
                        <Input
                          id="contentUrl"
                          type="url"
                          value={formData.contentUrl}
                          onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                          placeholder="https://exemplo.com/banner.jpg"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="linkUrl">URL de Destino (opcional)</Label>
                        <Input
                          id="linkUrl"
                          type="url"
                          value={formData.linkUrl}
                          onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                          placeholder="https://exemplo.com"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="position">Posição *</Label>
                          <Select
                            value={formData.position}
                            onValueChange={(value) => setFormData({ ...formData, position: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="top">Topo</SelectItem>
                              <SelectItem value="sidebar">Lateral</SelectItem>
                              <SelectItem value="middle">Meio</SelectItem>
                              <SelectItem value="bottom">Rodapé</SelectItem>
                              <SelectItem value="grid">Grid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="status">Status *</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="paused">Pausado</SelectItem>
                              <SelectItem value="scheduled">Agendado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Data Início (opcional)</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="endDate">Data Fim (opcional)</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingAd ? "Salvar Alterações" : "Criar Anúncio"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("all")}
              >
                Todos
              </Button>
              <Button
                variant={typeFilter === "banner" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("banner")}
              >
                Banners
              </Button>
              <Button
                variant={typeFilter === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("video")}
              >
                Vídeos
              </Button>
              <Button
                variant={typeFilter === "square" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("square")}
              >
                Quadrados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Anúncios ({ads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : ads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum anúncio encontrado
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Posição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Métricas</TableHead>
                    <TableHead>Agendamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {ad.variant} • {ad.size}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ad.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ad.position}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={ad.status === "active" ? "default" : "outline"}
                        >
                          {ad.status === "active" ? "Ativo" : ad.status === "paused" ? "Pausado" : "Agendado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Eye className="h-3 w-3" />
                            {ad.impressions.toLocaleString()} impressões
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <MousePointer className="h-3 w-3" />
                            {ad.clicks.toLocaleString()} cliques
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ad.startDate || ad.endDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {ad.startDate && new Date(ad.startDate).toLocaleDateString('pt-BR')}
                              {ad.endDate && ` - ${new Date(ad.endDate).toLocaleDateString('pt-BR')}`}
                            </span>
                          </div>
                        ) : (
                          "Sem agendamento"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(ad)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(ad.id)}
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
