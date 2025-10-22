import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const policiaNews = [
  {
    id: "pol1",
    label: "DISPOSIÇÃO DA JUSTIÇA",
    title: "Mulher é presa pela Polícia Civil após matar marido com várias facadas em Várzea Grande",
    image: "https://images.unsplash.com/photo-1586339277861-b0b167f302b0?w=600&h=400&fit=crop"
  },
  {
    id: "pol2",
    label: "INQUERITO CONCLUÍDO",
    title: "Policial Militar e comparsa são indiciados por assassinato de personal trainer em VG",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"
  },
  {
    id: "pol3",
    label: "FRAUDES NO FUNDEB",
    title: "Prefeitura de cidade de Mato Grosso é alvo de Operação da Polícia Federal",
    image: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=600&h=400&fit=crop"
  }
];

export function PoliciaSection() {
  return (
    <section className="mb-12">
      <div className="border-t-4 border-red-600 mb-6">
        <h2 className="text-3xl font-bold mt-6 text-red-600">Polícia</h2>
      </div>

      {/* Large Featured Story */}
      <div className="mb-8">
        <Link href="/article/pol-featured" className="group">
          <Badge className="mb-3 bg-red-600 text-white text-xs uppercase tracking-wide">
            ABUSAVA DE ENTEADAS
          </Badge>
          <h3 className="text-3xl md:text-4xl font-bold leading-tight group-hover:text-red-600 transition-colors mb-6">
            Padrasto é assassinado a tiros na frente da esposa em cidade do interior de Mato Grosso
          </h3>
        </Link>
      </div>

      {/* Grid of 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {policiaNews.map((news) => (
          <Link
            key={news.id}
            href={`/article/${news.id}`}
            className="group"
          >
            <div className="relative h-56 rounded-lg overflow-hidden mb-4">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <Badge className="mb-3 bg-red-600/10 text-red-600 hover:bg-red-600/20 text-xs uppercase tracking-wide">
              {news.label}
            </Badge>
            <h4 className="font-bold text-base group-hover:text-red-600 transition-colors leading-snug">
              {news.title}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  );
}
