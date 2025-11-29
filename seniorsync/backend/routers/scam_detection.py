"""Scam detection router"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.openai_service import analyze_scam

router = APIRouter()

class ScamCheckRequest(BaseModel):
    message: str
    language: str = 'en-US'  # Default to English

class ScamCheckResponse(BaseModel):
    risk_level: str  # 'safe', 'warning', 'danger'
    explanation: str
    indicators: List[str]

@router.post("/analyze", response_model=ScamCheckResponse)
async def check_scam(request: ScamCheckRequest):
    """
    Analyze a message for scam indicators
    """
    try:
        result = await analyze_scam(request.message, request.language)
        return ScamCheckResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Pre-loaded demo examples
DEMO_SCAMS = [
    {
        "message": "URGENT: Your bank account will be closed in 24 hours. Click here to verify: http://fake-bank.com",
        "risk_level": "danger",
        "explanation": "This is a dangerous scam. Real banks never ask you to click links in messages or threaten to close your account suddenly.",
        "indicators": ["Creates false urgency", "Suspicious link", "Threatens account closure", "Not from official bank contact"]
    },
    {
        "message": "Hi Grandma, it's me! I'm in trouble and need money urgently. Can you send $500 via gift cards?",
        "risk_level": "danger",
        "explanation": "This is a 'grandparent scam.' Scammers pretend to be family members in trouble. Always verify by calling your family member directly.",
        "indicators": ["Impersonation", "Urgent money request", "Asks for gift cards", "Creates emotional pressure"]
    },
    {
        "message": "You've won a $10,000 prize! Send us $200 processing fee to claim your winnings.",
        "risk_level": "danger",
        "explanation": "This is a classic prize scam. You never have to pay to receive a legitimate prize.",
        "indicators": ["Too good to be true", "Requests money upfront", "No legitimate source", "Unsolicited prize claim"]
    },
    {
        "message": "Your prescription is ready for pickup at CVS Pharmacy. Reply YES to confirm.",
        "risk_level": "warning",
        "explanation": "This could be legitimate if you have a prescription at CVS. However, verify by calling your pharmacy directly, not replying to this message.",
        "indicators": ["Could be legitimate", "Verify through official channels", "Don't reply to unknown numbers"]
    },
    {
        "message": "Hi Mom, just checking in! How was your doctor appointment today? Love you!",
        "risk_level": "safe",
        "explanation": "This appears to be a genuine message from a family member checking on you.",
        "indicators": ["Personal and caring tone", "No requests for money or information", "Appears legitimate"]
    }
]

@router.get("/examples")
async def get_demo_examples():
    """Get pre-loaded scam examples for demo"""
    return {"examples": DEMO_SCAMS}
