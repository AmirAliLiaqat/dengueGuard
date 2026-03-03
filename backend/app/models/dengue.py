from sqlalchemy import Column, Integer, String, Boolean, Float, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="user")  # user, doctor, admin
    is_active = Column(Boolean, default=True)
    diagnosis_history = relationship("DiagnosisHistory", back_populates="owner")

class DiagnosisHistory(Base):
    __tablename__ = "diagnosis_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Symptom data stored as JSON
    symptoms = Column(JSON)  # {"fever": 4, "platelets": 100000, ...}
    
    # Results from ML and KBS
    ml_prediction = Column(JSON)  # {"stage": "Mild", "prob": 0.85}
    kbs_recommendation = Column(JSON) # {"recommendation": "Rest", "explanation": "..."}
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner = relationship("User", back_populates="diagnosis_history")

class KnowledgeRule(Base):
    __tablename__ = "knowledge_rules"
    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String)
    conditions = Column(JSON) # {"fever": ">3", "platelets": "<150000"}
    results = Column(JSON)    # {"probability": "high", "stage": "warning"}
    priority = Column(Integer, default=1)

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specialization = Column(String)
    verified = Column(Boolean, default=False)
    user = relationship("User")
