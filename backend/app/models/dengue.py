from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from beanie import Document, Indexed
from pydantic import EmailStr, Field

class User(Document):
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None # Base64 or URL
    role: str = "user" # user, doctor, admin
    is_active: bool = True
    is_verified: bool = False
    notifications_enabled: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "users"

class OTPRecord(Document):
    email: Indexed(EmailStr)
    otp_code: str
    purpose: str # signup, login, reset
    expires_at: datetime
    
    class Settings:
        name = "otp_records"

class DiagnosisReport(Document):
    user_id: Indexed(str) # String representation of User ID
    symptoms: Dict[str, Any]
    ml_prediction: Dict[str, Any]
    kbs_recommendation: Dict[str, Any]
    doctor_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "diagnosis_reports"

class RuleDocument(Document):
    rule_name: str
    conditions: Dict[str, Any]
    results: Dict[str, Any]
    priority: int = 1
    
    class Settings:
        name = "knowledge_rules"

class Notification(Document):
    user_id: Indexed(str)
    title: str
    message: str
    type: str # info, warning, success, alert
    is_read: bool = False
    related_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "notifications"
