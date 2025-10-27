"use client";

// Temporarily disabled CopilotKit to fix Vercel build issues
// import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useRouter } from "next/navigation";

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  timestamp: string;
}

export function useCopilotNews(articles: Article[], setSelectedCategory: (category: string) => void) {
  const router = useRouter();

  // Temporarily disabled - CopilotKit functionality
  // All CopilotKit hooks and actions are commented out below
  
  // Original CopilotKit code (commented out):
  /*
  // Disponibiliza contexto das notícias para o XomanoAI (RAG automático)
  useCopilotReadable({
    description: "Lista de notícias atualmente disponíveis no portal com títulos, descrições e categorias",
    value: articles.slice(0, 10).map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      category: a.category,
    })),
  });

  // Ferramenta: Navegar para uma notícia específica
  useCopilotAction({
    name: "navegarParaNoticia",
    description: "Navega para uma notícia específica quando o usuário pede para ver mais detalhes ou ler uma matéria",
    parameters: [
      {
        name: "articleId",
        type: "string",
        description: "ID da notícia para navegar",
        required: true,
      },
    ],
    handler: async ({ articleId }) => {
      router.push(`/article/${articleId}`);
      return `✅ Navegando para a notícia! Prepare-se para se informar! 📰`;
    },
  });

  // Ferramenta: Recomendar notícias por categoria
  useCopilotAction({
    name: "recomendarNoticiasPorCategoria",
    description: "Filtra e recomenda notícias de uma categoria específica (Tecnologia, Finanças, Esportes, Entretenimento)",
    parameters: [
      {
        name: "category",
        type: "string",
        description: "Categoria desejada: tech, finance, sports, entertainment",
        required: true,
      },
    ],
    handler: async ({ category }) => {
      const categoryMap: Record<string, string> = {
        tech: "tech",
        tecnologia: "tech",
        finance: "finance",
        "finanças": "finance",
        financas: "finance",
        sports: "sports",
        esportes: "sports",
        entertainment: "entertainment",
        entretenimento: "entertainment",
      };
      
      const normalizedCategory = categoryMap[category.toLowerCase()] || category;
      setSelectedCategory(normalizedCategory);
      
      const categoryLabels: Record<string, string> = {
        tech: "Tecnologia & Ciência",
        finance: "Finanças",
        sports: "Esportes",
        entertainment: "Entretenimento",
      };
      
      return `🎯 Opa! Filtrei as notícias de ${categoryLabels[normalizedCategory] || category}! Dá uma olhada! 👀`;
    },
  });

  // Ferramenta: Fazer resumo de notícias do dia
  useCopilotAction({
    name: "resumirNoticiasDoDia",
    description: "Cria um resumo executivo das principais notícias disponíveis",
    parameters: [],
    handler: async () => {
      const topArticles = articles.slice(0, 5);
      const summary = topArticles
        .map((a, i) => `${i + 1}. **${a.title}** (${a.category})`)
        .join("\n");
      
      return `📰 **Resumo das principais notícias:**\n\n${summary}\n\n💡 Quer que eu aprofunde em alguma delas? É só pedir!`;
    },
  });

  // Ferramenta: Buscar notícias por tema
  useCopilotAction({
    name: "buscarNoticiasPorTema",
    description: "Busca notícias relacionadas a um tema ou palavra-chave específica",
    parameters: [
      {
        name: "keyword",
        type: "string",
        description: "Palavra-chave ou tema para buscar",
        required: true,
      },
    ],
    handler: async ({ keyword }) => {
      const matchedArticles = articles.filter(a => 
        a.title.toLowerCase().includes(keyword.toLowerCase()) ||
        a.description.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (matchedArticles.length === 0) {
        return `🔍 Hmm, não encontrei notícias sobre "${keyword}" no momento. Quer que eu sugira outros temas?`;
      }
      
      const results = matchedArticles.slice(0, 3)
        .map((a, i) => `${i + 1}. **${a.title}**`)
        .join("\n");
      
      return `🔍 Encontrei ${matchedArticles.length} notícia(s) sobre "${keyword}":\n\n${results}\n\n📖 Quer ler alguma? Só me avisar!`;
    },
  });

  // Ferramenta: Navegar para seções especiais
  useCopilotAction({
    name: "navegarParaSecao",
    description: "Navega para seções especiais do portal como Opinião, Poderes, Ultimas, Polícia",
    parameters: [
      {
        name: "section",
        type: "string",
        description: "Nome da seção: opiniao, poderes, ultimas, policia, shorts",
        required: true,
      },
    ],
    handler: async ({ section }) => {
      const sectionMap: Record<string, { path: string; name: string }> = {
        opiniao: { path: "/opiniao", name: "Opinião" },
        poderes: { path: "/poderes", name: "Poderes" },
        "ultimas": { path: "/veja-bem", name: "Ultimas" },
        policia: { path: "/policia", name: "Polícia" },
        shorts: { path: "/shorts", name: "IspiAI Shorts" },
      };
      
      const target = sectionMap[section.toLowerCase()];
      if (!target) {
        return `❓ Desculpa, não conheço essa seção. Temos: Opinião, Poderes, Ultimas, Polícia e Shorts!`;
      }
      
      router.push(target.path);
      return `🚀 Partiu ${target.name}! Vamos lá! ✨`;
    },
  });

  // Ferramenta: Mostrar estatísticas divertidas
  useCopilotAction({
    name: "mostrarEstatisticas",
    description: "Mostra estatísticas divertidas sobre as notícias disponíveis",
    parameters: [],
    handler: async () => {
      const categories = articles.reduce((acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostPopularCategory = Object.entries(categories)
        .sort(([, a], [, b]) => b - a)[0];
      
      return `📊 **Estatísticas do momento:**\n\n` +
        `📰 Total de notícias: ${articles.length}\n` +
        `🔥 Categoria mais quente: ${mostPopularCategory[0]} (${mostPopularCategory[1]} notícias)\n` +
        `⏰ Última atualização: ${articles[0]?.timestamp || "agora"}\n\n` +
        `🎯 Tô de olho em tudo por aqui! 👀`;
    },
  });
  */
}
