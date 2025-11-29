"""Twilio service for SMS and voice calls"""
import os
from twilio.rest import Client

# Initialize Twilio client
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")

client = None
if account_sid and auth_token:
    client = Client(account_sid, auth_token)

async def send_sms(to_number: str, message: str) -> bool:
    """
    Send SMS via Twilio
    
    Args:
        to_number: Recipient phone number (E.164 format)
        message: Message text
    
    Returns:
        True if successful
    """
    try:
        if not client:
            raise Exception("Twilio not configured")
        
        message = client.messages.create(
            body=message,
            from_=twilio_phone,
            to=to_number
        )
        
        return message.sid is not None
    
    except Exception as e:
        raise Exception(f"SMS sending error: {str(e)}")

async def send_emergency_alert(to_numbers: list, user_name: str, location: str = None) -> bool:
    """
    Send emergency alert to family members
    
    Args:
        to_numbers: List of family phone numbers
        user_name: Name of the elderly user
        location: Optional location information
    
    Returns:
        True if at least one message sent successfully
    """
    try:
        message_text = f"🚨 EMERGENCY ALERT: {user_name} has pressed the emergency button."
        if location:
            message_text += f"\nLocation: {location}"
        message_text += "\nPlease check on them immediately."
        
        success_count = 0
        for number in to_numbers:
            try:
                await send_sms(number, message_text)
                success_count += 1
            except:
                continue
        
        return success_count > 0
    
    except Exception as e:
        raise Exception(f"Emergency alert error: {str(e)}")
