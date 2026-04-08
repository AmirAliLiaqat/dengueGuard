from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class DiagnosisRequest(BaseModel):
    symptoms: Dict[str, Any]

class DiagnosisResponse(BaseModel):
    id: str
    symptoms: Dict[str, Any]
    ml_prediction: Dict[str, Any]
    kbs_recommendation: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class DiagnosisReportUpdate(BaseModel):
    # Allow patching only safe fields on existing reports.
    doctor_notes: Optional[str] = None
    kbs_recommendation: Optional[Dict[str, Any]] = None
    ml_prediction: Optional[Dict[str, Any]] = None

class UserStats(BaseModel):
    total_diagnoses: int
    risk_summary: Dict[str, int] # e.g. {"High": 2, "Low": 5}
    last_diagnosis_date: Optional[datetime]
