import Link from "next/link";
import Image from "next/image";

const opinionArticles = [
  {
    id: "op1",
    author: "GILBERTO GOMES DA SILVA",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    title: "Reforma do Imposto de Renda: o que muda para o setor agropecuário"
  },
  {
    id: "op2",
    author: "VANESSA SUZUKI",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    title: "Coragem para recomeçar"
  },
  {
    id: "op3",
    author: "MARA GONÇALVES",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    title: "A medicina que pulsa em cada gesto de cuidado"
  },
  {
    id: "op4",
    author: "MARCIA AMORIM PEDR'ANGELO",
    authorImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop",
    title: "Toda escola é feita de pessoas inteiras"
  },
  {
    id: "op5",
    author: "GILBERTO GOMES DA SILVA",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    title: "Segurança no campo: PL amplia prazo para georreferenciamento até 2028"
  },
  {
    id: "op6",
    author: "LEONARDO CHUCRUTE",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    title: "Enem: estratégias para ter um bom desempenho e alcançar a aprovação"
  }
];

export function OpinionSection() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-8">Opinião</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
        {opinionArticles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-[#0EA5E9] transition-all">
              <Image
                src={article.authorImage}
                alt={article.author}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <h3 className="font-bold text-[#0EA5E9] text-sm mb-3 uppercase tracking-wide">
              {article.author}
            </h3>
            <p className="text-foreground font-medium text-base group-hover:text-[#0EA5E9] transition-colors leading-snug">
              {article.title}
            </p>
          </Link>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Link
          href="/opiniao"
          className="text-[#0EA5E9] font-semibold hover:underline text-sm"
        >
          Ver mais artigos
        </Link>
      </div>
    </section>
  );
}
