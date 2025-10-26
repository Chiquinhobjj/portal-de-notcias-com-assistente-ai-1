"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import AdminLayout from "@/components/admin/AdminLayout";
import VideoPreview from "@/components/admin/VideoPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, TestTube } from "lucide-react";
import { toast } from "sonner";
import { getYouTubeVideoInfo, isValidYouTubeUrl } from "@/lib/youtube-utils";

interface VideoFormData {
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  categories: number[]; // Array de IDs das categorias
  duration: string;
  status: string;
}

const categories = [
  { id: 1, name: "Notícias" },
  { id: 2, name: "Política" },
  { id: 3, name: "Esportes" },
  { id: 4, name: "Entretenimento" },
  { id: 5, name: "Tecnologia" },
  { id: 6, name: "Economia" },
  { id: 7, name: "Saúde" },
  { id: 8, name: "Educação" },
  { id: 9, name: "Cultura" },
  { id: 10, name: "Variedades" },
];

export default function NewVideoPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [testingUrl, setTestingUrl] = useState(false);
  const [formData, setFormData] = useState<VideoFormData>({
    title: "",
    description: "",
    youtubeUrl: "",
    thumbnailUrl: "",
    categories: [], // Array vazio inicialmente
    duration: "",
    status: "draft",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin/videos/new");
    }
  }, [session, isPending, router]);

  // Usar o utilitário centralizado
  const extractVideoId = (url: string) => {
    const videoInfo = getYouTubeVideoInfo(url);
    return videoInfo?.videoId || null;
  };

  const testYouTubeUrl = async () => {
    if (!formData.youtubeUrl) {
      toast.error("Digite uma URL do YouTube");
      return;
    }

    if (!isValidYouTubeUrl(formData.youtubeUrl)) {
      toast.error("URL do YouTube inválida. Suportamos: youtube.com/watch, youtube.com/shorts, youtu.be");
      return;
    }

    const videoInfo = getYouTubeVideoInfo(formData.youtubeUrl);
    if (!videoInfo) {
      toast.error("Não foi possível processar a URL do YouTube");
      return;
    }

    setTestingUrl(true);
    try {
      // Test if the video exists by trying to fetch thumbnail
      const thumbnailUrl = videoInfo.thumbnailUrl;
      const response = await fetch(thumbnailUrl);
      
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          thumbnailUrl: thumbnailUrl,
        }));
        const typeLabel = videoInfo.type === 'shorts' ? 'Shorts' : 'Vídeo';
        toast.success(`${typeLabel} encontrado! ID: ${videoInfo.videoId}`);
      } else {
        toast.error("Vídeo não encontrado ou privado");
      }
    } catch (error) {
      toast.error("Erro ao testar URL");
    } finally {
      setTestingUrl(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.youtubeUrl || formData.categories.length === 0) {
      toast.error("Preencha todos os campos obrigatórios e selecione pelo menos uma categoria");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Vídeo criado com sucesso!");
        router.push("/admin/videos");
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao criar vídeo");
      }
    } catch (error) {
      console.error("Error creating video:", error);
      toast.error("Erro ao criar vídeo");
    } finally {
      setLoading(false);
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
    <AdminLayout
      title="Novo Vídeo"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Vídeos", href: "/admin/videos" },
        { label: "Novo" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Novo Vídeo</h1>
            <p className="text-muted-foreground">
              Adicione um novo vídeo ao IspiAI TV
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Vídeo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Digite o título do vídeo"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição do vídeo"
                      rows={4}
                    />
                  </div>

                  {/* YouTube URL */}
                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl">URL do YouTube *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="youtubeUrl"
                        value={formData.youtubeUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=... ou https://www.youtube.com/shorts/..."
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={testYouTubeUrl}
                        disabled={testingUrl}
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        {testingUrl ? "Testando..." : "Testar"}
                      </Button>
                    </div>
                    {/* Tipo de vídeo detectado */}
                    {formData.youtubeUrl && getYouTubeVideoInfo(formData.youtubeUrl) && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Tipo detectado:</span>
                        {getYouTubeVideoInfo(formData.youtubeUrl)?.type === 'shorts' ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium">
                            📱 YouTube Shorts
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                            🎥 Vídeo Normal
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail URL */}
                  <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                    <Input
                      id="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                      placeholder="URL da thumbnail (opcional)"
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <Label>Categorias *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={formData.categories.includes(category.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  categories: [...prev.categories, category.id]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  categories: prev.categories.filter(id => id !== category.id)
                                }));
                              }
                            }}
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.categories.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Selecione pelo menos uma categoria
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Ex: 5:30"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Salvando..." : "Salvar Vídeo"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.youtubeUrl ? (
                  <VideoPreview
                    youtubeUrl={formData.youtubeUrl}
                    title={formData.title}
                    thumbnailUrl={formData.thumbnailUrl}
                    duration={formData.duration}
                    views={0}
                    likes={0}
                  />
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    <p>Adicione uma URL do YouTube para ver o preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
