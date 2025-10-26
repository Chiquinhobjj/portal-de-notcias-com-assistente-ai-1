#!/bin/bash

# Script de teste para integração AG-UI + OpenAI
# Execute este script após configurar sua chave OpenAI

echo "🚀 Testando integração AG-UI + OpenAI..."
echo ""

# Verificar se estamos na pasta correta
if [ ! -f "agui_server.py" ]; then
    echo "❌ Execute este script dentro da pasta agui-service/"
    exit 1
fi

# Verificar se o arquivo .env.agui existe
if [ ! -f ".env.agui" ]; then
    echo "❌ Arquivo .env.agui não encontrado!"
    echo "📝 Execute: cp .env.agui.example .env.agui"
    echo "📝 Edite o arquivo e adicione sua chave OpenAI"
    exit 1
fi

# Verificar se a chave foi configurada
if ! grep -q "sk-" .env.agui; then
    echo "❌ Chave OpenAI não configurada!"
    echo "📝 Edite .env.agui e adicione sua chave (deve começar com 'sk-')"
    exit 1
fi

echo "✅ Configuração encontrada!"
echo ""

# Verificar se o ambiente virtual existe
if [ ! -d ".venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python -m venv .venv
fi

echo "📦 Ativando ambiente virtual..."
source .venv/bin/activate

echo "📦 Instalando dependências..."
pip install -r requirements.txt

echo ""
echo "🧪 Testando servidor..."
echo "📡 Iniciando servidor na porta 9000..."
echo "🔗 Teste em: http://localhost:9000/health"
echo ""
echo "⏹️  Para parar: Ctrl+C"
echo ""

# Iniciar o servidor
uvicorn agui_server:app --reload --port 9000
