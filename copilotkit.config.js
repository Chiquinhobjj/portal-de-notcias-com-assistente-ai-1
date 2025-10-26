import { CopilotKit } from "@copilotkit/react-core";

export default {
  // Configuração do CopilotKit para IspiAI Portal
  publicApiKey: "ck_pub_6de783e30462e6c5370eb29a6f23ead6",
  agentId: "xomano-news-agent",
  
  // Ações disponíveis no portal
  actions: [
    {
      name: "navegarParaNoticia",
      description: "Navega para uma notícia específica quando o usuário pede para ver mais detalhes ou ler uma matéria",
      parameters: {
        articleId: {
          type: "string",
          description: "ID da notícia para navegar",
          required: true
        }
      }
    },
    {
      name: "recomendarNoticiasPorCategoria",
      description: "Filtra e recomenda notícias de uma categoria específica (Tecnologia, Finanças, Esportes, Entretenimento)",
      parameters: {
        category: {
          type: "string",
          description: "Categoria das notícias",
          required: true
        }
      }
    },
    {
      name: "resumirNoticiasDoDia",
      description: "Cria um resumo executivo das principais notícias disponíveis"
    },
    {
      name: "buscarNoticiasPorTema",
      description: "Busca notícias relacionadas a um tema ou palavra-chave específica",
      parameters: {
        keyword: {
          type: "string",
          description: "Palavra-chave para buscar",
          required: true
        }
      }
    },
    {
      name: "navegarParaSecao",
      description: "Navega para seções especiais do portal como Opinião, Poderes, Ultimas, Polícia"
    }
  ]
};
