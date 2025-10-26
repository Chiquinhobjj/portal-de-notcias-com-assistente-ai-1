"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Tag, MapPin } from "lucide-react";

interface ActiveFiltersProps {
  selectedTopics: string[];
  selectedStates: string[];
  selectedCities: string[];
  onRemoveTopic: (topic: string) => void;
  onRemoveState: (state: string) => void;
  onRemoveCity: (city: string) => void;
  onClearAll: () => void;
}

const TOPIC_NAMES: Record<string, string> = {
  "tecnologia": "Tecnologia & Ciência",
  "financas": "Finanças",
  "esportes": "Esportes",
  "entretenimento": "Entretenimento",
  "politica": "Política",
  "cotidiano": "Cotidiano",
  "judiciario": "Judiciário",
  "variedades": "Variedades",
  "opiniao": "Opinião",
  "policia": "Polícia",
  "mais-lidas": "As mais lidas",
  "enquete": "Enquete",
  "especiais": "Especiais",
};

const STATE_NAMES: Record<string, string> = {
  "mt": "Mato Grosso",
  "ms": "Mato Grosso do Sul",
  "sp": "São Paulo",
  "rj": "Rio de Janeiro",
  "mg": "Minas Gerais",
  "pr": "Paraná",
  "rs": "Rio Grande do Sul",
  "sc": "Santa Catarina",
  "go": "Goiás",
  "ba": "Bahia",
};

export default function ActiveFilters({
  selectedTopics,
  selectedStates,
  selectedCities,
  onRemoveTopic,
  onRemoveState,
  onRemoveCity,
  onClearAll,
}: ActiveFiltersProps) {
  const totalFilters = selectedTopics.length + selectedStates.length + selectedCities.length;

  if (totalFilters === 0) return null;

  return (
    <div className="bg-gradient-to-r from-[#0EA5E9]/10 to-[#0C4A6E]/10 rounded-lg p-4 border border-[#0EA5E9]/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-[#0EA5E9]" />
          <span className="text-sm font-semibold text-[#0EA5E9]">
            Filtros Ativos ({totalFilters})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Limpar tudo
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Tópicos */}
        {selectedTopics.map((topic) => (
          <Badge
            key={`topic-${topic}`}
            variant="secondary"
            className="bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/30"
          >
            <Tag className="h-3 w-3 mr-1" />
            {TOPIC_NAMES[topic] || topic}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveTopic(topic)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {/* Estados */}
        {selectedStates.map((state) => (
          <Badge
            key={`state-${state}`}
            variant="secondary"
            className="bg-[#0C4A6E]/20 text-[#0C4A6E] border-[#0C4A6E]/30 hover:bg-[#0C4A6E]/30"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {STATE_NAMES[state] || state}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveState(state)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {/* Cidades */}
        {selectedCities.map((city) => (
          <Badge
            key={`city-${city}`}
            variant="secondary"
            className="bg-[#075985]/20 text-[#075985] border-[#075985]/30 hover:bg-[#075985]/30"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {city}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveCity(city)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
