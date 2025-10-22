"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  DollarSign,
  Trophy,
  Film,
  Globe,
  Newspaper,
  Sparkles,
  Star,
} from "lucide-react";

const categories = [
  { id: "for-you", label: "Para Você", icon: Sparkles, color: "default" },
  { id: "top", label: "Top", icon: Star, color: "default" },
  { id: "all", label: "Tópicos", icon: Newspaper, color: "default" },
  { id: "tech", label: "Tecnologia & Ciência", icon: Cpu, color: "blue" },
  { id: "finance", label: "Finanças", icon: DollarSign, color: "green" },
  { id: "sports", label: "Esportes", icon: Trophy, color: "orange" },
  { id: "entertainment", label: "Entretenimento", icon: Film, color: "purple" },
];

interface CategoryFilterProps {
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [selected, setSelected] = useState("for-you");

  const handleSelect = (id: string) => {
    setSelected(id);
    onCategoryChange?.(id);
  };

  return (
    <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selected === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                onClick={() => handleSelect(category.id)}
                className={`whitespace-nowrap rounded-full ${
                  isSelected ? "" : "hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
