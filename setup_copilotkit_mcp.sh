#!/bin/bash

# Script para configurar CopilotKit MCP Server
# Execute este script para adicionar o MCP Server ao Cursor

echo "🔧 Configurando CopilotKit MCP Server..."
echo ""

# Verificar se o arquivo mcp.json existe
MCP_FILE="$HOME/.cursor/mcp.json"

if [ ! -f "$MCP_FILE" ]; then
    echo "📝 Criando arquivo mcp.json..."
    mkdir -p "$HOME/.cursor"
    cat > "$MCP_FILE" << 'EOF'
{
  "mcpServers": {
    "CopilotKit MCP": {
      "url": "https://mcp.copilotkit.ai"
    }
  }
}
EOF
else
    echo "📝 Arquivo mcp.json já existe. Adicionando CopilotKit MCP..."
    
    # Backup do arquivo original
    cp "$MCP_FILE" "$MCP_FILE.backup"
    
    # Adicionar CopilotKit MCP se não existir
    if ! grep -q "CopilotKit MCP" "$MCP_FILE"; then
        echo "✅ Adicionando CopilotKit MCP Server..."
        # Aqui você precisaria editar manualmente o JSON
        echo "⚠️  Adicione manualmente ao seu mcp.json:"
        echo '    "CopilotKit MCP": {'
        echo '      "url": "https://mcp.copilotkit.ai"'
        echo '    },'
    else
        echo "✅ CopilotKit MCP já está configurado!"
    fi
fi

echo ""
echo "📋 Próximos passos:"
echo "1. Reinicie o Cursor"
echo "2. Crie conta em: https://app.copilotkit.ai/"
echo "3. Crie agente com ID: xomano-news-agent"
echo "4. Configure as ações para notícias"
echo "5. Teste no site!"
echo ""
echo "🔗 Links úteis:"
echo "- CopilotKit Dashboard: https://app.copilotkit.ai/"
echo "- Documentação: https://docs.copilotkit.ai/"
echo "- MCP Server: https://mcp.copilotkit.ai/"
