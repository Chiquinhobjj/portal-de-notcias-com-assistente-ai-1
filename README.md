# Portal de Notícias com Assistente AI

Um portal de notícias moderno e interativo com assistente de IA integrado, sistema de vídeos estilo TikTok e painel administrativo completo.

## ✨ Funcionalidades Principais

### 📰 Portal de Notícias
- **Homepage Responsiva**: Layout moderno com seções organizadas
- **Sistema de Categorias**: Navegação por categorias com dropdown
- **Filtros Avançados**: Filtros por tópicos, estados e cidades
- **Header Fixo**: Navegação sempre visível durante o scroll
- **Artigos Dinâmicos**: Sistema completo de artigos com imagens otimizadas

### 🎥 Sistema de Vídeos (IspiAI TV)
- **Reels Estilo TikTok**: Feed vertical com navegação por scroll
- **Player de Vídeo**: Reprodução com controles de áudio (mute/unmute)
- **Sistema de Interações**: Like, comentários e compartilhamento
- **Playlists**: Organização de vídeos em playlists temáticas
- **Compatibilidade Chrome**: Sistema otimizado para políticas de autoplay

### 🤖 Assistente AI (XomanoAI)
- **CopilotKit Integrado**: Assistente conversacional em português
- **Ações Personalizadas**: Navegação e busca de conteúdo
- **Interface Intuitiva**: Sidebar com chat interativo
- **Contexto Brasileiro**: Respostas em português com gírias locais

### ⚙️ Painel Administrativo
- **Dashboard Completo**: Estatísticas e métricas em tempo real
- **Gerenciamento de Conteúdo**: Artigos, vídeos, categorias e usuários
- **Sistema de Mídia**: Upload e organização de arquivos
- **Analytics**: Relatórios detalhados de performance
- **Layout Responsivo**: Interface adaptável para diferentes telas

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Database**: SQLite com Drizzle ORM
- **AI**: CopilotKit, OpenAI GPT-4
- **Video**: YouTube API Integration
- **Authentication**: NextAuth.js
- **Deployment**: Vercel Ready

## 📦 Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/Chiquinhobjj/portal-de-notcias-com-assistente-ai-1.git
cd portal-de-notcias-com-assistente-ai-1
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure as variáveis de ambiente**:
```bash
cp .env.example .env
# Edite o arquivo .env com suas chaves de API
```

4. **Execute o banco de dados**:
```bash
npm run db:push
```

5. **Inicie o servidor de desenvolvimento**:
```bash
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente Necessárias

```env
# CopilotKit
NEXT_PUBLIC_COPILOT_PUBLIC_KEY=sua_chave_publica_copilot
OPENAI_API_KEY=sua_chave_openai

# AGUI Service (opcional)
AGUI_SERVICE_URL=http://localhost:9000

# Database
DATABASE_URL=file:./dev.db

# NextAuth
NEXTAUTH_SECRET=seu_secret_nextauth
NEXTAUTH_URL=http://localhost:3000
```

### Serviço AGUI (Opcional)

Para funcionalidades avançadas de IA, você pode executar o serviço AGUI:

```bash
cd agui-service
pip install -r requirements.txt
python agui_server.py
```

## 📱 Funcionalidades por Página

### Homepage (`/`)
- Grid responsivo de notícias
- Seções temáticas (Opinião, Poderes, Geral, Polícia)
- Banner publicitário integrado
- Filtros avançados com modal

### IspiAI TV (`/tv`)
- Grid de vídeos e playlists
- Navegação por categorias
- Preview de vídeos com hover effects

### Reels (`/tv/reels/[id]`)
- Feed vertical estilo TikTok
- Controles de áudio integrados
- Sistema de comentários
- Navegação por teclado e scroll

### Admin Panel (`/admin`)
- Dashboard com métricas
- CRUD completo para todos os recursos
- Sistema de upload de mídia
- Relatórios e analytics

## 🎨 Design System

- **Cores**: Paleta azul (#0EA5E9) com gradientes
- **Tipografia**: Sistema hierárquico responsivo
- **Componentes**: Biblioteca Shadcn/ui customizada
- **Animações**: Transições suaves e micro-interações
- **Acessibilidade**: WCAG 2.1 compliant

## 🔒 Segurança

- **Secret Scanning**: Proteção contra vazamento de chaves
- **Environment Variables**: Configuração segura
- **Input Validation**: Sanitização de dados
- **CORS**: Configuração adequada para APIs

## 📊 Performance

- **Image Optimization**: Next.js Image com sizes e priority
- **Code Splitting**: Carregamento otimizado
- **Caching**: Estratégias de cache implementadas
- **Bundle Analysis**: Otimização de tamanho

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: ChiquinhoBJ
- **Design**: Sistema próprio baseado em Tailwind CSS
- **IA**: Integração com OpenAI via CopilotKit

## 📞 Suporte

Para suporte ou dúvidas, abra uma issue no GitHub ou entre em contato através do assistente AI integrado no portal.

---

**Portal de Notícias com Assistente AI** - Transformando a forma de consumir notícias com tecnologia de ponta! 🚀