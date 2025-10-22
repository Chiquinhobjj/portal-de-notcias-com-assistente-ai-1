"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        defaultOpen={false}
        clickOutsideToClose={true}
        labels={{
          title: "XomanoAI",
          initial: "Olá! Sou o XomanoAI, seu assistente inteligente. Como posso ajudá-lo hoje?",
        }}
        instructions="Você é o XomanoAI, um assistente inteligente do portal de notícias IspiAI. Ajude os usuários com informações sobre as notícias, explique contextos, faça resumos e responda perguntas de forma clara e objetiva em português brasileiro."
      >
        {children}
      </CopilotSidebar>
    </CopilotKit>
  );
}
