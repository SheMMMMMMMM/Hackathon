"""Weather router"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.weather_service import get_weather

router = APIRouter()

class WeatherRequest(BaseModel):
    latitude: float
    longitude: float

class WeatherResponse(BaseModel):
    temperature: int
    description: str
    icon: str
    humidity: int
    feels_like: int
    city: str

@router.post("/current", response_model=WeatherResponse)
async def get_current_weather(request: WeatherRequest):
    """
    Get current weather for a location
    """
    try:
        weather = await get_weather(request.latitude, request.longitude)
        return WeatherResponse(**weather)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
