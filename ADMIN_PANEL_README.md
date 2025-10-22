# 📊 Painel Administrativo IspiAI

Sistema completo de gerenciamento de conteúdo (CMS) nocode para o portal de notícias IspiAI.

## 🚀 Funcionalidades

### 1. **Dashboard Principal** (`/admin`)
- Visão geral de estatísticas em tempo real
- Total de artigos (publicados/rascunhos)
- Anúncios ativos/pausados
- Visualizações totais
- Cliques em anúncios
- Atalhos rápidos para todas as seções
- Informações sobre protocolos MCP e A2A

### 2. **Gerenciamento de Artigos** (`/admin/articles`)
- **Listar Artigos**: Visualização completa com filtros e busca
- **Criar Novo**: Interface nocode para criação de conteúdo
- **Editar**: Atualização de artigos existentes
- **Publicar/Despublicar**: Controle de status com um clique
- **Excluir**: Remoção de artigos
- **Recursos**:
  - Geração automática de slug
  - Editor de texto completo
  - Seleção de categoria
  - Sistema de tags
  - Controle de destaque
  - Upload de imagem via URL
  - Métricas de visualização

### 3. **Gerenciamento de Anúncios** (`/admin/ads`)
- **Interface Visual**: Criação e edição em modal
- **Tipos de Anúncios**:
  - Banners (horizontal, vertical, quadrado)
  - Vídeos publicitários
  - Anúncios quadrados
- **Configurações**:
  - Posicionamento (topo, lateral, meio, rodapé, grid)
  - Tamanhos (pequeno, médio, grande)
  - Status (ativo, pausado, agendado)
  - Agendamento com data início/fim
- **Métricas**:
  - Impressões totais
  - Cliques registrados
  - CTR automático

### 4. **Gerenciamento de Categorias** (`/admin/categories`)
- Criação e edição de categorias
- Personalização de cores (seletor de cor visual)
- Ícones emoji para identificação
- Ordem de exibição customizável
- Status ativo/inativo
- Geração automática de slug

### 5. **Configurações do Sistema** (`/admin/settings`)
- **Configurações do Site**: Nome e domínio
- **SEO**: Meta tags e palavras-chave
- **Redes Sociais**: Links para Facebook, Twitter, Instagram
- **Informações do Banco**: Acesso ao Database Studio

## 🔒 Sistema de Autenticação

- **Proteção de Rotas**: Todas as rotas admin requerem autenticação
- **Redirecionamento Automático**: Login necessário para acesso
- **Sessão Persistente**: Token bearer armazenado localmente
- **Logout Seguro**: Limpeza de sessão e redirecionamento

## 📡 APIs Disponíveis

### APIs Administrativas (Requerem Autenticação)

#### Artigos
```
POST   /api/admin/articles              # Criar artigo
GET    /api/admin/articles              # Listar artigos (com filtros)
GET    /api/admin/articles/[id]         # Obter artigo específico
PUT    /api/admin/articles/[id]         # Atualizar artigo
DELETE /api/admin/articles/[id]         # Excluir artigo
POST   /api/admin/articles/[id]/publish # Publicar artigo
POST   /api/admin/articles/[id]/unpublish # Despublicar artigo
```

#### Anúncios
```
POST   /api/admin/ads                   # Criar anúncio
GET    /api/admin/ads                   # Listar anúncios (com filtros)
GET    /api/admin/ads/[id]              # Obter anúncio específico
PUT    /api/admin/ads/[id]              # Atualizar anúncio
DELETE /api/admin/ads/[id]              # Excluir anúncio
POST   /api/admin/ads/[id]/track-click # Registrar clique
POST   /api/admin/ads/[id]/track-impression # Registrar impressão
```

#### Categorias
```
POST   /api/admin/categories            # Criar categoria
GET    /api/admin/categories            # Listar categorias
PUT    /api/admin/categories/[id]       # Atualizar categoria
DELETE /api/admin/categories/[id]       # Excluir categoria
```

#### Configurações
```
GET    /api/admin/config                # Listar configurações
PUT    /api/admin/config/[key]          # Atualizar configuração
```

### APIs Públicas (Sem Autenticação)

#### Artigos
```
GET /api/articles                       # Listar artigos publicados
    ?category=Tecnologia                # Filtrar por categoria
    &featured=true                      # Apenas destaques
    &search=termo                       # Busca textual
    &limit=20                           # Limite de resultados
    &offset=0                           # Paginação
    &sort=publishedAt                   # Campo de ordenação
    &order=desc                         # Ordem (asc/desc)

GET /api/articles/[slug]                # Obter artigo por slug
                                        # Incrementa visualizações automaticamente
```

#### Anúncios
```
GET /api/ads/active                     # Obter anúncios ativos
    ?position=top                       # Filtrar por posição
                                        # Valida data início/fim automaticamente
```

#### Categorias
```
GET /api/categories                     # Listar categorias ativas
```

## 🤖 Protocolos de Integração

### MCP Protocol (Model Context Protocol)

Endpoint para consultas de IA e agentes inteligentes.

```
POST /api/mcp/query
Content-Type: application/json

{
  "action": "query" | "get" | "search",
  "resource": "articles" | "ads" | "categories" | "config",
  "filters": {
    "status": "published",
    "category": "Tecnologia"
  },
  "limit": 10,
  "id": 123,
  "search": "termo de busca"
}
```

**Exemplos de Uso:**

```javascript
// Buscar artigos de tecnologia
POST /api/mcp/query
{
  "action": "query",
  "resource": "articles",
  "filters": { "status": "published", "category": "Tecnologia" },
  "limit": 5
}

// Obter artigo específico
POST /api/mcp/query
{
  "action": "get",
  "resource": "articles",
  "id": 123
}

// Buscar por texto
POST /api/mcp/query
{
  "action": "search",
  "resource": "articles",
  "search": "inteligência artificial"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "count": 5,
    "resource": "articles",
    "action": "query"
  }
}
```

### A2A Protocol (Agent-to-Agent)

Endpoint para sincronização entre agentes e sistemas externos.

```
POST /api/a2a/sync
Content-Type: application/json

{
  "agent_id": "unique_agent_identifier",
  "sync_type": "push" | "pull",
  "resource": "articles" | "ads" | "categories",
  "data": [...],                      // Para push
  "timestamp": "2024-01-15T10:00:00Z" // Para pull (opcional)
}
```

**Exemplo PUSH (Enviar dados):**
```javascript
POST /api/a2a/sync
{
  "agent_id": "external_cms_agent",
  "sync_type": "push",
  "resource": "articles",
  "data": [
    {
      "title": "Novo Artigo",
      "slug": "novo-artigo",
      "description": "Descrição do artigo",
      "content": "Conteúdo completo...",
      "imageUrl": "https://...",
      "category": "Tecnologia",
      "source": "Fonte Externa",
      "status": "published"
    }
  ]
}
```

**Exemplo PULL (Obter atualizações):**
```javascript
POST /api/a2a/sync
{
  "agent_id": "mobile_app_agent",
  "sync_type": "pull",
  "resource": "articles",
  "timestamp": "2024-01-15T10:00:00Z"  // Apenas artigos após esta data
}
```

**Resposta:**
```json
{
  "success": true,
  "agent_id": "cms_server",
  "sync_id": "sync_1234567890_abc123",
  "timestamp": "2024-01-15T12:30:00Z",
  "data": [...],
  "message": "Successfully synced 10 articles"
}
```

## 🎨 Características da Interface

### Design NoCode
- **Interface Visual**: Todas as operações sem necessidade de código
- **Formulários Intuitivos**: Campos auto-descritivos
- **Validação em Tempo Real**: Feedback imediato de erros
- **Preview Automático**: Visualização antes de salvar

### Experiência do Usuário
- **Loading States**: Indicadores visuais durante operações
- **Toasts Informativos**: Notificações de sucesso/erro
- **Confirmações**: Diálogos para ações destrutivas
- **Busca e Filtros**: Localização rápida de conteúdo
- **Responsivo**: Funciona em desktop, tablet e mobile

### Segurança
- **Autenticação Obrigatória**: Proteção de todas as rotas admin
- **Validação de Dados**: Server-side e client-side
- **Sanitização**: Prevenção de SQL injection e XSS
- **Rate Limiting**: Proteção contra abuso (futuro)

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

#### articles
- `id` (integer, PK, auto-increment)
- `title` (text, required)
- `slug` (text, unique, required)
- `description` (text, required)
- `content` (text, required)
- `imageUrl` (text, required)
- `category` (text, required)
- `source` (text, required)
- `author` (text, nullable)
- `tags` (text, nullable)
- `status` (text, default: "draft")
- `featured` (boolean, default: false)
- `views` (integer, default: 0)
- `publishedAt` (timestamp, nullable)
- `createdAt` (timestamp, required)
- `updatedAt` (timestamp, required)

#### ads
- `id` (integer, PK, auto-increment)
- `title` (text, required)
- `type` (text, required) - banner, video, square
- `variant` (text, required) - horizontal, vertical, square
- `size` (text, required) - small, medium, large
- `contentUrl` (text, required)
- `linkUrl` (text, nullable)
- `position` (text, required) - top, sidebar, middle, bottom, grid
- `status` (text, default: "active") - active, paused, scheduled
- `startDate` (timestamp, nullable)
- `endDate` (timestamp, nullable)
- `clicks` (integer, default: 0)
- `impressions` (integer, default: 0)
- `createdAt` (timestamp, required)
- `updatedAt` (timestamp, required)

#### categories
- `id` (integer, PK, auto-increment)
- `name` (text, unique, required)
- `slug` (text, unique, required)
- `description` (text, nullable)
- `color` (text, nullable) - hex color
- `icon` (text, nullable) - emoji
- `displayOrder` (integer, default: 0)
- `active` (boolean, default: true)
- `createdAt` (timestamp, required)

#### adminConfig
- `id` (integer, PK, auto-increment)
- `key` (text, unique, required)
- `value` (text, required) - JSON string
- `description` (text, nullable)
- `updatedAt` (timestamp, required)

## 🔧 Configuração e Acesso

### Pré-requisitos
- Usuário autenticado no sistema
- Permissões de administrador (automático para usuários logados)

### Como Acessar
1. Faça login no site através do botão "Entrar"
2. Após autenticação, clique no botão "Admin" no header
3. Você será redirecionado para `/admin`

### Gerenciar Banco de Dados
- Acesse a aba "Database Studio" no topo da interface
- Visualize e edite dados diretamente no banco
- Execute queries SQL customizadas (avançado)

## 📱 Integração com Frontend

### Homepage
- Busca artigos publicados via `/api/articles`
- Exibe anúncios ativos via `/api/ads/active`
- Categorias dinâmicas via `/api/categories`
- Atualização em tempo real das visualizações

### Páginas de Artigo
- Carregamento por slug
- Incremento automático de visualizações
- Artigos relacionados por categoria

### Seções Especiais
- OpinionSection, PoderesSection, GeralSection, PoliciaSection
- Todas podem ser alimentadas por APIs admin
- Filtros por categoria integrados

## 🚀 Próximos Passos Recomendados

1. **Upload de Imagens**: Integrar serviço de upload (ex: Cloudinary, AWS S3)
2. **Editor Rich Text**: Adicionar WYSIWYG editor (ex: TipTap, Quill)
3. **Agendamento**: Sistema de publicação programada
4. **Analytics**: Dashboard com gráficos e métricas detalhadas
5. **Permissões**: Roles (editor, moderador, admin)
6. **Notificações**: Sistema de alertas para novos conteúdos
7. **API Keys**: Autenticação por token para MCP/A2A
8. **Webhooks**: Notificações externas de eventos
9. **Backup**: Sistema automático de backup
10. **Logs**: Auditoria de ações administrativas

## 💡 Dicas de Uso

### Criando Artigos
1. Escreva um título descritivo
2. O slug é gerado automaticamente (pode editar)
3. Adicione descrição para SEO
4. Use URLs de imagens de alta qualidade
5. Selecione categoria apropriada
6. Adicione tags separadas por vírgula
7. Marque como destaque se relevante
8. Salve como rascunho para revisar depois

### Gerenciando Anúncios
1. Use títulos descritivos para organização interna
2. Teste diferentes posições para melhor performance
3. Configure datas para campanhas temporárias
4. Monitore CTR (cliques/impressões) regularmente
5. Pause anúncios com baixo desempenho

### Organizando Categorias
1. Use cores distintas para fácil identificação
2. Adicione emojis para visual appeal
3. Defina ordem de exibição lógica
4. Desative categorias temporárias ao invés de excluir

## 📞 Suporte

Para dúvidas ou problemas:
- Documente o erro encontrado
- Verifique console do navegador (F12)
- Verifique logs do servidor
- Contate a equipe de desenvolvimento

---

**Desenvolvido para IspiAI** - Portal de Notícias com IA
