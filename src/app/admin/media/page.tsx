"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Copy, Trash2, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: number;
  title: string;
  url: string;
  type: "image" | "video";
  size?: number;
  uploadedBy: string;
  createdAt: string;
}

export default function MediaPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialog, setUploadDialog] = useState(false);
  const [newMedia, setNewMedia] = useState({
    title: "",
    url: "",
    type: "image" as "image" | "video",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin/media");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch("/api/admin/media");
        if (response.ok) {
          const data = await response.json();
          setMediaItems(data.media || []);
        } else {
          toast.error("Erro ao carregar mídia");
        }
      } catch (error) {
        console.error("Error fetching media:", error);
        toast.error("Erro ao carregar mídia");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchMedia();
    }
  }, [session]);

  const handleUpload = async () => {
    if (!newMedia.title || !newMedia.url) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMedia),
      });

      if (response.ok) {
        const data = await response.json();
        setMediaItems(prev => [data.media, ...prev]);
        setNewMedia({ title: "", url: "", type: "image" });
        setUploadDialog(false);
        toast.success("Mídia adicionada com sucesso!");
      } else {
        toast.error("Erro ao adicionar mídia");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Erro ao adicionar mídia");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMediaItems(prev => prev.filter(item => item.id !== id));
        toast.success("Mídia excluída com sucesso");
      } else {
        toast.error("Erro ao excluir mídia");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Erro ao excluir mídia");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiada para a área de transferência");
  };

  const filteredMedia = mediaItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
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
    <AdminLayout
      title="Galeria de Mídia"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Mídia" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Galeria de Mídia</h1>
            <p className="text-muted-foreground">
              Gerencie imagens e vídeos do site
            </p>
          </div>
          <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Mídia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Mídia</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newMedia.title}
                    onChange={(e) => setNewMedia(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nome da mídia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newMedia.url}
                    onChange={(e) => setNewMedia(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    value={newMedia.type}
                    onChange={(e) => setNewMedia(prev => ({ ...prev, type: e.target.value as "image" | "video" }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="image">Imagem</option>
                    <option value="video">Vídeo</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpload} className="flex-1">
                    Adicionar
                  </Button>
                  <Button variant="outline" onClick={() => setUploadDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mídia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Actions overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyUrl(item.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Type indicator */}
                    <div className="absolute top-2 left-2">
                      {item.type === "image" ? (
                        <ImageIcon className="h-4 w-4 text-white" />
                      ) : (
                        <Video className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm truncate">{item.title}</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(item.size)}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {filteredMedia.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma mídia encontrada</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
