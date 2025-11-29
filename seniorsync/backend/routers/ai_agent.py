"""AI Agent chat router"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from services.openai_service import chat_with_ai

router = APIRouter()

class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    user_context: Optional[Dict] = None

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with the AI agent
    """
    try:
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        response = await chat_with_ai(messages_dict, request.user_context)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
