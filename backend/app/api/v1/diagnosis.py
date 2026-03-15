from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Dict, Any, List
from app.ml.model import DenguePredictor
from app.engine.inference import ForwardChainingEngine, DENGUE_RULES
from app.api.v1.auth import get_current_user
from app.models.dengue import User, DiagnosisReport
from app.schemas.diagnosis import DiagnosisResponse, UserStats
from datetime import datetime

router = APIRouter()

# Initialize ML Predictor
predictor = DenguePredictor()
# Initialize KBS
kbs_engine = ForwardChainingEngine(DENGUE_RULES)

@router.post("/symptoms")
async def diagnose_symptoms(symptoms: Dict[str, Any], current_user: User = Depends(get_current_user)):
    """Receives user symptoms and returns diagnosis. Saves to MongoDB."""
    
    # ML Prediction
    ml_result = predictor.predict(symptoms)
    if "error" in ml_result:
        ml_result = {"stage_name": "Consulting KBS...", "probability": 0.0}

    # KBS Inference
    facts = symptoms.copy()
    facts.update({"ml_prediction": ml_result.get("stage_name", "Unknown")})
    
    kbs_result, applied_rules = kbs_engine.infer(facts)
    
    conclusions = {k: v for k, v in kbs_result.items() if k not in symptoms}
    
    diagnosis_summary = {
        "disease_detection": conclusions.get("disease_detection", "Inconclusive / Pending Clinical Review"),
        "risk_classification": conclusions.get("risk_classification", "Unknown"),
        "explainable_reasoning": applied_rules,
        "clinical_recommendations": conclusions.get("clinical_recommendations", "Please consult a healthcare professional."),
        "alert_system": conclusions.get("alert_system", "Routine Evaluation"),
        "ml_model_result": ml_result
    }

    # Save to MongoDB
    report = DiagnosisReport(
        user_id=str(current_user.id),
        symptoms=symptoms,
        ml_prediction=ml_result,
        kbs_recommendation=diagnosis_summary
    )
    await report.insert()
    
    return {
        "status": "success",
        "report_id": str(report.id),
        "diagnosis": diagnosis_summary
    }

@router.get("/history", response_model=List[DiagnosisResponse])
async def get_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Returns recent diagnosis reports for the current user."""
    reports = await DiagnosisReport.find(
        DiagnosisReport.user_id == str(current_user.id)
    ).sort("-created_at").limit(limit).to_list()
    
    return [
        DiagnosisResponse(
            id=str(r.id),
            symptoms=r.symptoms,
            ml_prediction=r.ml_prediction,
            kbs_recommendation=r.kbs_recommendation,
            created_at=r.created_at
        ) for r in reports
    ]

@router.get("/stats", response_model=UserStats)
async def get_stats(current_user: User = Depends(get_current_user)):
    """Calculates statistics for the user profile."""
    reports = await DiagnosisReport.find(
        DiagnosisReport.user_id == str(current_user.id)
    ).to_list()
    
    risk_summary = {}
    for r in reports:
        risk = r.kbs_recommendation.get("risk_classification", "Unknown")
        risk_summary[risk] = risk_summary.get(risk, 0) + 1
        
    last_date = None
    if reports:
        last_date = max(r.created_at for r in reports)
        
    return UserStats(
        total_diagnoses=len(reports),
        risk_summary=risk_summary,
        last_diagnosis_date=last_date
    )

@router.get("/report/{report_id}", response_model=DiagnosisResponse)
async def get_report_detail(report_id: str, current_user: User = Depends(get_current_user)):
    """Returns details of a specific report."""
    report = await DiagnosisReport.get(report_id)
    if not report or report.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Report not found")
    
    return DiagnosisResponse(
        id=str(report.id),
        symptoms=report.symptoms,
        ml_prediction=report.ml_prediction,
        kbs_recommendation=report.kbs_recommendation,
        created_at=report.created_at
    )
