"""Mock SMS service for demo (Twilio removed)"""
import os

# Mock implementation - logs instead of sending real SMS

async def send_sms(to_number: str, message: str) -> bool:
    """
    Mock SMS sending (logs to console)
    
    Args:
        to_number: Recipient phone number (E.164 format)
        message: Message text
    
    Returns:
        True (always successful in demo mode)
    """
    print(f"[DEMO MODE - SMS] To: {to_number}")
    print(f"[DEMO MODE - SMS] Message: {message}")
    return True

async def send_emergency_alert(to_numbers: list, user_name: str, location: str = None) -> bool:
    """
    Mock emergency alert to family members (logs to console)
    
    Args:
        to_numbers: List of family phone numbers
        user_name: Name of the elderly user
        location: Optional location information
    
    Returns:
        True (always successful in demo mode)
    """
    print(f"\n{'='*60}")
    print(f"🚨 EMERGENCY ALERT - DEMO MODE")
    print(f"{'='*60}")
    print(f"User: {user_name}")
    print(f"Alert would be sent to {len(to_numbers)} contact(s):")
    
    for i, number in enumerate(to_numbers, 1):
        message = f"🚨 EMERGENCY: {user_name} needs help immediately!"
        if location:
            message += f" Location: {location}"
        message += " Please check on them right away."
        
        print(f"\n  Contact {i}: {number}")
        print(f"  Message: {message}")
    
    print(f"{'='*60}\n")
    return True
