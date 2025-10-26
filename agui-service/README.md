# AG-UI bridge service

Pequeno serviço FastAPI que expõe o agente AG-UI para o portal IspiAI.

## Pré-requisitos
- Python 3.10+
- Chave da OpenAI (obtenha em: https://platform.openai.com/api-keys)
- ID do agente (pode ser qualquer string identificadora)

## Como rodar
```bash
cd agui-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.agui.example .env.agui
# edite .env.agui e coloque sua chave da OpenAI:
# AGUI_API_KEY=sk-sua-chave-openai-aqui
# AGUI_AGENT_ID=xomano-news-assistant
uvicorn agui_server:app --reload --port 9000
```

O servidor expõe:
- `GET /health` → checagem simples.
- `POST /chat` → recebe `{ messages: [{ role, content }], metadata?: {...} }` e retorna `reply` + `tool_calls`.

A aplicação Next.js poderá chamar `http://localhost:9000/chat` a partir do drawer XomanoAI.
