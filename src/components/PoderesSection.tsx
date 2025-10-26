import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const poderesNews = [
  {
    id: "pod1",
    label: "VEJA VÍDEO",
    title: '"Tem que acabar com essa frescura", diz Júlio sobre UB não conversar com outras legendas',
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop"
  },
  {
    id: "pod2",
    label: "MUITO CARO",
    title: "Demilson Nogueira e Eduardo Magalhães desistem de viajar aos Emirados e China",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop"
  },
  {
    id: "pod3",
    label: "VEJA VÍDEO",
    title: "Barões do Agro apostam que Janaína não será candidata ao Senado em 2026",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&h=300&fit=crop"
  },
  {
    id: "pod4",
    label: "VIAGEM NA ÁSIA",
    title: "Abílio buscará recursos nos Emirados para construir 6 viadutos em Cuiabá",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop"
  }
];

const sidebarHighlights = [
  {
    id: "vh1",
    label: "VEJA VÍDEO",
    title: "Vereadores citam importância da viagem para Emirados e China",
    color: "text-yellow-600"
  },
  {
    id: "vh2",
    label: "24 PROJETOS DE LEI",
    title: "Flávia vai na Câmara para articular aprovação de fusão",
    color: "text-yellow-600"
  },
  {
    id: "vh3",
    label: "EMIRADOS E CHINA",
    title: "Paula Calli confirma viagem de Demilson e Magalhães",
    color: "text-yellow-600"
  },
  {
    id: "vh4",
    label: "XÔ MANO QUE MORA LOGO ALI",
    title: "Humorista cuiabano é internado em hospital com infecção grave",
    color: "text-yellow-600"
  }
];

const mainStory = {
  id: "pod-main",
  label: "VEJA VÍDEO",
  title: "Wellington 'enterra' de vez possibilidade de Samantha ser vice de Otaviano Pivetta",
  image: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800&h=500&fit=crop"
};

export function PoderesSection() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold border-l-4 border-[#0EA5E9] pl-4">PODERES</h2>
        <Link href="/poderes" className="text-[#0EA5E9] font-semibold hover:underline text-sm">
          VER MAIS
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Story - 8 columns */}
        <div className="lg:col-span-8">
          <Link href={`/article/${mainStory.id}`} className="group block mb-6">
            <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
              <Image
                src={mainStory.image}
                alt={mainStory.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <Badge className="mb-2 bg-[#0EA5E9] text-white hover:bg-[#0C4A6E]">
              {mainStory.label}
            </Badge>
            <h3 className="text-2xl font-bold group-hover:text-[#0EA5E9] transition-colors">
              {mainStory.title}
            </h3>
          </Link>

          {/* Grid of 4 news items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {poderesNews.map((news) => (
              <Link
                key={news.id}
                href={`/article/${news.id}`}
                className="group"
              >
                <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <Badge variant="secondary" className="mb-2 text-xs">
                  {news.label}
                </Badge>
                <h4 className="font-semibold text-sm group-hover:text-[#0EA5E9] transition-colors line-clamp-2">
                  {news.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar - 4 columns */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-[#0C4A6E] to-[#075985] rounded-lg p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">ULTIMAS</h3>
              <Link href="/veja-bem" className="text-white text-xs hover:underline">
                VER MAIS
              </Link>
            </div>
            
            <div className="space-y-4 divide-y divide-white/20">
              {sidebarHighlights.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/${item.id}`}
                  className="group block pt-4 first:pt-0"
                >
                  <p className={`text-xs font-bold mb-2 ${item.color}`}>
                    {item.label}
                  </p>
                  <p className="text-white text-sm group-hover:text-yellow-300 transition-colors">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
