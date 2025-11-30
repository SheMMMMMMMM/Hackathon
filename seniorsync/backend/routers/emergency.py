"""Emergency alert router"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.twilio_service import send_emergency_alert

router = APIRouter()

class EmergencyContact(BaseModel):
    name: str
    phone: str
    relationship: str

class EmergencyRequest(BaseModel):
    user_name: str
    contacts: List[EmergencyContact]
    location: Optional[str] = None

class EmergencyResponse(BaseModel):
    success: bool
    message: str
    alerts_sent: int

@router.post("/alert", response_model=EmergencyResponse)
async def send_alert(request: EmergencyRequest):
    """
    Send emergency alert to family contacts (DEMO MODE - logs to console)
    """
    try:
        phone_numbers = [contact.phone for contact in request.contacts]
        
        # Send alerts (demo mode - logs to console)
        success = await send_emergency_alert(phone_numbers, request.user_name, request.location)
        
        return EmergencyResponse(
            success=True,
            message=f"[DEMO MODE] Emergency alert logged for {len(phone_numbers)} contact(s). Check server console for details.",
            alerts_sent=len(phone_numbers)
        )
    
    except Exception as e:
        return EmergencyResponse(
            success=False,
            message=f"Error: {str(e)}",
            alerts_sent=0
        )
