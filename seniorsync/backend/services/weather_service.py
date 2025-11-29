"""Weather service using OpenWeather API"""
import os
import requests

async def get_weather(latitude: float, longitude: float) -> dict:
    """
    Get weather for a location using OpenWeather API
    
    Returns:
        {
            'temperature': float,
            'description': str,
            'icon': str
        }
    """
    try:
        api_key = os.getenv("OPENWEATHER_API_KEY")
        
        if not api_key:
            print("WARNING: OPENWEATHER_API_KEY not found in environment variables")
            return get_mock_weather()
        
        print(f"Fetching weather for lat={latitude}, lon={longitude}")
        
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": api_key,
            "units": "metric"  # Use Celsius
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        print(f"Weather API response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Weather API error response: {data}")
            return get_mock_weather()
        
        weather_data = {
            "temperature": round(data["main"]["temp"]),
            "description": data["weather"][0]["description"].title(),
            "icon": data["weather"][0]["icon"],
            "humidity": data["main"]["humidity"],
            "feels_like": round(data["main"]["feels_like"]),
            "city": data.get("name", "Your location")
        }
        
        print(f"Weather data: {weather_data}")
        return weather_data
    
    except Exception as e:
        print(f"Weather API error: {str(e)}")
        import traceback
        traceback.print_exc()
        return get_mock_weather()

def get_mock_weather() -> dict:
    """Return mock weather data based on time of day"""
    from datetime import datetime
    hour = datetime.now().hour
    
    # Determine if it's night (6 PM to 6 AM)
    is_night = hour >= 18 or hour < 6
    
    # Adjust weather based on time
    if is_night:
        return {
            "temperature": 8,
            "description": "Clear Night",
            "icon": "01n",
            "humidity": 65,
            "feels_like": 6,
            "city": "Your location"
        }
    else:
        return {
            "temperature": 15,
            "description": "Partly Cloudy",
            "icon": "02d",
            "humidity": 55,
            "feels_like": 14,
            "city": "Your location"
        }
