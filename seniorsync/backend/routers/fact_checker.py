"""Fact checker router"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.openai_service import check_fact

router = APIRouter()

class FactCheckRequest(BaseModel):
    claim: str
    context: Optional[str] = None
    language: str = 'en-US'  # Default to English

class FactCheckResponse(BaseModel):
    verdict: str  # 'true', 'false', 'unclear'
    confidence: str  # 'high', 'medium', 'low'
    explanation: str
    sources: List[str]

@router.post("/check", response_model=FactCheckResponse)
async def check_claim(request: FactCheckRequest):
    """
    Verify a claim or news story
    """
    try:
        result = await check_fact(request.claim, request.context, request.language)
        return FactCheckResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
