from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from app.ml.model import DenguePredictor
from app.engine.inference import ForwardChainingEngine, DENGUE_RULES, KnowledgeRule

router = APIRouter()

# Initialize ML Predictor (assuming model trained/loaded)
predictor = DenguePredictor()
# Initialize KBS (with default rules for now)
kbs_engine = ForwardChainingEngine(DENGUE_RULES)

@router.post("/symptoms")
async def diagnose_symptoms(symptoms: Dict[str, Any]):
    """Receives user symptoms and returns diagnosis using ML + KBS."""
    
    # ML Prediction
    ml_result = predictor.predict(symptoms)
    if "error" in ml_result:
        # If model not trained, use a fallback mock or handle error
        ml_result = {"stage_name": "Consulting KBS...", "probability": 0.0}

    # KBS Inference
    # The KBS needs facts in a compatible format
    facts = symptoms.copy()
    facts.update({"ml_prediction": ml_result["stage_name"]})
    
    kbs_result, applied_rules = kbs_engine.infer(facts)
    
    # Extract only new facts (conclusions) from kbs_result
    conclusions = {k: v for k, v in kbs_result.items() if k not in symptoms}
    
    # Default values in case no rules fire
    disease_detection = conclusions.get("disease_detection", "Inconclusive / Pending Clinical Review")
    risk_classification = conclusions.get("risk_classification", "Unknown")
    clinical_recommendations = conclusions.get("clinical_recommendations", "Please consult a healthcare professional for a physical examination and medical advice.")
    alert_system = conclusions.get("alert_system", "Routine Evaluation")

    if not applied_rules:
        applied_rules.append("No specific risk rules triggered based on provided symptoms.")

    # Compile report matching requested structure exactly
    report = {
        "status": "success",
        "diagnosis": {
            "disease_detection": disease_detection,
            "risk_classification": risk_classification,
            "explainable_reasoning": applied_rules,
            "clinical_recommendations": clinical_recommendations,
            "alert_system": alert_system,
            "ml_model_result": ml_result # Keep original ML model result intact for context
        }
    }
    
    # TODO: In future, save to DB using user_id from JWT
    return report

@router.get("/rules")
async def get_kbs_rules():
    """Returns current active KBS rules."""
    return [{"id": r.id, "conditions": r.conditions, "results": r.results} for r in DENGUE_RULES]
