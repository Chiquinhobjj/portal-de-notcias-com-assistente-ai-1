"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Edit, Trash2, Play } from "lucide-react";
import { toast } from "sonner";

interface Playlist {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlaylistsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    playlist: Playlist | null;
  }>({ open: false, playlist: null });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin/playlists");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("/api/admin/playlists");
        if (response.ok) {
          const data = await response.json();
          setPlaylists(data.playlists || []);
        } else {
          // Dados mockados para teste
          const mockPlaylists: Playlist[] = [
            {
              id: 1,
              title: "Playlist de Teste 1",
              description: "Descrição da playlist de teste",
              thumbnailUrl: "",
              videoCount: 5,
              status: "active",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 2,
              title: "Playlist de Teste 2",
              description: "Descrição da playlist de teste 2",
              thumbnailUrl: "",
              videoCount: 3,
              status: "inactive",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ];
          setPlaylists(mockPlaylists);
          toast.error("Erro ao carregar playlists - usando dados de teste");
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
        // Dados mockados para teste
        const mockPlaylists: Playlist[] = [
          {
            id: 1,
            title: "Playlist de Teste 1",
            description: "Descrição da playlist de teste",
            thumbnailUrl: "",
            videoCount: 5,
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ];
        setPlaylists(mockPlaylists);
        toast.error("Erro ao carregar playlists - usando dados de teste");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchPlaylists();
    }
  }, [session]);

  const handleDelete = async (playlist: Playlist) => {
    try {
      const response = await fetch(`/api/admin/playlists/${playlist.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPlaylists(prev => prev.filter(p => p.id !== playlist.id));
        toast.success("Playlist excluída com sucesso");
      } else {
        toast.error("Erro ao excluir playlist");
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Erro ao excluir playlist");
    }
  };

  const handleToggleStatus = async (playlist: Playlist) => {
    try {
      const response = await fetch(`/api/admin/playlists/${playlist.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: playlist.status === "active" ? "inactive" : "active" 
        }),
      });

      if (response.ok) {
        setPlaylists(prev => prev.map(p => 
          p.id === playlist.id 
            ? { ...p, status: p.status === "active" ? "inactive" : "active" }
            : p
        ));
        toast.success(
          playlist.status === "active" 
            ? "Playlist desativada" 
            : "Playlist ativada"
        );
      } else {
        toast.error("Erro ao alterar status da playlist");
      }
    } catch (error) {
      console.error("Error updating playlist status:", error);
      toast.error("Erro ao alterar status da playlist");
    }
  };

  const columns = [
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (value: string, row: Playlist) => (
        <div className="w-20 h-12 bg-muted rounded-lg overflow-hidden">
          <img
            src={row.thumbnailUrl}
            alt={row.title}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Título",
      sortable: true,
      render: (value: string, row: Playlist) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.videoCount} vídeos</div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Descrição",
      render: (value: string) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {value}
        </div>
      ),
    },
    {
      key: "videoCount",
      label: "Vídeos",
      sortable: true,
      render: (value: number) => value.toString(),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: "createdAt",
      label: "Criado em",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString("pt-BR"),
    },
  ];

  const actions = [
    {
      label: "Ativar/Desativar",
      onClick: handleToggleStatus,
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
      title="Gerenciar Playlists"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Playlists" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Playlists</h1>
            <p className="text-muted-foreground">
              Gerencie todas as playlists do IspiAI TV
            </p>
          </div>
          <Button onClick={() => router.push("/admin/playlists/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Playlist
          </Button>
        </div>

        {/* Playlists Table */}
        <DataTable
          data={playlists}
          columns={columns}
          searchPlaceholder="Buscar playlists..."
          onEdit={(playlist) => router.push(`/admin/playlists/${playlist.id}`)}
          onDelete={(playlist) => setDeleteDialog({ open: true, playlist })}
          onView={(playlist) => router.push(`/admin/playlists/${playlist.id}`)}
          actions={actions}
          loading={loading}
          emptyMessage="Nenhuma playlist encontrada"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, playlist: null })}
        title="Excluir Playlist"
        description={`Tem certeza que deseja excluir a playlist "${deleteDialog.playlist?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="destructive"
        onConfirm={() => {
          if (deleteDialog.playlist) {
            handleDelete(deleteDialog.playlist);
          }
        }}
      />
    </AdminLayout>
  );
}
