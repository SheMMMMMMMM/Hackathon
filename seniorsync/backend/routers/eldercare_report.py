"""ElderCare Report Router - Sends daily health reports to external database"""
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

router = APIRouter()

# Your colleague's database API endpoint
ELDERCARE_BACKEND_URL = "https://uncatered-debi-nonflexibly.ngrok-free.dev/api/report/daily"

class DailyHealthReport(BaseModel):
    userId: int
    sleepHours: Optional[int] = None
    moodRating: Optional[int] = None
    pain: str
    painSeverity: int
    medicationsTaken: str
    meals: str
    healthConcerns: str

class ReportResponse(BaseModel):
    success: bool
    message: str
    backend_response: Optional[Dict[Any, Any]] = None

@router.post("/send-report", response_model=ReportResponse)
async def send_report_to_eldercare(report: DailyHealthReport):
    """
    Send daily health report to the ElderCare database
    """
    try:
        # Prepare report data
        report_data = report.dict()
        
        print(f"Sending report to ElderCare backend: {report_data}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ELDERCARE_BACKEND_URL,
                json=report_data,
                timeout=10.0
            )
            
            if response.status_code == 200:
                return ReportResponse(
                    success=True,
                    message="Health report successfully saved to database",
                    backend_response=response.json()
                )
            else:
                print(f"ElderCare backend error: {response.status_code} - {response.text}")
                return ReportResponse(
                    success=False,
                    message=f"Database error: {response.status_code}",
                    backend_response=None
                )
    
    except httpx.TimeoutException:
        return ReportResponse(
            success=False,
            message="Database connection timeout",
            backend_response=None
        )
    except Exception as e:
        print(f"Error sending to ElderCare backend: {str(e)}")
        return ReportResponse(
            success=False,
            message=f"Error: {str(e)}",
            backend_response=None
        )

@router.get("/test")
async def test_connection():
    """
    Test connection to ElderCare database
    """
    try:
        test_report = {
            "user_id": "test_user",
            "user_name": "Test User",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "summary": "Test connection to ElderCare database",
            "timestamp": datetime.now().isoformat()
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ELDERCARE_BACKEND_URL,
                json=test_report,
                timeout=10.0
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message": "Connection to ElderCare database successful!",
                    "response": response.json()
                }
            else:
                return {
                    "success": False,
                    "message": f"Connection failed: {response.status_code}",
                    "error": response.text
                }
    except Exception as e:
        return {
            "success": False,
            "message": "Connection failed",
            "error": str(e)
        }
