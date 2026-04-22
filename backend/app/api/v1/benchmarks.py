from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import json
import os

from app.api.v1.auth import get_current_user
from app.models.dengue import User, BenchmarkMetric

router = APIRouter()

# Path to model metadata produced by the training pipeline
_META_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
    "data", "model_meta.json"
)


@router.get("/model-info")
async def get_model_info():
    """
    Public endpoint returning the trained model's version and performance
    metrics.  No auth required — used by frontend dashboards.
    """
    if not os.path.exists(_META_PATH):
        return {
            "version": "1.0.0",
            "status": "legacy",
            "message": "No model metadata found.  Run train_model.py to generate.",
        }
    
    with open(_META_PATH, "r") as f:
        meta = json.load(f)
    
    return {
        "version": meta.get("version", "unknown"),
        "trained_on": meta.get("trained_on"),
        "dataset_size": meta.get("dataset_size"),
        "model_type": meta.get("model_type"),
        "label_strategy": meta.get("label_strategy"),
        "accuracy": meta.get("accuracy"),
        "auc_roc": meta.get("auc_roc"),
        "precision": meta.get("precision"),
        "recall": meta.get("recall"),
        "f1_score": meta.get("f1_score"),
        "cv_accuracy_mean": meta.get("cv_accuracy_mean"),
        "symptom_knowledge_entries": meta.get("symptom_knowledge_entries"),
        "features": meta.get("features"),
    }


class BenchmarkUpsert(BaseModel):
    key: str
    label: str
    metrics: Dict[str, float] = Field(default_factory=dict)
    citation: Optional[str] = None


@router.get("/", response_model=List[Dict[str, Any]])
async def list_benchmarks(current_user: User = Depends(get_current_user)):
    # Auth required because this is a medical-related comparison panel.
    items = await BenchmarkMetric.find_all().sort("-updated_at").to_list()
    return [
        {
            "key": b.key,
            "label": b.label,
            "metrics": b.metrics,
            "citation": b.citation,
            "updated_at": b.updated_at.isoformat(),
        }
        for b in items
    ]


@router.post("/", status_code=201)
async def upsert_benchmark(
    payload: BenchmarkUpsert, current_user: User = Depends(get_current_user)
):
    # Only admins can edit benchmarks.
    if getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")

    existing = await BenchmarkMetric.find_one(BenchmarkMetric.key == payload.key)
    if existing:
        existing.label = payload.label
        existing.metrics = payload.metrics
        existing.citation = payload.citation
        existing.updated_at = datetime.now(timezone.utc)
        await existing.save()
        return {"status": "success", "key": existing.key}

    doc = BenchmarkMetric(
        key=payload.key,
        label=payload.label,
        metrics=payload.metrics,
        citation=payload.citation,
        updated_at=datetime.now(timezone.utc),
    )
    await doc.insert()
    return {"status": "success", "key": doc.key}

