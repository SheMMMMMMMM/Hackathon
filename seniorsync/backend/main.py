from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="SeniorSync API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from routers import ai_agent, medication, scam_detection, emergency, activities, fact_checker, weather

# Include routers
app.include_router(ai_agent.router, prefix="/api/ai", tags=["AI Agent"])
app.include_router(medication.router, prefix="/api/medications", tags=["Medications"])
app.include_router(scam_detection.router, prefix="/api/scam", tags=["Scam Detection"])
app.include_router(emergency.router, prefix="/api/emergency", tags=["Emergency"])
app.include_router(activities.router, prefix="/api/activities", tags=["Activities"])
app.include_router(fact_checker.router, prefix="/api/fact-check", tags=["Fact Checker"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to SeniorSync API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
