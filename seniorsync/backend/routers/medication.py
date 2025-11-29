"""Medication management router"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

# In-memory storage (replace with database in production)
medications_db = {}

class Medication(BaseModel):
    id: Optional[str] = None
    user_id: str
    name: str
    dosage: str
    times: List[str]  # e.g., ["08:00", "20:00"]
    photo_url: Optional[str] = None
    instructions: Optional[str] = None
    created_at: Optional[str] = None

class MedicationLog(BaseModel):
    medication_id: str
    taken_at: str
    confirmed: bool

@router.post("/", response_model=Medication)
async def create_medication(medication: Medication):
    """Add a new medication"""
    import uuid
    medication.id = str(uuid.uuid4())
    medication.created_at = datetime.now().isoformat()
    medications_db[medication.id] = medication
    return medication

@router.get("/{user_id}", response_model=List[Medication])
async def get_medications(user_id: str):
    """Get all medications for a user"""
    user_meds = [med for med in medications_db.values() if med.user_id == user_id]
    return user_meds

@router.put("/{medication_id}", response_model=Medication)
async def update_medication(medication_id: str, medication: Medication):
    """Update a medication"""
    if medication_id not in medications_db:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    medication.id = medication_id
    medications_db[medication_id] = medication
    return medication

@router.delete("/{medication_id}")
async def delete_medication(medication_id: str):
    """Delete a medication"""
    if medication_id not in medications_db:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    del medications_db[medication_id]
    return {"message": "Medication deleted successfully"}
