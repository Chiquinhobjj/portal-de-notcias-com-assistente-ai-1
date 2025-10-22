"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const TOPICS = [
  "Tecnologia",
  "Ciência",
  "Finanças",
  "Esportes",
  "Entretenimento",
  "Política",
  "Saúde",
  "Educação",
  "Meio Ambiente",
  "Negócios",
  "Cultura",
  "Mundo",
];

const REGIONS = [
  { id: "BR", name: "Brasil" },
  { id: "MT", name: "Mato Grosso" },
  { id: "MT-CUI", name: "Cuiabá" },
  { id: "MT-VGD", name: "Várzea Grande" },
  { id: "MT-ROO", name: "Rondonópolis" },
  { id: "MT-SIN", name: "Sinop" },
  { id: "MT-CGD", name: "Campo Grande" },
  { id: "CO", name: "Centro-Oeste" },
  { id: "WORLD", name: "Internacional" },
];

interface UserPreferencesProps {
  onPreferencesChange?: (preferences: {
    topics: string[];
    regions: string[];
  }) => void;
}

export function UserPreferences({ onPreferencesChange }: UserPreferencesProps) {
  const [open, setOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Carregar preferências do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user-preferences");
    if (saved) {
      const { topics, regions } = JSON.parse(saved);
      setSelectedTopics(topics || []);
      setSelectedRegions(regions || []);
    } else {
      // Valores padrão
      setSelectedTopics(["Tecnologia", "Ciência"]);
      setSelectedRegions(["BR", "MT"]);
    }
  }, []);

  // Salvar preferências
  const savePreferences = () => {
    const preferences = {
      topics: selectedTopics,
      regions: selectedRegions,
    };
    localStorage.setItem("user-preferences", JSON.stringify(preferences));
    onPreferencesChange?.(preferences);
    setOpen(false);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const toggleRegion = (regionId: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((r) => r !== regionId)
        : [...prev, regionId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="h-5 w-5" />
          {(selectedTopics.length > 0 || selectedRegions.length > 0) && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-[#0EA5E9] rounded-full" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Preferências de Notícias</DialogTitle>
          <DialogDescription>
            Escolha os tópicos e regiões que você deseja visualizar em seu feed personalizado
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* Tópicos de Interesse */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                📰 Tópicos de Interesse
                <Badge variant="secondary" className="text-xs">
                  {selectedTopics.length} selecionado(s)
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione os temas que você quer ver no seu feed
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TOPICS.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <Button
                      key={topic}
                      variant={isSelected ? "default" : "outline"}
                      className={`justify-start ${
                        isSelected
                          ? "bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E]"
                          : ""
                      }`}
                      onClick={() => toggleTopic(topic)}
                    >
                      {isSelected && <Check className="h-4 w-4 mr-2" />}
                      {topic}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Regiões de Interesse */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                📍 Localização e Regiões
                <Badge variant="secondary" className="text-xs">
                  {selectedRegions.length} selecionada(s)
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Escolha as regiões para receber notícias locais e regionais
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {REGIONS.map((region) => {
                  const isSelected = selectedRegions.includes(region.id);
                  return (
                    <Button
                      key={region.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`justify-start ${
                        isSelected
                          ? "bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E]"
                          : ""
                      }`}
                      onClick={() => toggleRegion(region.id)}
                    >
                      {isSelected && <Check className="h-4 w-4 mr-2" />}
                      {region.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Suas preferências são salvas localmente
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={savePreferences}
              className="bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E]"
            >
              Salvar Preferências
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
