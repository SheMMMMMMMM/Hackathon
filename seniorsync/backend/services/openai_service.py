"""OpenAI service for AI conversations and analysis"""
import os
from openai import OpenAI
from typing import List, Dict

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

ELDERLY_SYSTEM_PROMPT = """You are a patient, respectful AI companion for elderly users. 
Your role is to:
- Use simple, clear language without technical jargon
- Speak warmly and respectfully, like a caring friend
- Confirm understanding often and repeat information if needed
- Prioritize safety and wellbeing
- Be patient with mishearing or confusion
- Offer help proactively but not intrusively
- Alert family members if you detect concerning patterns
- Ask for the user's name and preferences naturally in conversation
- Remember details they share with you throughout the conversation
- Respond in the user's preferred language automatically
- If the user speaks to you in a different language, respond in that same language

Remember: Your users may have vision issues, hearing difficulties, or memory concerns. 
Always be kind, patient, and supportive. Learn about them through natural conversation.
Adapt to their language automatically without mentioning the language switch."""

async def chat_with_ai(messages: List[Dict[str, str]], user_context: Dict = None) -> str:
    """
    Chat with OpenAI API
    
    Args:
        messages: List of message dicts with 'role' and 'content'
        user_context: Optional user context (name, age, medications, etc.)
    
    Returns:
        AI response text
    """
    try:
        # Build system prompt with context
        system_prompt = ELDERLY_SYSTEM_PROMPT
        if user_context:
            context_info = f"\n\nUser Information:\n"
            if user_context.get("age"):
                context_info += f"Age: {user_context['age']}\n"
            if user_context.get("medications"):
                context_info += f"Current Medications: {', '.join(user_context['medications'])}\n"
            system_prompt += context_info
        
        # Prepare messages
        full_messages = [{"role": "system", "content": system_prompt}] + messages
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # or "gpt-4" for better quality
            messages=full_messages,
            temperature=0.7,
            max_tokens=500
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")

async def analyze_scam(message: str, language: str = 'en-US') -> Dict:
    """
    Analyze a message for scam indicators
    
    Returns:
        {
            'risk_level': 'safe' | 'warning' | 'danger',
            'explanation': 'Simple explanation',
            'indicators': List of red flags found
        }
    """
    try:
        # Map language codes to language names
        language_map = {
            'en-US': 'English',
            'sk-SK': 'Slovak',
            'cs-CZ': 'Czech',
            'de-DE': 'German'
        }
        lang_name = language_map.get(language, 'English')
        
        prompt = f"""Analyze this message for scam indicators. Look for:
- Urgency or threats (act now, limited time)
- Requests for money, gift cards, or personal information
- Grammar/spelling errors
- Impersonation of banks, government, family
- Too-good-to-be-true offers
- Suspicious links or phone numbers

Message: "{message}"

IMPORTANT: Respond in {lang_name} language.

Respond in JSON format:
{{
    "risk_level": "safe" | "warning" | "danger",
    "explanation": "Simple explanation suitable for elderly users (2-3 sentences) in {lang_name}",
    "indicators": ["list", "of", "red", "flags", "in", "{lang_name}"]
}}"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a scam detection expert helping elderly users stay safe. Explain findings simply and clearly."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        import json
        return json.loads(response.choices[0].message.content)
    
    except Exception as e:
        raise Exception(f"Scam analysis error: {str(e)}")

async def check_fact(claim: str, context: str = None, language: str = 'en-US') -> Dict:
    """
    Verify a claim or news story
    
    Returns:
        {
            'verdict': 'true' | 'false' | 'unclear',
            'confidence': 'high' | 'medium' | 'low',
            'explanation': 'Simple explanation',
            'sources': List of source references
        }
    """
    try:
        # Map language codes to language names
        language_map = {
            'en-US': 'English',
            'sk-SK': 'Slovak',
            'cs-CZ': 'Czech',
            'de-DE': 'German'
        }
        lang_name = language_map.get(language, 'English')
        
        prompt = f"""Verify this claim using your knowledge. 

Claim: "{claim}"
{f'Context: {context}' if context else ''}

Provide a simple explanation suitable for elderly users. Be honest about uncertainty.

IMPORTANT: Respond in {lang_name} language.

Respond in JSON format:
{{
    "verdict": "true" | "false" | "unclear",
    "confidence": "high" | "medium" | "low",
    "explanation": "Simple 2-3 sentence explanation in {lang_name}",
    "sources": ["source1 in {lang_name}", "source2 in {lang_name}"]
}}"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a fact-checker helping elderly users verify information. Be clear, honest, and simple."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        import json
        return json.loads(response.choices[0].message.content)
    
    except Exception as e:
        raise Exception(f"Fact checking error: {str(e)}")
