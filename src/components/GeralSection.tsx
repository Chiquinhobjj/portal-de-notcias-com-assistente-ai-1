import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const geralNews = [
  {
    id: "ger1",
    label: "SUPERAÇÃO ECONÔMICA",
    title: "Agronegócio brasileiro avança na geração de empregos e qualificação profissional",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop"
  },
  {
    id: "ger2",
    label: "SEM NOVAS EXIGÊNCIAS",
    title: "TJ mantém decisão e administradora de consórcio deve liberar carta de crédito",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop"
  },
  {
    id: "ger3",
    label: "FEMINICÍDIO",
    title: "Homem é condenado a 18 anos de prisão por matar esposa com tiro na cara em cidade de MT",
    image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=600&h=400&fit=crop"
  }
];

export function GeralSection() {
  return (
    <section className="mb-12">
      <div className="border-t-4 border-[#0EA5E9] mb-6">
        <h2 className="text-3xl font-bold mt-6">Geral</h2>
      </div>

      {/* Large Featured Story */}
      <div className="mb-8">
        <Link href="/article/ger-featured" className="group">
          <Badge className="mb-3 bg-[#0EA5E9] text-white text-xs uppercase tracking-wide">
            INFRAESTRUTURA E DESENVOLVIMENTO
          </Badge>
          <h3 className="text-3xl md:text-4xl font-bold leading-tight group-hover:text-[#0EA5E9] transition-colors mb-6">
            "Se a Ponte do Rio Teles Pires está saindo do papel, foi graças à parceria com Governo de MT", afirma prefeito de Itaúba
          </h3>
        </Link>
      </div>

      {/* Grid of 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {geralNews.map((news) => (
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
            <Badge className="mb-3 bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 text-xs uppercase tracking-wide">
              {news.label}
            </Badge>
            <h4 className="font-bold text-base group-hover:text-[#0EA5E9] transition-colors leading-snug">
              {news.title}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  );
}
