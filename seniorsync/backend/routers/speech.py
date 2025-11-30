"""Speech-to-text router using OpenAI Whisper"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from openai import OpenAI
import os
import tempfile
from typing import Optional

router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None)
):
    """
    Transcribe audio file to text using OpenAI Whisper
    
    Args:
        audio: Audio file (mp3, mp4, mpeg, mpga, m4a, wav, webm)
        language: Optional language code (en, de, cs, sk, etc.)
    
    Returns:
        Transcribed text
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Transcribe using Whisper
        with open(temp_file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=language  # Optional: specify language for better accuracy
            )
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        return {
            "success": True,
            "text": transcript.text
        }
    
    except Exception as e:
        # Clean up temp file on error
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )

@router.post("/transcribe-translate")
async def transcribe_and_translate(
    audio: UploadFile = File(...),
    target_language: str = Form("en")
):
    """
    Transcribe audio and translate to English
    
    Args:
        audio: Audio file
        target_language: Target language (default: en)
    
    Returns:
        Transcribed and translated text
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Translate using Whisper (translates to English)
        with open(temp_file_path, "rb") as audio_file:
            translation = client.audio.translations.create(
                model="whisper-1",
                file=audio_file
            )
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        return {
            "success": True,
            "text": translation.text,
            "language": target_language
        }
    
    except Exception as e:
        # Clean up temp file on error
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )
