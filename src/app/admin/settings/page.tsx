"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Database, Link as LinkIcon, Code } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Config {
  key: string;
  value: string;
  description: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [configs, setConfigs] = useState<Record<string, Config>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/admin/settings");
    }
  }, [session, isPending, router]);

  const fetchConfigs = async () => {
    try {
      const res = await fetch("/api/admin/config");
      if (!res.ok) throw new Error("Falha ao carregar configurações");
      
      const data = await res.json();
      const configsMap: Record<string, Config> = {};
      data.forEach((config: Config) => {
        configsMap[config.key] = config;
      });
      setConfigs(configsMap);
    } catch (error) {
      console.error("Error fetching configs:", error);
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchConfigs();
    }
  }, [session]);

  const handleSave = async (key: string, value: string, description?: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/config/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, description }),
      });

      if (!res.ok) throw new Error("Falha ao salvar configuração");

      toast.success("Configuração salva com sucesso");
      fetchConfigs();
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Erro ao salvar configuração");
    } finally {
      setSaving(false);
    }
  };

  const updateConfigValue = (key: string, value: string) => {
    setConfigs({
      ...configs,
      [key]: {
        ...configs[key],
        key,
        value,
        description: configs[key]?.description || null,
      },
    });
  };

  if (isPending || loading || !session?.user) {
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
              <h1 className="text-2xl font-bold">Configurações</h1>
              <p className="text-sm text-muted-foreground">Ajustes do sistema e configurações gerais</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">
                ← Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Site Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#0EA5E9]" />
                Configurações do Site
              </CardTitle>
              <CardDescription>
                Configure informações básicas do portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome do Site</Label>
                <Input
                  value={configs.site_name?.value ? JSON.parse(configs.site_name.value).name : ""}
                  onChange={(e) => {
                    const current = configs.site_name?.value 
                      ? JSON.parse(configs.site_name.value) 
                      : { name: "", domain: "" };
                    updateConfigValue(
                      "site_name",
                      JSON.stringify({ ...current, name: e.target.value })
                    );
                  }}
                  placeholder="Portal de Notícias"
                />
              </div>
              <div>
                <Label>Domínio</Label>
                <Input
                  value={configs.site_name?.value ? JSON.parse(configs.site_name.value).domain : ""}
                  onChange={(e) => {
                    const current = configs.site_name?.value 
                      ? JSON.parse(configs.site_name.value) 
                      : { name: "", domain: "" };
                    updateConfigValue(
                      "site_name",
                      JSON.stringify({ ...current, domain: e.target.value })
                    );
                  }}
                  placeholder="portal.example.com"
                />
              </div>
              <Button
                onClick={() => {
                  if (configs.site_name) {
                    handleSave("site_name", configs.site_name.value, "Site name and domain configuration");
                  }
                }}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações do Site
              </Button>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-[#0EA5E9]" />
                SEO e Metadados
              </CardTitle>
              <CardDescription>
                Configure metadados para otimização de busca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título Padrão</Label>
                <Input
                  value={configs.seo_config?.value ? JSON.parse(configs.seo_config.value).defaultTitle : ""}
                  onChange={(e) => {
                    const current = configs.seo_config?.value 
                      ? JSON.parse(configs.seo_config.value) 
                      : { defaultTitle: "", defaultDescription: "", keywords: "" };
                    updateConfigValue(
                      "seo_config",
                      JSON.stringify({ ...current, defaultTitle: e.target.value })
                    );
                  }}
                  placeholder="Portal de Notícias - Últimas Notícias"
                />
              </div>
              <div>
                <Label>Descrição Padrão</Label>
                <Textarea
                  value={configs.seo_config?.value ? JSON.parse(configs.seo_config.value).defaultDescription : ""}
                  onChange={(e) => {
                    const current = configs.seo_config?.value 
                      ? JSON.parse(configs.seo_config.value) 
                      : { defaultTitle: "", defaultDescription: "", keywords: "" };
                    updateConfigValue(
                      "seo_config",
                      JSON.stringify({ ...current, defaultDescription: e.target.value })
                    );
                  }}
                  placeholder="Seu portal de notícias com cobertura completa"
                  rows={3}
                />
              </div>
              <div>
                <Label>Palavras-chave</Label>
                <Input
                  value={configs.seo_config?.value ? JSON.parse(configs.seo_config.value).keywords : ""}
                  onChange={(e) => {
                    const current = configs.seo_config?.value 
                      ? JSON.parse(configs.seo_config.value) 
                      : { defaultTitle: "", defaultDescription: "", keywords: "" };
                    updateConfigValue(
                      "seo_config",
                      JSON.stringify({ ...current, keywords: e.target.value })
                    );
                  }}
                  placeholder="notícias, brasil, tecnologia, esportes"
                />
              </div>
              <Button
                onClick={() => {
                  if (configs.seo_config) {
                    handleSave("seo_config", configs.seo_config.value, "SEO meta tags configuration");
                  }
                }}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações de SEO
              </Button>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-[#0EA5E9]" />
                Redes Sociais
              </CardTitle>
              <CardDescription>
                Configure links para redes sociais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Facebook</Label>
                <Input
                  value={configs.social_media?.value ? JSON.parse(configs.social_media.value).facebook : ""}
                  onChange={(e) => {
                    const current = configs.social_media?.value 
                      ? JSON.parse(configs.social_media.value) 
                      : { facebook: "", twitter: "", instagram: "" };
                    updateConfigValue(
                      "social_media",
                      JSON.stringify({ ...current, facebook: e.target.value })
                    );
                  }}
                  placeholder="https://facebook.com/portal"
                />
              </div>
              <div>
                <Label>Twitter / X</Label>
                <Input
                  value={configs.social_media?.value ? JSON.parse(configs.social_media.value).twitter : ""}
                  onChange={(e) => {
                    const current = configs.social_media?.value 
                      ? JSON.parse(configs.social_media.value) 
                      : { facebook: "", twitter: "", instagram: "" };
                    updateConfigValue(
                      "social_media",
                      JSON.stringify({ ...current, twitter: e.target.value })
                    );
                  }}
                  placeholder="https://twitter.com/portal"
                />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input
                  value={configs.social_media?.value ? JSON.parse(configs.social_media.value).instagram : ""}
                  onChange={(e) => {
                    const current = configs.social_media?.value 
                      ? JSON.parse(configs.social_media.value) 
                      : { facebook: "", twitter: "", instagram: "" };
                    updateConfigValue(
                      "social_media",
                      JSON.stringify({ ...current, instagram: e.target.value })
                    );
                  }}
                  placeholder="https://instagram.com/portal"
                />
              </div>
              <Button
                onClick={() => {
                  if (configs.social_media) {
                    handleSave("social_media", configs.social_media.value, "Social media links");
                  }
                }}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Redes Sociais
              </Button>
            </CardContent>
          </Card>

          {/* Database Info */}
          <Card>
            <CardHeader>
              <CardTitle>Banco de Dados</CardTitle>
              <CardDescription>
                Acesse o estúdio do banco de dados para gerenciar dados diretamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Você pode gerenciar seu banco de dados através da aba "Database Studio" localizada no topo da página, ao lado da aba "Analytics".
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
