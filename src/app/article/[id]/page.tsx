import NewsHeader from "@/components/NewsHeader";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Clock, ExternalLink, ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data - in production this would come from API/database
const articleData: { [key: string]: any } = {
  "1": {
    id: "1",
    title: "OpenAI lança navegador Atlas com IA para desafiar Chrome",
    description: "Navegador integra ChatGPT e modo agente que executa tarefas automaticamente, derrubando ações da Alphabet em 3% após o anúncio.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
    category: "Tecnologia",
    source: "TechCrunch",
    timestamp: "há 45 segundos",
    publishDate: "Publicado 22 de out. de 2025",
    sources: 53,
    content: `A OpenAI anunciou hoje o lançamento do Atlas, um navegador web revolucionário que integra inteligência artificial diretamente na experiência de navegação. O navegador, que chega para competir com gigantes como Chrome e Safari, traz recursos inovadores que prometem transformar a maneira como interagimos com a web.

O Atlas incorpora uma versão otimizada do ChatGPT diretamente no navegador, permitindo que os usuários façam perguntas, resumam conteúdos e até mesmo executem tarefas complexas sem sair da janela principal. "Estamos redefinindo o que significa navegar na internet", afirmou Sam Altman, CEO da OpenAI, durante o evento de lançamento.

**Modo Agente Revolucionário**

Uma das características mais impressionantes do Atlas é o seu "Modo Agente", que permite ao navegador executar tarefas automaticamente com base em comandos de linguagem natural. Os usuários podem, por exemplo, pedir ao navegador para "encontrar os melhores preços para um voo para Paris em dezembro" e o Atlas não apenas buscará, mas também comparará opções, verificará disponibilidade e até mesmo poderá concluir a reserva.

Durante a demonstração, a equipe da OpenAI mostrou o navegador realizando compras online, preenchendo formulários, agendando compromissos e até mesmo criando planilhas complexas baseadas em dados extraídos de múltiplas páginas web. A tecnologia utiliza visão computacional avançada para entender interfaces web e interagir com elas de forma semelhante a um humano.

**Impacto no Mercado**

O anúncio teve repercussões imediatas no mercado financeiro. As ações da Alphabet, empresa controladora do Google e desenvolvedora do Chrome, caíram 3% nas primeiras horas após o anúncio. Analistas apontam que a entrada da OpenAI no mercado de navegadores pode representar uma ameaça significativa ao domínio do Chrome, que atualmente detém cerca de 65% do mercado global.

"A OpenAI não está apenas lançando mais um navegador", comentou Sarah Chen, analista de tecnologia da Goldman Sachs. "Eles estão propondo uma nova categoria de produto que combina navegação web tradicional com capacidades de IA de última geração. Isso pode forçar todos os outros players a repensar suas estratégias."

**Recursos de Privacidade e Segurança**

Consciente das preocupações crescentes com privacidade, a OpenAI enfatizou que o Atlas foi projetado com segurança em mente desde o início. O navegador oferece modo de navegação privada aprimorado com IA, detecção inteligente de phishing e malware, e controles granulares sobre quais dados são compartilhados com os serviços de IA.

Todos os dados processados pelo Modo Agente são criptografados localmente, e os usuários têm controle total sobre o histórico de comandos e ações executadas pelo assistente. A empresa também prometeu não usar dados de navegação para treinar seus modelos de IA sem consentimento explícito dos usuários.

**Disponibilidade e Planos Futuros**

O Atlas estará disponível inicialmente em versão beta para usuários nos Estados Unidos, com expansão global prevista para o primeiro trimestre de 2026. O navegador será gratuito para uso básico, com uma versão premium que oferecerá recursos avançados do Modo Agente e maior limite de uso diário.

A OpenAI também anunciou parcerias com desenvolvedores para criar extensões nativas que aproveitam as capacidades de IA do navegador, prometendo um ecossistema robusto de ferramentas e funcionalidades adicionais. A empresa planeja lançar APIs públicas no próximo ano, permitindo que desenvolvedores integrem as capacidades do Atlas em suas próprias aplicações.`,
    relatedSources: [
      { name: "TechCrunch", title: "OpenAI Launches Atlas Browser with Built-in ChatGPT" },
      { name: "The Verge", title: "OpenAI's new browser could challenge Chrome's dominance" },
      { name: "Bloomberg", title: "Alphabet Shares Drop 3% After OpenAI Browser Announcement" },
      { name: "Wired", title: "Inside OpenAI's Atlas: The AI-Powered Browser" }
    ]
  },
  "2": {
    id: "2",
    title: "CEO do Google admite que o ChatGPT chegou ao mercado antes deles",
    description: "Sundar Pichai reconhece candidamente que a OpenAI lançou primeiro.",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&h=800&fit=crop",
    category: "Tecnologia",
    source: "The Hans India",
    timestamp: "há 2 horas",
    publishDate: "Publicado 17 de out. de 2025",
    sources: 60,
    content: `O CEO da Google, Sundar Pichai, reconheceu candidamente na conferência Dreamforce da Salesforce na quinta-feira que a OpenAI merecia crédito por lançar o ChatGPT primeiro no final de 2022, apesar de a Google ter tecnologia similar pronta para implementação meses antes.

Falando com o CEO da Salesforce, Marc Benioff, Pichai revelou que o protótipo de chatbot interno da Google enfrentou obstáculos de qualidade e não estava pronto para lançamento público devido à abordagem cautelosa da empresa. "Sabíamos que em um mundo diferente, provavelmente teríamos lançado nosso chatbot talvez alguns meses depois", disse Pichai, observando que o produto "não havia chegado a um nível em que você pudesse disponibilizá-lo".

**Resposta Código Vermelho Remodela a Estratégia de IA do Google**

Um dia após o lançamento do ChatGPT, o Google internamente declarou um "código vermelho", segundo fontes familiarizadas com o assunto. Larry Page e Sergey Brin, os co-fundadores do Google afastados da gestão diária desde 2019, voltaram para reuniões estratégicas com a liderança sobre sua resposta ao ChatGPT.

As semanas seguintes marcaram uma mudança significativa na postura da empresa. Em fevereiro de 2023, o Google apresentou o Bard, seu rival direto ao ChatGPT, seguido pelo lançamento de recursos generativos de IA em seu mecanismo de busca e produtos Workspace. Durante esse período, a empresa também abriu acesso a APIs de IA, permitindo que desenvolvedores integrassem suas tecnologias em aplicações de terceiros.

Pichai compareceu a discussões e posou à frente tecnológica anteriormente, incluindo sua resposta à ameaça do iPhone à sua plataforma Android. "Sabíamos que precisávamos inovar rapidamente", explicou Pichai. A mudança levou o Google a investir mais de $30 bilhões em infraestrutura de IA em 2024 sozinho.

**Banco Reputacional vs. Vantagem do Pioneiro**

Pichai comparou a situação à disputa histórica entre VHS e Betamax. "Sabemos que em um mundo diferente, provavelmente teríamos lançado [nosso chatbot] talvez alguns meses depois", disse Pichai, observando que o produto "não havia chegado a um nível em que você pudesse disponibilizá-lo". Ele continuou explicando que a cautela da Google era justificada: "Sabemos que as pessoas vêm à Google Busca com muita confiança... temos um banco reputacional muito grande, e você não pode arriscar isso."

Esse "banco reputacional" se refere às décadas de confiança que os usuários depositaram na precisão e confiabilidade dos resultados de busca do Google. Um lançamento apressado de tecnologia de IA generativa imperfeita poderia corroer rapidamente essa confiança, potencialmente prejudicando não apenas seu negócio de busca de $280 bilhões, mas também sua credibilidade no mercado corporativo.

**Risco Reputacional vs. Vantagem do Pioneiro**

A decisão do Google de segurar o lançamento destaca um dilema comum entre empresas estabelecidas versus startups. Enquanto startups como a OpenAI podem se dar ao luxo de "se mover rápido e quebrar coisas", empresas com bilhões de usuários e décadas de reputação construída devem ser mais cautelosas.

"Quando você tem um produto usado por bilhões de pessoas diariamente, cada decisão de produto carrega um peso imenso", explicou Pichai. "Não podemos simplesmente lançar algo que possa dar respostas incorretas ou enganosas 20% do tempo. Os padrões são diferentes."

No entanto, essa cautela teve seu custo. O ChatGPT rapidamente se tornou a aplicação de consumo de crescimento mais rápido da história, alcançando 100 milhões de usuários em apenas dois meses. Enquanto isso, o Bard, lançado três meses depois, lutou para ganhar tração similar, em parte devido à percepção de que o Google estava "perseguindo" a OpenAI.`,
    relatedSources: [
      { name: "The Hans India", title: "Sundar Pichai Admits Google Was Ready for ChatGPT Launch" },
      { name: "NDTV Profit", title: "How Did Google Slip? Sundar Pichai On Losing AI Race To OpenAI" },
      { name: "Business Insider", title: "Google CEO Sundar Pichai shares what it was like to see OpenAI launch ChatGPT" },
      { name: "TamilWire", title: "Sundar Pichai on ChatGPT: OpenAI launched it first, but we had the tech" }
    ]
  }
};

const relatedArticles = [
  {
    id: "3",
    title: "Google em negociações com Anthropic sobre acordo de nuvem",
    description: "Parceria estratégica pode transformar o mercado de IA corporativa.",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&h=600&fit=crop",
    category: "Tecnologia",
    source: "Reuters",
    timestamp: "há 47 minutos",
    sources: 47,
  },
  {
    id: "2",
    title: "Meta corta 600 empregos de IA no Superintelligence Labs",
    description: "Empresa reestrutura divisão de pesquisa em inteligência artificial.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    category: "Tecnologia",
    source: "Bloomberg",
    timestamp: "há 31 minutos",
    sources: 31,
  },
  {
    id: "4",
    title: "A IA pode tornar civilizações alienígenas indetectáveis",
    description: "Pesquisadores sugerem que inteligência artificial avançada pode explicar o paradoxo de Fermi.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop",
    category: "Ciência",
    source: "Nature",
    timestamp: "há 37 minutos",
    sources: 37,
  },
  {
    id: "8",
    title: "Alibaba revela modelos de IA para desafiar o GPT-5",
    description: "Nova família de modelos Qwen promete performance superior em múltiplas tarefas.",
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=600&fit=crop",
    category: "Tecnologia",
    source: "TechCrunch",
    timestamp: "há 41 minutos",
    sources: 41,
  }
];

// Sponsored content to insert in articles
const sponsoredAds = [
  {
    id: "ad-1",
    title: "Transforme seu negócio com IA",
    description: "Descubra como a inteligência artificial pode revolucionar sua empresa. Agende uma demonstração gratuita.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    cta: "Saber Mais",
    link: "#",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "ad-2",
    title: "Plataforma líder em Cloud Computing",
    description: "Migre sua infraestrutura para a nuvem com segurança e performance. 30 dias grátis para novos clientes.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    cta: "Começar Agora",
    link: "#",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "ad-3",
    title: "Curso Completo de Data Science",
    description: "Aprenda análise de dados, machine learning e IA com os melhores instrutores. Certificado reconhecido.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    cta: "Inscrever-se",
    link: "#",
    gradient: "from-green-500 to-emerald-500"
  }
];

// Header banner ads
const headerAds = [
  {
    id: "header-ad-1",
    title: "Black Friday Tech: Até 70% OFF",
    description: "Notebooks, smartphones e gadgets com descontos imperdíveis. Aproveite agora!",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop",
    cta: "Ver Ofertas",
    link: "#",
    gradient: "from-red-500 to-orange-500"
  }
];

// Sidebar ads
const sidebarAds = [
  {
    id: "sidebar-ad-1",
    title: "Aprenda Python em 30 dias",
    description: "Curso online completo com certificado. Comece hoje mesmo!",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    cta: "Começar Grátis",
    link: "#",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: "sidebar-ad-2",
    title: "VPN Premium - 50% OFF",
    description: "Navegue com segurança e privacidade. Oferta limitada!",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    cta: "Assinar Agora",
    link: "#",
    gradient: "from-cyan-500 to-blue-500"
  }
];

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = articleData[id] || articleData["1"];

  // Split content into paragraphs and insert ads
  const contentParagraphs = article.content.split('\n\n');
  const contentWithAds: JSX.Element[] = [];
  let adIndex = 0;

  contentParagraphs.forEach((paragraph: string, index: number) => {
    // Check if paragraph is a heading (starts with **)
    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
      contentWithAds.push(
        <h2 key={`heading-${index}`} className="text-2xl font-bold mt-8 mb-4">
          {paragraph.replace(/\*\*/g, '')}
        </h2>
      );
    } else {
      contentWithAds.push(
        <p key={`paragraph-${index}`} className="mb-6 text-foreground leading-relaxed">
          {paragraph}
        </p>
      );
    }

    // Insert ad after every 3 paragraphs
    if ((index + 1) % 3 === 0 && adIndex < sponsoredAds.length) {
      const ad = sponsoredAds[adIndex];
      contentWithAds.push(
        <Card key={`ad-${adIndex}`} className="my-8 overflow-hidden border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
              <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">
                Publicidade
              </span>
            </div>
            <div className="grid md:grid-cols-[200px_1fr] gap-4 p-4">
              <div className="relative h-32 md:h-full rounded-lg overflow-hidden">
                <Image
                  src={ad.image}
                  alt={ad.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${ad.gradient} opacity-20`} />
              </div>
              <div className="flex flex-col justify-center gap-3">
                <h3 className="font-bold text-lg">{ad.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ad.description}
                </p>
                <Button 
                  className={`w-fit bg-gradient-to-r ${ad.gradient} text-white hover:opacity-90`}
                  size="sm"
                >
                  {ad.cta}
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
      adIndex++;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>

        {/* Header Banner Ad */}
        <Card className="mb-8 overflow-hidden border-2 border-yellow-500/20 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
              <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">
                Publicidade
              </span>
            </div>
            <div className="grid md:grid-cols-[300px_1fr] gap-4 p-4">
              <div className="relative h-32 md:h-40 rounded-lg overflow-hidden">
                <Image
                  src={headerAds[0].image}
                  alt={headerAds[0].title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${headerAds[0].gradient} opacity-20`} />
              </div>
              <div className="flex flex-col justify-center gap-3">
                <h3 className="font-bold text-2xl">{headerAds[0].title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {headerAds[0].description}
                </p>
                <Button 
                  className={`w-fit bg-gradient-to-r ${headerAds[0].gradient} text-white hover:opacity-90`}
                >
                  {headerAds[0].cta}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <article className="max-w-3xl">
            {/* Header */}
            <div className="mb-6">
              <Badge className="mb-4" variant="secondary">
                {article.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {article.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>{article.sources} fontes</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Content with Ads */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {contentWithAds}
            </div>

            {/* Related Sources */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                {article.sources} Fontes
              </h3>
              <div className="grid gap-3">
                {article.relatedSources.map((source: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                  >
                    <ExternalLink className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {source.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {source.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar - Descubra mais + Ads */}
          <aside className="space-y-6">
            {/* Sidebar Ad 1 */}
            <Card className="overflow-hidden border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
                  <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">
                    Publicidade
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={sidebarAds[0].image}
                      alt={sidebarAds[0].title}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${sidebarAds[0].gradient} opacity-20`} />
                  </div>
                  <h3 className="font-bold text-base">{sidebarAds[0].title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sidebarAds[0].description}
                  </p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${sidebarAds[0].gradient} text-white hover:opacity-90`}
                    size="sm"
                  >
                    {sidebarAds[0].cta}
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-lg font-bold mb-4">Descubra mais</h3>
              <div className="space-y-4">
                {relatedArticles.slice(0, 2).map((related) => (
                  <Link key={related.id} href={`/article/${related.id}`}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                      <div className="relative h-32 w-full">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {related.category}
                        </Badge>
                        <h4 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {related.timestamp}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar Ad 2 */}
            <Card className="overflow-hidden border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
                  <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                  <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">
                    Publicidade
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={sidebarAds[1].image}
                      alt={sidebarAds[1].title}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${sidebarAds[1].gradient} opacity-20`} />
                  </div>
                  <h3 className="font-bold text-base">{sidebarAds[1].title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {sidebarAds[1].description}
                  </p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${sidebarAds[1].gradient} text-white hover:opacity-90`}
                    size="sm"
                  >
                    {sidebarAds[1].cta}
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {relatedArticles.slice(2).map((related) => (
                <Link key={related.id} href={`/article/${related.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="relative h-32 w-full">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {related.category}
                      </Badge>
                      <h4 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {related.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {related.timestamp}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ISPIAI_padrao-4x-1761167472574.png"
                  alt="IspiAI Logo"
                  width={120}
                  height={30}
                  className="h-8 w-auto object-contain dark:hidden"
                />
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ISPIAI_branco-4x-1761167472564.png"
                  alt="IspiAI Logo"
                  width={120}
                  height={30}
                  className="h-8 w-auto object-contain hidden dark:block"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Portal mundial que começa por Mato Grosso. Espia o que importa com notícias rápidas e IA contextual.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tecnologia & Ciência</li>
                <li>Finanças</li>
                <li>Esportes</li>
                <li>Entretenimento</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sobre</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Quem Somos</li>
                <li>Contato</li>
                <li>Transparência Editorial</li>
                <li>Privacidade</li>
                <li>Termos de Uso</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">XomanoAI</h4>
              <p className="text-sm text-muted-foreground">
                Assistente inteligente baseado no protocolo AG-UI para experiência personalizada com HITL.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 IspiAI. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}