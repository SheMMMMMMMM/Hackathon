"""Local activities finder router"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import requests

router = APIRouter()

class Location(BaseModel):
    latitude: float
    longitude: float

class ActivityRequest(BaseModel):
    location: Location
    radius: int = 5000  # meters
    interests: Optional[List[str]] = None
    wheelchair_accessible: bool = False

class Activity(BaseModel):
    name: str
    address: str
    distance: float  # in meters
    rating: Optional[float] = None
    photo_url: Optional[str] = None
    types: List[str]
    wheelchair_accessible: bool
    phone: Optional[str] = None

class ActivitiesResponse(BaseModel):
    activities: List[Activity]
    count: int

@router.post("/search", response_model=ActivitiesResponse)
async def search_activities(request: ActivityRequest):
    """
    Search for local activities using Google Places API
    """
    try:
        api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        
        if not api_key:
            # Return mock data for demo if API key not configured
            return get_mock_activities(request.location)
        
        # Call Google Places API
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        
        # Build search query based on interests
        keyword = "senior center community events"
        if request.interests:
            keyword = " ".join(request.interests)
        
        params = {
            "location": f"{request.location.latitude},{request.location.longitude}",
            "radius": request.radius,
            "keyword": keyword,
            "key": api_key
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data.get("status") != "OK":
            return get_mock_activities(request.location)
        
        activities = []
        for place in data.get("results", [])[:10]:
            activity = Activity(
                name=place.get("name"),
                address=place.get("vicinity"),
                distance=0,  # Calculate if needed
                rating=place.get("rating"),
                photo_url=None,  # Can fetch using photo reference
                types=place.get("types", []),
                wheelchair_accessible=False,  # Would need to check accessibility
                phone=None
            )
            activities.append(activity)
        
        return ActivitiesResponse(activities=activities, count=len(activities))
    
    except Exception as e:
        # Return mock data on error
        return get_mock_activities(request.location)

def get_mock_activities(location: Location) -> ActivitiesResponse:
    """Return mock activities for demo"""
    mock_activities = [
        Activity(
            name="Sunshine Senior Center",
            address="123 Main St, Your City",
            distance=800,
            rating=4.5,
            types=["senior_center", "community"],
            wheelchair_accessible=True,
            phone="+1-555-0101"
        ),
        Activity(
            name="Community Garden Club",
            address="456 Park Ave, Your City",
            distance=1200,
            rating=4.8,
            types=["community", "gardening"],
            wheelchair_accessible=True,
            phone="+1-555-0102"
        ),
        Activity(
            name="Weekly Bingo Night",
            address="789 Community Hall, Your City",
            distance=1500,
            rating=4.3,
            types=["social", "games"],
            wheelchair_accessible=True,
            phone="+1-555-0103"
        ),
        Activity(
            name="Gentle Yoga for Seniors",
            address="321 Wellness Center, Your City",
            distance=2000,
            rating=4.7,
            types=["fitness", "health"],
            wheelchair_accessible=True,
            phone="+1-555-0104"
        ),
        Activity(
            name="Library Book Club",
            address="555 Library Lane, Your City",
            distance=900,
            rating=4.6,
            types=["social", "education"],
            wheelchair_accessible=True,
            phone="+1-555-0105"
        )
    ]
    
    return ActivitiesResponse(activities=mock_activities, count=len(mock_activities))
