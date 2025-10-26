"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface NewsItem {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    category: "VEJA VÍDEO",
    categoryColor: "text-yellow-500",
    title: "Vereadores citam importância de viagem para Emirados e China",
    description: "",
  },
  {
    id: "2",
    category: "24 PROJETOS DE LEI",
    categoryColor: "text-yellow-500",
    title: "Flávia vai na Câmara para articular aprovação de fusão",
    description: "",
  },
  {
    id: "3",
    category: "EMIRADOS E CHINA",
    categoryColor: "text-yellow-500",
    title: "Paula Calli confirma viagem de Demilson e Magalhães",
    description: "",
  },
  {
    id: "4",
    category: "XÔ MANO QUE MORA LOGO ALI",
    categoryColor: "text-yellow-500",
    title: "Humorista cuiabano é internado em hospital com infecção grave",
    description: "",
  },
];

export function VejaBemWidget() {
  return (
    <div className="bg-gradient-to-br from-[#0C4A6E] to-[#075985] rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">ULTIMAS</h2>
          <Link 
            href="/veja-bem" 
            className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1"
          >
            VER MAIS
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* News List */}
      <div className="divide-y divide-white/10">
        {newsItems.map((item, index) => (
          <Link
            key={item.id}
            href={`/article/${item.id}`}
            className="block p-4 hover:bg-white/5 transition-colors group"
          >
            <div className="space-y-2">
              <p className={`text-xs font-bold ${item.categoryColor} uppercase tracking-wide`}>
                {item.category}
              </p>
              <h3 className="text-sm font-medium text-white group-hover:text-[#0EA5E9] transition-colors leading-snug">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}