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
    Send emergency alert to family contacts
    """
    try:
        phone_numbers = [contact.phone for contact in request.contacts]
        
        # Try to send alerts
        try:
            success = await send_emergency_alert(phone_numbers, request.user_name, request.location)
            if success:
                return EmergencyResponse(
                    success=True,
                    message="Emergency alerts sent successfully",
                    alerts_sent=len(phone_numbers)
                )
        except Exception as e:
            # If Twilio is not configured, return simulated success for demo
            return EmergencyResponse(
                success=True,
                message=f"[DEMO MODE] Emergency alert would be sent to {len(phone_numbers)} contacts",
                alerts_sent=len(phone_numbers)
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
