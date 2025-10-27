"use client";

// Temporarily disabled CopilotKit to fix Vercel build issues
// import { CopilotKit } from "@copilotkit/react-core";
// import { CopilotSidebar } from "@copilotkit/react-ui";
// import "@copilotkit/react-ui/styles.css";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  // Temporarily disabled CopilotKit
  return <>{children}</>;
  
  // Original CopilotKit code (commented out):
  // return (
  //   <CopilotKit publicApiKey="ck_pub_16d1da1405d19bddc3e926750fa0d00c">
  //     <CopilotSidebar
  //       defaultOpen={false}
  //       instructions="Você é o XomanoAI, um assistente brasileiro que ajuda com notícias. Responda sempre em português brasileiro informal e amigável. Use gírias brasileiras e emojis quando apropriado."
  //       labels={{
  //         title: "XomanoAI 🤖",
  //         initial: "E aí! 👋 Beleza? Bora ver as notícias?",
  //       }}
  //     >
  //       {children}
  //     </CopilotSidebar>
  //   </CopilotKit>
  // );
}
