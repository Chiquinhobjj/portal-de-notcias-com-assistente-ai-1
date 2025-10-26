"""Minimal FastAPI wrapper around OpenAI API.

This service exposes a /chat endpoint that forwards the conversation
between the XomanoAI drawer and OpenAI. It keeps the setup
simple so you can run everything locally while developing.

Usage:
  1. Create a virtualenv:  python -m venv .venv && source .venv/bin/activate
  2. Install deps:        pip install -r agui-service/requirements.txt
  3. Copy .env template:  cp agui-service/.env.agui.example agui-service/.env.agui
  4. Fill AGUI_API_KEY (OpenAI key) and AGUI_AGENT_ID in the .env file.
  5. Run the server:      uvicorn agui-service.agui_server:app --reload
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Any, Dict, List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from openai import OpenAI

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env.agui"), override=True)

AGUI_API_KEY = os.getenv("AGUI_API_KEY")
AGUI_AGENT_ID = os.getenv("AGUI_AGENT_ID")

if not AGUI_API_KEY or not AGUI_AGENT_ID:  # pragma: no cover
    raise RuntimeError(
        "AGUI_API_KEY or AGUI_AGENT_ID is missing. Set them in agui-service/.env.agui"
    )


@lru_cache(maxsize=1)
def get_client() -> OpenAI:
    """Instantiate the OpenAI client once."""
    return OpenAI(api_key=AGUI_API_KEY)


class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Extra context to forward to the agent (e.g. selected article).",
    )


class ToolResult(BaseModel):
    name: str
    arguments: Dict[str, Any]


class ChatResponse(BaseModel):
    reply: str
    tool_calls: List[ToolResult] = []


app = FastAPI(title="AG-UI Bridge", version="0.1.0")


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    client = get_client()

    try:
        # Convert messages to OpenAI format
        openai_messages = [
            {"role": msg.role, "content": msg.content} 
            for msg in request.messages
        ]
        
        # Add system message if not present
        if not any(msg.role == "system" for msg in request.messages):
            openai_messages.insert(0, {
                "role": "system", 
                "content": f"Você é o XomanoAI, um assistente inteligente de notícias brasileiro. Responda sempre em português brasileiro informal e amigável. Use gírias brasileiras e emojis quando apropriado. Agent ID: {AGUI_AGENT_ID}"
            })

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=openai_messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        reply_text = response.choices[0].message.content or ""
        
        # For now, we don't have tool calls, but we can add them later
        tool_calls = []

    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    normalized_tools = [
        ToolResult(
            name=call.get("name"),
            arguments=call.get("arguments", {}),
        )
        for call in tool_calls or []
    ]

    return ChatResponse(reply=reply_text or "", tool_calls=normalized_tools)
