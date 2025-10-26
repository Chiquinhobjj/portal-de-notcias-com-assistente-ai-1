# Configuração da Chave OpenAI para AG-UI

## Passo a Passo

### 1. Criar arquivo de configuração
```bash
cd agui-service
cp .env.agui.example .env.agui
```

### 2. Editar o arquivo .env.agui
Abra o arquivo `.env.agui` e configure:

```bash
# Sua chave da OpenAI
AGUI_API_KEY=sk-sua-chave-aqui

# ID do agente (pode ser qualquer nome)
AGUI_AGENT_ID=xomano-news-assistant
```

### 3. Obter sua chave OpenAI
1. Acesse: https://platform.openai.com/api-keys
2. Faça login na sua conta OpenAI
3. Clique em "Create new secret key"
4. Copie a chave (começa com `sk-` ou `sk-proj-`)
5. Cole no arquivo `.env.agui`

### 4. Testar a configuração
```bash
# No terminal, dentro da pasta agui-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn agui_server:app --reload --port 9000
```

### 5. Verificar se está funcionando
Abra: http://localhost:9000/health
Deve retornar: `{"status": "ok"}`

## Próximos Passos
1. Configure sua chave OpenAI no `.env.agui`
2. Inicie o serviço Python
3. Teste o chat no XomanoAI drawer
4. O agente agora usará sua chave OpenAI via protocolo AG-UI!
