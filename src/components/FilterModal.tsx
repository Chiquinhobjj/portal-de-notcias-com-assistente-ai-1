"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  X,
  MapPin,
  Tag,
  TrendingUp,
  Star,
  Check,
} from "lucide-react";

interface FilterModalProps {
  selectedTopics: string[];
  selectedStates: string[];
  selectedCities: string[];
  onTopicsChange: (topics: string[]) => void;
  onStatesChange: (states: string[]) => void;
  onCitiesChange: (cities: string[]) => void;
  onApplyFilters: () => void;
}

const TOPICS = [
  { id: "tecnologia", name: "Tecnologia & Ciência", icon: "🔬" },
  { id: "financas", name: "Finanças", icon: "💰" },
  { id: "esportes", name: "Esportes", icon: "⚽" },
  { id: "entretenimento", name: "Entretenimento", icon: "🎬" },
  { id: "politica", name: "Política", icon: "🏛️" },
  { id: "cotidiano", name: "Cotidiano", icon: "🏠" },
  { id: "judiciario", name: "Judiciário", icon: "⚖️" },
  { id: "variedades", name: "Variedades", icon: "🎭" },
  { id: "opiniao", name: "Opinião", icon: "💭" },
  { id: "policia", name: "Polícia", icon: "🚔" },
  { id: "mais-lidas", name: "As mais lidas", icon: "📈" },
  { id: "enquete", name: "Enquete", icon: "📊" },
  { id: "especiais", name: "Especiais", icon: "⭐" },
];

const BRAZILIAN_STATES = [
  { id: "mt", name: "Mato Grosso", cities: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"] },
  { id: "ms", name: "Mato Grosso do Sul", cities: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"] },
  { id: "sp", name: "São Paulo", cities: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba"] },
  { id: "rj", name: "Rio de Janeiro", cities: ["Rio de Janeiro", "Niterói", "Campos dos Goytacazes", "Petrópolis", "Volta Redonda"] },
  { id: "mg", name: "Minas Gerais", cities: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"] },
  { id: "pr", name: "Paraná", cities: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"] },
  { id: "rs", name: "Rio Grande do Sul", cities: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"] },
  { id: "sc", name: "Santa Catarina", cities: ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma"] },
  { id: "go", name: "Goiás", cities: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"] },
  { id: "ba", name: "Bahia", cities: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro"] },
];

export default function FilterModal({
  selectedTopics,
  selectedStates,
  selectedCities,
  onTopicsChange,
  onStatesChange,
  onCitiesChange,
  onApplyFilters,
}: FilterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempTopics, setTempTopics] = useState(selectedTopics);
  const [tempStates, setTempStates] = useState(selectedStates);
  const [tempCities, setTempCities] = useState(selectedCities);
  const [searchCity, setSearchCity] = useState("");

  const toggleTopic = (topicId: string) => {
    setTempTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const toggleState = (stateId: string) => {
    setTempStates(prev =>
      prev.includes(stateId)
        ? prev.filter(id => id !== stateId)
        : [...prev, stateId]
    );
  };

  const toggleCity = (cityName: string) => {
    setTempCities(prev =>
      prev.includes(cityName)
        ? prev.filter(name => name !== cityName)
        : [...prev, cityName]
    );
  };

  const handleApply = () => {
    onTopicsChange(tempTopics);
    onStatesChange(tempStates);
    onCitiesChange(tempCities);
    onApplyFilters();
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempTopics([]);
    setTempStates([]);
    setTempCities([]);
  };

  const getAvailableCities = () => {
    if (tempStates.length === 0) return [];
    return tempStates.flatMap(stateId => {
      const state = BRAZILIAN_STATES.find(s => s.id === stateId);
      return state ? state.cities : [];
    });
  };

  const filteredCities = getAvailableCities().filter(city =>
    city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const totalFilters = tempTopics.length + tempStates.length + tempCities.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {totalFilters > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {totalFilters}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </DialogTitle>
          <DialogDescription>
            Personalize sua experiência escolhendo tópicos e localização
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-6 pb-6">
            {/* Tópicos */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-[#0EA5E9]" />
                <Label className="text-base font-semibold">Tópicos</Label>
                <Badge variant="outline" className="text-xs">
                  {tempTopics.length} selecionados
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TOPICS.map((topic) => (
                  <Button
                    key={topic.id}
                    variant={tempTopics.includes(topic.id) ? "default" : "outline"}
                    className={`h-auto p-3 flex items-center gap-3 justify-start ${
                      tempTopics.includes(topic.id)
                        ? "bg-[#0EA5E9] hover:bg-[#0C4A6E] text-white"
                        : "hover:bg-[#0EA5E9]/10"
                    }`}
                    onClick={() => toggleTopic(topic.id)}
                  >
                    <span className="text-lg">{topic.icon}</span>
                    <span className="text-sm font-medium">{topic.name}</span>
                    {tempTopics.includes(topic.id) && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Estados */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-[#0EA5E9]" />
                <Label className="text-base font-semibold">Estados</Label>
                <Badge variant="outline" className="text-xs">
                  {tempStates.length} selecionados
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BRAZILIAN_STATES.map((state) => (
                  <Button
                    key={state.id}
                    variant={tempStates.includes(state.id) ? "default" : "outline"}
                    className={`h-auto p-3 flex items-center gap-3 justify-start ${
                      tempStates.includes(state.id)
                        ? "bg-[#0EA5E9] hover:bg-[#0C4A6E] text-white"
                        : "hover:bg-[#0EA5E9]/10"
                    }`}
                    onClick={() => toggleState(state.id)}
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{state.name}</span>
                    {tempStates.includes(state.id) && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Cidades */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-[#0EA5E9]" />
                <Label className="text-base font-semibold">Cidades</Label>
                <Badge variant="outline" className="text-xs">
                  {tempCities.length} selecionadas
                </Badge>
              </div>

              {tempStates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Selecione um estado para ver as cidades disponíveis</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <Input
                      placeholder="Buscar cidade..."
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <Button
                        key={city}
                        variant={tempCities.includes(city) ? "default" : "outline"}
                        className={`h-auto p-2 flex items-center gap-2 justify-start ${
                          tempCities.includes(city)
                            ? "bg-[#0EA5E9] hover:bg-[#0C4A6E] text-white"
                            : "hover:bg-[#0EA5E9]/10"
                        }`}
                        onClick={() => toggleCity(city)}
                      >
                        <span className="text-sm font-medium">{city}</span>
                        {tempCities.includes(city) && (
                          <Check className="h-3 w-3 ml-auto" />
                        )}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="h-4 w-4 mr-1" />
              Limpar tudo
            </Button>
            <span className="text-sm text-muted-foreground">
              {totalFilters} filtros selecionados
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApply} className="bg-[#0EA5E9] hover:bg-[#0C4A6E]">
              <Check className="h-4 w-4 mr-1" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
