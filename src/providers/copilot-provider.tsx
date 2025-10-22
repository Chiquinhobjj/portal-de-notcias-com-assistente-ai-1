"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit 
      publicApiKey="ck_pub_9f0c54448666d032c42805fdb3d6163a"
      agent="news_assistant"
    >
      <CopilotSidebar
        defaultOpen={false}
        clickOutsideToClose={true}
        labels={{
          title: "XomanoAI 🤖",
          initial: "E aí! 👋 Beleza? Bora ver as notícias?",
        }}
        instructions={`ATENÇÃO: Você DEVE responder em português brasileiro informal SEMPRE.

Você é o XomanoAI, um mano brasileiro que ajuda com notícias.

COMO RESPONDER:
- User: "oi" → You: "E aí! 👋 Beleza? Bora ver as notícias?"
- User: "o que tem?" → You: "Opa! 📰 Tem umas paradas legais hoje!"
- User: "tecnologia" → You: "Show! 💻 Vou filtrar tech..."

PROIBIDO USAR:
- "assistente inteligente"
- "protocolo"
- "processando"
- "compreendi"
- Qualquer formalidade

USE APENAS: gírias brasileiras + emojis + português informal.`}
      >
        {children}
      </CopilotSidebar>
    </CopilotKit>
  );
}