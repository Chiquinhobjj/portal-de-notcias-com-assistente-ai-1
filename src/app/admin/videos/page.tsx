"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import VideoPreview from "@/components/admin/VideoPreview";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, Play } from "lucide-react";
import { toast } from "sonner";

interface Video {
  id: number;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  categories: Array<{ id: number; name: string }>; // Array de categorias
  duration: string;
  views: number;
  likes: number;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function VideosPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    video: Video | null;
  }>({ open: false, video: null });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin/videos");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/admin/videos");
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []);
        } else {
          // Dados mockados para teste
                 const mockVideos: Video[] = [
                   {
                     id: 1,
                     title: "Vídeo de Teste 1",
                     description: "Descrição do vídeo de teste",
                     youtubeUrl: "https://youtube.com/watch?v=test1",
                     thumbnailUrl: "",
                     categories: [
                       { id: 5, name: "Tecnologia" },
                       { id: 1, name: "Notícias" }
                     ],
                     duration: "5:30",
                     views: 1000,
                     likes: 50,
                     status: "published",
                     publishedAt: new Date().toISOString(),
                     createdAt: new Date().toISOString(),
                     updatedAt: new Date().toISOString(),
                   },
                   {
                     id: 2,
                     title: "Vídeo de Teste 2",
                     description: "Descrição do vídeo de teste 2",
                     youtubeUrl: "https://youtube.com/watch?v=test2",
                     thumbnailUrl: "",
                     categories: [
                       { id: 4, name: "Entretenimento" },
                       { id: 9, name: "Cultura" }
                     ],
                     duration: "3:45",
                     views: 500,
                     likes: 25,
                     status: "draft",
                     publishedAt: "",
                     createdAt: new Date().toISOString(),
                     updatedAt: new Date().toISOString(),
                   }
                 ];
          setVideos(mockVideos);
          toast.error("Erro ao carregar vídeos - usando dados de teste");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        // Dados mockados para teste
               const mockVideos: Video[] = [
                 {
                   id: 1,
                   title: "Vídeo de Teste 1",
                   description: "Descrição do vídeo de teste",
                   youtubeUrl: "https://youtube.com/watch?v=test1",
                   thumbnailUrl: "",
                   categories: [
                     { id: 5, name: "Tecnologia" },
                     { id: 1, name: "Notícias" }
                   ],
                   duration: "5:30",
                   views: 1000,
                   likes: 50,
                   status: "published",
                   publishedAt: new Date().toISOString(),
                   createdAt: new Date().toISOString(),
                   updatedAt: new Date().toISOString(),
                 }
               ];
        setVideos(mockVideos);
        toast.error("Erro ao carregar vídeos - usando dados de teste");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchVideos();
    }
  }, [session]);

  const handleDelete = async (video: Video) => {
    try {
      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVideos(prev => prev.filter(v => v.id !== video.id));
        toast.success("Vídeo excluído com sucesso");
      } else {
        toast.error("Erro ao excluir vídeo");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Erro ao excluir vídeo");
    }
  };

  const handlePublish = async (video: Video) => {
    try {
      const response = await fetch(`/api/admin/videos/${video.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: video.status === "published" ? "draft" : "published" 
        }),
      });

      if (response.ok) {
        setVideos(prev => prev.map(v => 
          v.id === video.id 
            ? { ...v, status: v.status === "published" ? "draft" : "published" }
            : v
        ));
        toast.success(
          video.status === "published" 
            ? "Vídeo movido para rascunho" 
            : "Vídeo publicado com sucesso"
        );
      } else {
        toast.error("Erro ao alterar status do vídeo");
      }
    } catch (error) {
      console.error("Error updating video status:", error);
      toast.error("Erro ao alterar status do vídeo");
    }
  };

  const columns = [
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (value: any, row: Video) => (
        <VideoPreview
          youtubeUrl={row.youtubeUrl}
          thumbnailUrl={row.thumbnailUrl}
          className="w-20 h-12"
          showStats={false}
          showPlayButton={false}
        />
      ),
    },
    {
      key: "title",
      label: "Título",
      sortable: true,
      render: (value: string, row: Video) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {row.categories.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "youtubeUrl",
      label: "YouTube URL",
      render: (value: string) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
        >
          Ver no YouTube
        </a>
      ),
    },
    {
      key: "views",
      label: "Visualizações",
      sortable: true,
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: "likes",
      label: "Curtidas",
      sortable: true,
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "publishedAt",
      label: "Publicado em",
      sortable: true,
      render: (value: string) => 
        value ? new Date(value).toLocaleDateString("pt-BR") : "Não publicado",
    },
  ];

  const actions = [
    {
      label: "Publicar/Despublicar",
      onClick: handlePublish,
      icon: <Play className="h-4 w-4" />,
    },
  ];

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
      title="Gerenciar Vídeos"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Vídeos" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vídeos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os vídeos do IspiAI TV
            </p>
          </div>
          <Button onClick={() => router.push("/admin/videos/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Vídeo
          </Button>
        </div>

        {/* Videos Table */}
        <DataTable
          data={videos}
          columns={columns}
          searchPlaceholder="Buscar vídeos..."
          onEdit={(video) => router.push(`/admin/videos/${video.id}`)}
          onDelete={(video) => setDeleteDialog({ open: true, video })}
          onView={(video) => window.open(video.youtubeUrl, '_blank')}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhum vídeo encontrado"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, video: null })}
        title="Excluir Vídeo"
        description={`Tem certeza que deseja excluir o vídeo "${deleteDialog.video?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="destructive"
        onConfirm={() => {
          if (deleteDialog.video) {
            handleDelete(deleteDialog.video);
          }
        }}
      />
    </AdminLayout>
  );
}
